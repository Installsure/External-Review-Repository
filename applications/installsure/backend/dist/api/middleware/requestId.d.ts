import { Request, Response, NextFunction } from 'express';
import { createRequestLogger } from '../../infra/logger.js';
declare global {
    namespace Express {
        interface Request {
            requestId: string;
            logger: ReturnType<typeof createRequestLogger>;
        }
    }
}
export declare const requestIdMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=requestId.d.ts.map