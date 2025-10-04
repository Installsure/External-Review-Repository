import type {
  HealthResponse,
  Project,
  ApiFile,
  FileStats,
  ForgeAuthResponse,
  ForgeUploadResponse,
  ForgeTranslationResponse,
  ForgeManifestResponse,
  ForgePropertiesResponse,
  QBHealthResponse,
  RFIRequest,
  RFIResponse,
  ChangeOrderRequest,
  ChangeOrderResponse,
  IngestAIAResponse,
  ResidentialDemoResponse,
} from '../types/api.js';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

export interface ApiError {
  error: string;
  requestId?: string;
  retryAfter?: number;
  details?: any;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));

      // Add status to error for retry logic
      (error as any).status = response.status;
      throw error;
    }

    return response.json();
  }

  // Health
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/health');
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await this.request<{ success: boolean; data: Project[]; count: number }>(
      '/api/projects',
    );
    return response.data;
  }

  async getProject(id: number): Promise<Project> {
    const response = await this.request<{ success: boolean; data: Project }>(`/api/projects/${id}`);
    return response.data;
  }

  async createProject(data: { name: string; description?: string }): Promise<Project> {
    const response = await this.request<{ success: boolean; data: Project }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateProject(id: number, data: { name?: string; description?: string }): Promise<Project> {
    const response = await this.request<{ success: boolean; data: Project }>(
      `/api/projects/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );
    return response.data;
  }

  async deleteProject(id: number) {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Files
  async getFiles(): Promise<ApiFile[]> {
    return this.request<ApiFile[]>('/api/files');
  }

  async getFile(id: number): Promise<ApiFile> {
    return this.request<ApiFile>(`/api/files/${id}`);
  }

  async getFileStats(): Promise<FileStats> {
    return this.request<FileStats>('/api/files/stats');
  }

  async uploadFile(file: File): Promise<ApiFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/files/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      (error as any).status = response.status;
      throw error;
    }

    return response.json();
  }

  async deleteFile(id: number) {
    return this.request(`/api/files/${id}`, {
      method: 'DELETE',
    });
  }

  // Forge/AutoCAD
  async forgeAuth(): Promise<ForgeAuthResponse> {
    return this.request<ForgeAuthResponse>('/api/autocad/auth', { method: 'POST' });
  }

  async forgeUpload(fileBuffer: ArrayBuffer, fileName: string): Promise<ForgeUploadResponse> {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));
    return this.request<ForgeUploadResponse>('/api/autocad/upload', {
      method: 'POST',
      body: JSON.stringify({ fileBuffer: base64, fileName }),
    });
  }

  async forgeTranslate(objectId: string, fileName: string): Promise<ForgeTranslationResponse> {
    return this.request<ForgeTranslationResponse>('/api/autocad/translate', {
      method: 'POST',
      body: JSON.stringify({ objectId, fileName }),
    });
  }

  async getManifest(urn: string): Promise<ForgeManifestResponse> {
    return this.request<ForgeManifestResponse>(`/api/autocad/manifest/${urn}`);
  }

  async getProperties(urn: string): Promise<ForgePropertiesResponse> {
    return this.request<ForgePropertiesResponse>(`/api/autocad/properties/${urn}`);
  }

  async getTakeoff(urn: string): Promise<ForgePropertiesResponse> {
    return this.request<ForgePropertiesResponse>(`/api/autocad/takeoff/${urn}`);
  }

  // QuickBooks
  async getQBHealth(): Promise<QBHealthResponse> {
    return this.request<QBHealthResponse>('/api/qb/health');
  }

  // Document Management
  async ingestAIALibrary(): Promise<IngestAIAResponse> {
    return this.request<IngestAIAResponse>('/api/docs/ingestAIA', {
      method: 'POST',
    });
  }

  async createRFI(data: RFIRequest): Promise<RFIResponse> {
    return this.request<RFIResponse>('/api/docs/rfi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createChangeOrder(data: ChangeOrderRequest): Promise<ChangeOrderResponse> {
    return this.request<ChangeOrderResponse>('/api/docs/co', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async processResidentialDemo(): Promise<ResidentialDemoResponse> {
    return this.request<ResidentialDemoResponse>('/api/demo/residential', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
