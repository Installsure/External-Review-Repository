import { ForgeUploadData, ForgeTranslateData, ForgeUploadResult, ForgeTranslationResult } from '../types/files.js';
export declare class ForgeService {
    private accessToken;
    private tokenExpiry;
    constructor();
    private authenticate;
    private ensureValidToken;
    private ensureBucket;
    private uploadFileToForge;
    private translateFileInForge;
    private getManifestFromForge;
    private getPropertiesFromForge;
    uploadFile(data: ForgeUploadData, requestId?: string): Promise<ForgeUploadResult>;
    translateFile(data: ForgeTranslateData, requestId?: string): Promise<ForgeTranslationResult>;
    getManifest(urn: string, requestId?: string): Promise<any>;
    getProperties(urn: string, requestId?: string): Promise<any>;
    getTakeoff(urn: string, requestId?: string): Promise<any>;
}
export declare const forgeService: ForgeService;
//# sourceMappingURL=forgeService.d.ts.map