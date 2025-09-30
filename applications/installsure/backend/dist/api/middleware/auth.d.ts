import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: string;
                companyId?: number;
            };
        }
    }
}
export interface JWTPayload {
    userId: number;
    email: string;
    role: string;
    companyId?: number;
    iat?: number;
    exp?: number;
}
export declare const generateToken: (payload: Omit<JWTPayload, "iat" | "exp">) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map