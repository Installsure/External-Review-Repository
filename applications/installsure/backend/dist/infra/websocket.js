import { WebSocketServer, WebSocket } from 'ws';
import { logger } from './logger.js';
import { verifyToken } from '../api/middleware/auth.js';
export class WebSocketManager {
    wss;
    connections = new Map();
    companyConnections = new Map();
    constructor(server) {
        this.wss = new WebSocketServer({
            server,
            path: '/ws',
        });
        this.setupWebSocketServer();
        this.startHeartbeat();
    }
    setupWebSocketServer() {
        this.wss.on('connection', (ws, request) => {
            logger.debug({
                ip: request.socket.remoteAddress,
                userAgent: request.headers['user-agent'],
            }, 'WebSocket connection attempt');
            // Handle authentication
            const token = this.extractTokenFromRequest(request);
            if (!token) {
                logger.warn('WebSocket connection rejected: No token provided');
                ws.close(1008, 'Authentication required');
                return;
            }
            try {
                const decoded = verifyToken(token);
                ws.userId = decoded.userId;
                ws.userEmail = decoded.email;
                ws.userRole = decoded.role;
                ws.companyId = decoded.companyId;
                ws.isAlive = true;
                // Add to connection maps
                this.addConnection(ws);
                logger.info({
                    userId: ws.userId,
                    email: ws.userEmail,
                    companyId: ws.companyId,
                }, 'WebSocket connection established');
                // Send welcome message
                this.sendMessage(ws, {
                    type: 'notification',
                    payload: {
                        message: 'Connected to InstallSure real-time updates',
                        userId: ws.userId,
                    },
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                logger.warn({
                    error: error.message,
                    ip: request.socket.remoteAddress,
                }, 'WebSocket authentication failed');
                ws.close(1008, 'Authentication failed');
                return;
            }
            // Handle messages
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(ws, message);
                }
                catch (error) {
                    logger.error({
                        error: error.message,
                        userId: ws.userId,
                    }, 'Invalid WebSocket message');
                }
            });
            // Handle pong responses
            ws.on('pong', () => {
                ws.isAlive = true;
            });
            // Handle connection close
            ws.on('close', () => {
                this.removeConnection(ws);
                logger.info({
                    userId: ws.userId,
                    email: ws.userEmail,
                }, 'WebSocket connection closed');
            });
            // Handle errors
            ws.on('error', (error) => {
                logger.error({
                    error: error.message,
                    userId: ws.userId,
                }, 'WebSocket error');
                this.removeConnection(ws);
            });
        });
    }
    extractTokenFromRequest(request) {
        // Try to get token from query parameter
        const url = new URL(request.url, `http://${request.headers.host}`);
        let token = url.searchParams.get('token');
        if (!token) {
            // Try to get token from Authorization header
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        return token;
    }
    addConnection(ws) {
        if (!ws.userId)
            return;
        // Add to user connections
        if (!this.connections.has(ws.userId)) {
            this.connections.set(ws.userId, new Set());
        }
        this.connections.get(ws.userId).add(ws);
        // Add to company connections
        if (ws.companyId) {
            if (!this.companyConnections.has(ws.companyId)) {
                this.companyConnections.set(ws.companyId, new Set());
            }
            this.companyConnections.get(ws.companyId).add(ws);
        }
    }
    removeConnection(ws) {
        if (!ws.userId)
            return;
        // Remove from user connections
        const userConnections = this.connections.get(ws.userId);
        if (userConnections) {
            userConnections.delete(ws);
            if (userConnections.size === 0) {
                this.connections.delete(ws.userId);
            }
        }
        // Remove from company connections
        if (ws.companyId) {
            const companyConnections = this.companyConnections.get(ws.companyId);
            if (companyConnections) {
                companyConnections.delete(ws);
                if (companyConnections.size === 0) {
                    this.companyConnections.delete(ws.companyId);
                }
            }
        }
    }
    handleMessage(ws, message) {
        switch (message.type) {
            case 'ping':
                this.sendMessage(ws, {
                    type: 'pong',
                    payload: { timestamp: new Date().toISOString() },
                    timestamp: new Date().toISOString(),
                });
                break;
            default:
                logger.debug({
                    type: message.type,
                    userId: ws.userId,
                }, 'Unknown WebSocket message type');
        }
    }
    sendMessage(ws, message) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }
    // Public methods for broadcasting messages
    sendToUser(userId, message) {
        const userConnections = this.connections.get(userId);
        if (userConnections) {
            const fullMessage = {
                ...message,
                userId,
                timestamp: new Date().toISOString(),
            };
            userConnections.forEach((ws) => {
                this.sendMessage(ws, fullMessage);
            });
        }
    }
    sendToCompany(companyId, message) {
        const companyConnections = this.companyConnections.get(companyId);
        if (companyConnections) {
            const fullMessage = {
                ...message,
                companyId,
                timestamp: new Date().toISOString(),
            };
            companyConnections.forEach((ws) => {
                this.sendMessage(ws, fullMessage);
            });
        }
    }
    broadcastToAll(message) {
        const fullMessage = {
            ...message,
            timestamp: new Date().toISOString(),
        };
        this.wss.clients.forEach((ws) => {
            this.sendMessage(ws, fullMessage);
        });
    }
    sendProjectUpdate(projectId, update, companyId) {
        const message = {
            type: 'project_update',
            payload: {
                projectId,
                update,
                message: 'Project has been updated',
            },
        };
        if (companyId) {
            this.sendToCompany(companyId, message);
        }
        else {
            this.broadcastToAll(message);
        }
    }
    sendFileUploadStatus(fileId, status, userId) {
        this.sendToUser(userId, {
            type: 'file_upload',
            payload: {
                fileId,
                status,
                message: `File upload ${status}`,
            },
        });
    }
    sendForgeProcessingStatus(urn, status, userId) {
        this.sendToUser(userId, {
            type: 'forge_status',
            payload: {
                urn,
                status,
                message: `Forge processing ${status}`,
            },
        });
    }
    sendQuickBooksSyncStatus(syncId, status, companyId) {
        this.sendToCompany(companyId, {
            type: 'qb_sync',
            payload: {
                syncId,
                status,
                message: `QuickBooks sync ${status}`,
            },
        });
    }
    sendNotification(userId, notification) {
        this.sendToUser(userId, {
            type: 'notification',
            payload: notification,
        });
    }
    startHeartbeat() {
        const interval = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (!ws.isAlive) {
                    logger.debug({
                        userId: ws.userId,
                    }, 'Terminating inactive WebSocket connection');
                    this.removeConnection(ws);
                    ws.terminate();
                    return;
                }
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000); // 30 seconds
        this.wss.on('close', () => {
            clearInterval(interval);
        });
    }
    getConnectionStats() {
        return {
            totalConnections: this.wss.clients.size,
            userConnections: this.connections.size,
            companyConnections: this.companyConnections.size,
        };
    }
    close(callback) {
        this.wss.close(callback);
    }
}
export let webSocketManager = null;
export const initializeWebSocket = (server) => {
    webSocketManager = new WebSocketManager(server);
    return webSocketManager;
};
//# sourceMappingURL=websocket.js.map