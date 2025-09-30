declare const config: {
    CORS_ORIGINS: string[];
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    FORGE_BASE_URL: string;
    FILES_LOCAL_DIR: string;
    FEATURE_SENTRY: boolean;
    FEATURE_QB: boolean;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    CIRCUIT_BREAKER_ERROR_THRESHOLD: number;
    CIRCUIT_BREAKER_TIMEOUT: number;
    CIRCUIT_BREAKER_RESET_TIMEOUT: number;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    AUTH_SECRET: string;
    JWT_EXPIRES_IN: string;
    DATABASE_URL?: string | undefined;
    FORGE_CLIENT_ID?: string | undefined;
    FORGE_CLIENT_SECRET?: string | undefined;
    FORGE_BUCKET?: string | undefined;
    S3_ENDPOINT?: string | undefined;
    S3_BUCKET?: string | undefined;
    REDIS_URL?: string | undefined;
    SENTRY_DSN?: string | undefined;
    QB_CLIENT_ID?: string | undefined;
    QB_CLIENT_SECRET?: string | undefined;
};
export { config };
//# sourceMappingURL=config.d.ts.map