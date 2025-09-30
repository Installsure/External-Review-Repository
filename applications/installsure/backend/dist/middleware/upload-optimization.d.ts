import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
export interface OptimizedUploadOptions {
    maxFileSize: number;
    allowedMimeTypes: string[];
    chunkSize: number;
    tempDir: string;
}
export declare class UploadOptimizer {
    private options;
    constructor(options?: Partial<OptimizedUploadOptions>);
    createStorage(): multer.StorageEngine;
    createUploadMiddleware(): multer.Multer;
    private validateFile;
    private ensureDirectory;
    processFile(file: Express.Multer.File, requestId?: string): Promise<{
        id: string;
        originalName: string;
        size: number;
        hash: string;
        path: string;
        processedAt: string;
    }>;
    private calculateFileHash;
    private streamFile;
    private cleanupTempFile;
    static progressMiddleware(): (req: Request, res: Response, next: NextFunction) => void;
    static chunkedUploadMiddleware(): (req: Request, res: Response, next: NextFunction) => void;
}
export declare const createOptimizedUpload: (options?: Partial<OptimizedUploadOptions>) => multer.Multer;
export declare const optimizedUpload: multer.Multer;
//# sourceMappingURL=upload-optimization.d.ts.map