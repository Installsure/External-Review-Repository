import { File } from '../types/files.js';
export declare class FilesService {
    getAllFiles(requestId?: string): Promise<File[]>;
    getFileById(id: number, requestId?: string): Promise<File>;
    uploadFile(file: Express.Multer.File, requestId?: string): Promise<File>;
    deleteFile(id: number, requestId?: string): Promise<void>;
    getFileStats(requestId?: string): Promise<{
        total: number;
        totalSize: number;
        byType: Record<string, number>;
    }>;
}
export declare const filesService: FilesService;
//# sourceMappingURL=filesService.d.ts.map