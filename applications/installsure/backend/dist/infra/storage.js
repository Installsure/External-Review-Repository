import { config } from './config.js';
import { logger } from './logger.js';
import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';
class LocalStorageProvider {
    baseDir;
    constructor(baseDir) {
        this.baseDir = baseDir;
    }
    async ensureDir(dirPath) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        }
        catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }
    getFilePath(key) {
        return path.join(this.baseDir, key);
    }
    async upload(buffer, key) {
        const filePath = this.getFilePath(key);
        const dirPath = path.dirname(filePath);
        await this.ensureDir(dirPath);
        await fs.writeFile(filePath, buffer);
        logger.debug({ key, size: buffer.length }, 'File uploaded to local storage');
        return {
            key,
            url: `/files/${key}`,
            size: buffer.length,
        };
    }
    async download(key) {
        const filePath = this.getFilePath(key);
        return fs.readFile(filePath);
    }
    async delete(key) {
        const filePath = this.getFilePath(key);
        await fs.unlink(filePath);
        logger.debug({ key }, 'File deleted from local storage');
    }
    async exists(key) {
        const filePath = this.getFilePath(key);
        try {
            await fs.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    async getUrl(key) {
        return `/files/${key}`;
    }
}
class S3StorageProvider {
    // S3 implementation would go here
    // For now, throw an error to indicate it's not implemented
    async upload(buffer, key) {
        throw new Error('S3 storage not implemented yet');
    }
    async download(key) {
        throw new Error('S3 storage not implemented yet');
    }
    async delete(key) {
        throw new Error('S3 storage not implemented yet');
    }
    async exists(key) {
        throw new Error('S3 storage not implemented yet');
    }
    async getUrl(key) {
        throw new Error('S3 storage not implemented yet');
    }
}
export const createStorageProvider = () => {
    if (config.S3_ENDPOINT && config.S3_BUCKET) {
        logger.info('Using S3 storage provider');
        return new S3StorageProvider();
    }
    else {
        logger.info({ baseDir: config.FILES_LOCAL_DIR }, 'Using local storage provider');
        return new LocalStorageProvider(config.FILES_LOCAL_DIR);
    }
};
export const storage = createStorageProvider();
// Utility function to generate unique file keys
export const generateFileKey = (originalName, prefix = 'uploads') => {
    const timestamp = Date.now();
    const hash = createHash('md5').update(originalName + timestamp).digest('hex').substring(0, 8);
    const ext = path.extname(originalName);
    return `${prefix}/${timestamp}-${hash}${ext}`;
};
//# sourceMappingURL=storage.js.map