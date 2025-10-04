// Document Management Types

export interface AIALibraryManifest {
  notes: string;
  items: AIALibraryItem[];
}

export interface AIALibraryItem {
  docType: string;
  title: string;
  url: string;
}

export interface ResidentialPlanManifest {
  projectId: string;
  planUrl: string;
  tags: PlanTag[];
}

export interface PlanTag {
  id: string;
  sheet: string;
  title: string;
  body: string;
  type: 'RFI' | 'CO';
}

export interface RFIRequest {
  project: string;
  sheet?: string;
  title: string;
  question: string;
  reference?: string;
  proposed?: string;
  due?: string;
}

export interface RFIResponse {
  ok: boolean;
  rfi_id: string;
  path: string;
}

export interface ChangeOrderRequest {
  project: string;
  desc: string;
  cost?: string;
  time?: string;
  reason?: string;
  co_no?: string;
}

export interface ChangeOrderResponse {
  ok: boolean;
  co_id: string;
  path: string;
}

export interface IngestAIAResponse {
  ok: boolean;
  count?: number;
  items?: Array<{
    title: string;
    public?: string;
    error?: string;
  }>;
  error?: string;
}

export interface ResidentialDemoResponse {
  ok: boolean;
  docs?: Array<RFIResponse | ChangeOrderResponse>;
  plan?: string;
  error?: string;
}
