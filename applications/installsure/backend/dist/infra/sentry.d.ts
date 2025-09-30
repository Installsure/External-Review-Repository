export declare const initSentry: () => void;
export declare const captureException: (error: Error, context?: Record<string, any>) => void;
export declare const captureMessage: (message: string, level?: "info" | "warning" | "error", context?: Record<string, any>) => void;
export declare const addBreadcrumb: (message: string, category: string, level?: "info" | "warning" | "error", data?: Record<string, any>) => void;
//# sourceMappingURL=sentry.d.ts.map