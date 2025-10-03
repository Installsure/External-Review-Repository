import axios from 'axios';
import { logger } from './logger.js';
class RetryableHttpClient {
    client;
    constructor() {
        this.client = axios.create({
            timeout: 12000, // 12 seconds
            maxRedirects: 0,
            headers: {
                'User-Agent': 'InstallSure/1.0.0',
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use((config) => {
            logger.debug({ url: config.url, method: config.method }, 'HTTP request');
            return config;
        }, (error) => {
            logger.error({ error: error.message }, 'HTTP request error');
            return Promise.reject(error);
        });
        // Response interceptor
        this.client.interceptors.response.use((response) => {
            logger.debug({
                url: response.config.url,
                method: response.config.method,
                status: response.status,
            }, 'HTTP response');
            return response;
        }, (error) => {
            logger.error({
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                error: error.message,
            }, 'HTTP response error');
            return Promise.reject(error);
        });
    }
    async request(config) {
        return this.retryWithBackoff(config);
    }
    async retryWithBackoff(config, maxRetries = 2, baseDelay = 400) {
        let lastError;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await this.client.request(config);
            }
            catch (error) {
                lastError = error;
                // Don't retry on 4xx errors except 408 (timeout) and 429 (rate limit)
                if (error.response?.status >= 400 && error.response?.status < 500) {
                    if (error.response.status !== 408 && error.response.status !== 429) {
                        throw error;
                    }
                }
                // Don't retry on last attempt
                if (attempt === maxRetries) {
                    break;
                }
                // Calculate delay with exponential backoff
                const delay = baseDelay * Math.pow(2, attempt);
                logger.warn({
                    attempt: attempt + 1,
                    maxRetries,
                    delay,
                    error: error.message,
                    status: error.response?.status,
                }, 'HTTP request failed, retrying');
                await this.sleep(delay);
            }
        }
        throw lastError;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    get(url, config) {
        return this.request({ ...config, method: 'GET', url });
    }
    post(url, data, config) {
        return this.request({ ...config, method: 'POST', url, data });
    }
    put(url, data, config) {
        return this.request({ ...config, method: 'PUT', url, data });
    }
    delete(url, config) {
        return this.request({ ...config, method: 'DELETE', url });
    }
}
export const httpClient = new RetryableHttpClient();
//# sourceMappingURL=http.js.map