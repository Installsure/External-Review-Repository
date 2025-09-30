import CircuitBreaker from 'opossum';
export interface CircuitBreakerOptions {
    errorThresholdPercentage?: number;
    timeout?: number;
    resetTimeout?: number;
    name?: string;
}
export declare const createCircuitBreaker: <T extends any[], R>(fn: (...args: T) => Promise<R>, options?: CircuitBreakerOptions) => CircuitBreaker;
export declare const createForgeCircuitBreaker: <T extends any[], R>(fn: (...args: T) => Promise<R>) => CircuitBreaker;
export declare const createQBCircuitBreaker: <T extends any[], R>(fn: (...args: T) => Promise<R>) => CircuitBreaker;
//# sourceMappingURL=breaker.d.ts.map