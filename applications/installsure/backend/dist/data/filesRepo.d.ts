import { File } from '../types/files.js';
export declare class FilesRepository {
    findAll(requestId?: string): Promise<File[]>;
    findById(id: number, requestId?: string): Promise<File | null>;
    create(data: {
        filename: string;
        original_name: string;
        file_path: string;
        file_size: number;
        file_type: string;
    }, requestId?: string): Promise<File>;
    delete(id: number, requestId?: string): Promise<boolean>;
    findByFilename(filename: string, requestId?: string): Promise<File | null>;
    exists(id: number, requestId?: string): Promise<boolean>;
    getTotalSize(requestId?: string): Promise<number>;
    getFileCount(requestId?: string): Promise<number>;
    getStats(requestId?: string): Promise<{
        total: number;
        totalSize: number;
        byType: Record<string, number>;
    }>;
}
export declare const filesRepo: FilesRepository;
//# sourceMappingURL=filesRepo.d.ts.map