import { randomUUID } from 'crypto';
import { createRequestLogger } from '../../infra/logger.js';
export const requestIdMiddleware = (req, res, next) => {
    // Generate or extract request ID
    const requestId = req.headers['x-request-id'] || randomUUID();
    // Attach to request
    req.requestId = requestId;
    req.logger = createRequestLogger(requestId, req.method, req.url);
    // Add to response headers
    res.set('X-Request-ID', requestId);
    next();
};
//# sourceMappingURL=requestId.js.map