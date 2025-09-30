export interface StorageResult {
    key: string;
    url?: string;
    size: number;
}
export interface StorageProvider {
    upload(buffer: Buffer, key: string): Promise<StorageResult>;
    download(key: string): Promise<Buffer>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    getUrl(key: string): Promise<string>;
}
export declare const createStorageProvider: () => StorageProvider;
export declare const storage: StorageProvider;
export declare const generateFileKey: (originalName: string, prefix?: string) => string;
//# sourceMappingURL=storage.d.ts.map