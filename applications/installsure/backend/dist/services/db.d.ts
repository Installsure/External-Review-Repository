import { PoolClient } from 'pg';
export declare const db: {
    query(text: string, params?: any[]): Promise<any>;
    transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
};
//# sourceMappingURL=db.d.ts.map