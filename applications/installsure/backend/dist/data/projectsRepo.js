import { db } from './db.js';
// If running tests, use an in-memory repository to avoid DB dependency
const isTest = process.env.NODE_ENV === 'test';
export class ProjectsRepository {
    // In-memory store used only in test mode
    store = [];
    idCounter = 1;
    async findAll(requestId) {
        if (isTest) {
            // Return a shallow copy sorted by created_at desc
            return [...this.store].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        const result = await db.query('SELECT * FROM projects ORDER BY created_at DESC', [], requestId);
        return result.rows;
    }
    async findById(id, requestId) {
        if (isTest) {
            return this.store.find((p) => p.id === id) || null;
        }
        const result = await db.query('SELECT * FROM projects WHERE id = $1', [id], requestId);
        return result.rows[0] || null;
    }
    async create(data, requestId) {
        if (isTest) {
            const now = new Date().toISOString();
            const project = {
                id: this.idCounter++,
                name: data.name,
                description: data.description || null,
                created_at: now,
                updated_at: now,
            };
            this.store.push(project);
            return project;
        }
        const result = await db.query('INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *', [data.name, data.description || null], requestId);
        return result.rows[0];
    }
    async update(id, data, requestId) {
        if (isTest) {
            const idx = this.store.findIndex((p) => p.id === id);
            if (idx === -1)
                return null;
            const existing = this.store[idx];
            const updated = {
                ...existing,
                name: data.name !== undefined ? data.name : existing.name,
                description: data.description !== undefined ? data.description : existing.description,
                updated_at: new Date().toISOString(),
            };
            this.store[idx] = updated;
            return updated;
        }
        const updates = [];
        const values = [];
        let paramCount = 1;
        if (data.name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(data.name);
        }
        if (data.description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(data.description);
        }
        if (updates.length === 0) {
            return this.findById(id, requestId);
        }
        updates.push(`updated_at = NOW()`);
        values.push(id);
        const result = await db.query(`UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`, values, requestId);
        return result.rows[0] || null;
    }
    async delete(id, requestId) {
        if (isTest) {
            const idx = this.store.findIndex((p) => p.id === id);
            if (idx === -1)
                return false;
            this.store.splice(idx, 1);
            return true;
        }
        const result = await db.query('DELETE FROM projects WHERE id = $1', [id], requestId);
        return (result.rowCount ?? 0) > 0;
    }
    async exists(id, requestId) {
        if (isTest) {
            return this.store.some((p) => p.id === id);
        }
        const result = await db.query('SELECT 1 FROM projects WHERE id = $1', [id], requestId);
        return (result.rowCount ?? 0) > 0;
    }
}
export const projectsRepo = new ProjectsRepository();
//# sourceMappingURL=projectsRepo.js.map