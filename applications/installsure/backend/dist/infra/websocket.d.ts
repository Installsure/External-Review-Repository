import { WebSocket } from 'ws';
import { Server } from 'http';
export interface AuthenticatedWebSocket extends WebSocket {
    userId?: number;
    userEmail?: string;
    userRole?: string;
    companyId?: number;
    isAlive?: boolean;
}
export interface WebSocketMessage {
    type: 'notification' | 'project_update' | 'file_upload' | 'forge_status' | 'qb_sync' | 'ping' | 'pong';
    payload: any;
    timestamp?: string;
    userId?: number;
    companyId?: number;
}
export declare class WebSocketManager {
    private wss;
    private connections;
    private companyConnections;
    constructor(server: Server);
    private setupWebSocketServer;
    private extractTokenFromRequest;
    private addConnection;
    private removeConnection;
    private handleMessage;
    private sendMessage;
    sendToUser(userId: number, message: Omit<WebSocketMessage, 'userId' | 'companyId'>): void;
    sendToCompany(companyId: number, message: Omit<WebSocketMessage, 'userId' | 'companyId'>): void;
    broadcastToAll(message: Omit<WebSocketMessage, 'userId' | 'companyId'>): void;
    sendProjectUpdate(projectId: number, update: any, companyId?: number): void;
    sendFileUploadStatus(fileId: number, status: string, userId: number): void;
    sendForgeProcessingStatus(urn: string, status: string, userId: number): void;
    sendQuickBooksSyncStatus(syncId: number, status: string, companyId: number): void;
    sendNotification(userId: number, notification: any): void;
    private startHeartbeat;
    getConnectionStats(): {
        totalConnections: number;
        userConnections: number;
        companyConnections: number;
    };
    close(callback?: () => void): void;
}
export declare let webSocketManager: WebSocketManager | null;
export declare const initializeWebSocket: (server: Server) => WebSocketManager;
//# sourceMappingURL=websocket.d.ts.map