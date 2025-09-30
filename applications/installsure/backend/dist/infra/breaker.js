import CircuitBreaker from 'opossum';
import { logger } from './logger.js';
import { config } from './config.js';
export const createCircuitBreaker = (fn, options = {}) => {
    const breaker = new CircuitBreaker(fn, {
        errorThresholdPercentage: options.errorThresholdPercentage ?? config.CIRCUIT_BREAKER_ERROR_THRESHOLD,
        timeout: options.timeout ?? config.CIRCUIT_BREAKER_TIMEOUT,
        resetTimeout: options.resetTimeout ?? config.CIRCUIT_BREAKER_RESET_TIMEOUT,
        name: options.name ?? 'circuit-breaker',
    });
    // Log circuit breaker events
    breaker.on('open', () => {
        logger.warn({ name: breaker.name }, 'Circuit breaker opened');
    });
    breaker.on('halfOpen', () => {
        logger.info({ name: breaker.name }, 'Circuit breaker half-open');
    });
    breaker.on('close', () => {
        logger.info({ name: breaker.name }, 'Circuit breaker closed');
    });
    breaker.on('failure', (error) => {
        logger.error({ name: breaker.name, error: error.message }, 'Circuit breaker failure');
    });
    breaker.on('success', () => {
        logger.debug({ name: breaker.name }, 'Circuit breaker success');
    });
    return breaker;
};
// Pre-configured circuit breakers for external services
export const createForgeCircuitBreaker = (fn) => {
    return createCircuitBreaker(fn, {
        name: 'forge-api',
        errorThresholdPercentage: 50,
        timeout: 10000,
        resetTimeout: 30000,
    });
};
export const createQBCircuitBreaker = (fn) => {
    return createCircuitBreaker(fn, {
        name: 'quickbooks-api',
        errorThresholdPercentage: 50,
        timeout: 10000,
        resetTimeout: 30000,
    });
};
//# sourceMappingURL=breaker.js.map