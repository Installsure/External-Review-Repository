import { Request, Response, NextFunction } from 'express';
export interface CacheOptions {
    ttl?: number;
    prefix?: string;
    keyGenerator?: (req: Request) => string;
    condition?: (req: Request, res: Response) => boolean;
}
export declare const cacheMiddleware: (options?: CacheOptions) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const invalidateCache: (patterns: string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cached: (options?: CacheOptions) => (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const warmCache: (key: string, dataFetcher: () => Promise<any>, options?: CacheOptions) => Promise<any>;
export declare const getCacheStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=cache.d.ts.map