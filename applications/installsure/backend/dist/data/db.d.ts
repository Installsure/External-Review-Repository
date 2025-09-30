import { Pool, PoolClient, QueryResult } from 'pg';
declare class Database {
    private pool;
    private isShuttingDown;
    constructor();
    query<T extends Record<string, any> = any>(text: string, params?: any[], requestId?: string): Promise<QueryResult<T>>;
    transaction<T>(callback: (client: PoolClient) => Promise<T>, requestId?: string): Promise<T>;
    healthCheck(): Promise<boolean>;
    close(): Promise<void>;
    getPool(): Pool;
}
export declare const db: Database;
export {};
//# sourceMappingURL=db.d.ts.map