import { AxiosRequestConfig, AxiosResponse } from 'axios';
declare class RetryableHttpClient {
    private client;
    constructor();
    private setupInterceptors;
    request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    private retryWithBackoff;
    private sleep;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}
export declare const httpClient: RetryableHttpClient;
export {};
//# sourceMappingURL=http.d.ts.map