import { db } from './db.js';
export class FilesRepository {
    async findAll(requestId) {
        const result = await db.query('SELECT * FROM files ORDER BY created_at DESC', [], requestId);
        return result.rows;
    }
    async findById(id, requestId) {
        const result = await db.query('SELECT * FROM files WHERE id = $1', [id], requestId);
        return result.rows[0] || null;
    }
    async create(data, requestId) {
        const result = await db.query('INSERT INTO files (filename, original_name, file_path, file_size, file_type) VALUES ($1, $2, $3, $4, $5) RETURNING *', [data.filename, data.original_name, data.file_path, data.file_size, data.file_type], requestId);
        return result.rows[0];
    }
    async delete(id, requestId) {
        const result = await db.query('DELETE FROM files WHERE id = $1', [id], requestId);
        return (result.rowCount ?? 0) > 0;
    }
    async findByFilename(filename, requestId) {
        const result = await db.query('SELECT * FROM files WHERE filename = $1', [filename], requestId);
        return result.rows[0] || null;
    }
    async exists(id, requestId) {
        const result = await db.query('SELECT 1 FROM files WHERE id = $1', [id], requestId);
        return (result.rowCount ?? 0) > 0;
    }
    async getTotalSize(requestId) {
        const result = await db.query('SELECT COALESCE(SUM(file_size), 0) as total_size FROM files', [], requestId);
        return parseInt(result.rows[0].total_size);
    }
    async getFileCount(requestId) {
        const result = await db.query('SELECT COUNT(*) as count FROM files', [], requestId);
        return parseInt(result.rows[0].count);
    }
    async getStats(requestId) {
        const [totalSize, total, byTypeResult] = await Promise.all([
            this.getTotalSize(requestId),
            this.getFileCount(requestId),
            db.query('SELECT file_type, COUNT(*) as count FROM files GROUP BY file_type', [], requestId),
        ]);
        const byType = {};
        byTypeResult.rows.forEach((row) => {
            byType[row.file_type] = parseInt(row.count);
        });
        return {
            total,
            totalSize,
            byType,
        };
    }
}
export const filesRepo = new FilesRepository();
//# sourceMappingURL=filesRepo.js.map