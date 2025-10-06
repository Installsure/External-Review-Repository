export interface HealthResponse {
  ok: boolean;
  uptime: number;
  version: string;
  timestamp: string;
  environment: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiFile {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

export interface FileStats {
  total: number;
  totalFiles: number;
  totalSize: number;
  byType: Record<string, number>;
}

export interface ForgeAuthResponse {
  token: string;
}

export interface ForgeUploadResponse {
  objectId: string;
  bucketKey: string;
  objectKey: string;
  size: number;
  location: string;
}

export interface ForgeTranslationResponse {
  urn: string;
  status: string;
  progress: string;
  output: {
    destination: {
      region: string;
    };
    formats: Array<{
      type: string;
      views: string[];
    }>;
  };
}

export interface ForgeManifestResponse {
  status: string;
  progress: string;
  version: string;
  region: string;
}

export interface ForgePropertiesResponse {
  areas: number[];
  lengths: number[];
  volumes: number[];
  counts: number[];
}

export interface QBHealthResponse {
  ok: boolean;
  connected: boolean;
  message: string;
  configured: boolean;
}

export interface Rfi {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'pending';
  project_id?: number;
  created_at: string;
  updated_at: string;
}
