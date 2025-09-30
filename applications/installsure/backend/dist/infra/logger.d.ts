import pino from 'pino';
export declare const logger: pino.Logger<never, boolean>;
export declare const createChildLogger: (context?: Record<string, any>) => pino.Logger<never, boolean>;
export declare const createRequestLogger: (requestId: string, method: string, url: string) => pino.Logger<never, boolean>;
//# sourceMappingURL=logger.d.ts.map