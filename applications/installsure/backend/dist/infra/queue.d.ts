import { Worker } from 'bullmq';
export interface TranslationJobData {
    urn: string;
    objectId: string;
    fileName: string;
    requestId: string;
}
export interface EmailJobData {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
    requestId: string;
}
export declare const isQueueHealthy: () => Promise<boolean>;
export declare const closeQueues: () => Promise<void>;
export declare const createTranslationWorker: () => Worker<TranslationJobData, any, string>;
export declare const createEmailWorker: () => Worker<EmailJobData, any, string>;
//# sourceMappingURL=queue.d.ts.map