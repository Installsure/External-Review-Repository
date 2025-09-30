import { z } from 'zod';
export declare const fileResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    filename: z.ZodString;
    original_name: z.ZodString;
    file_path: z.ZodString;
    file_size: z.ZodNumber;
    file_type: z.ZodString;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    created_at: string;
    filename: string;
    original_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
}, {
    id: number;
    created_at: string;
    filename: string;
    original_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
}>;
export declare const fileUploadResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    filename: z.ZodString;
    original_name: z.ZodString;
    file_path: z.ZodString;
    file_size: z.ZodNumber;
    file_type: z.ZodString;
    created_at: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    created_at: string;
    filename: string;
    original_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    url?: string | undefined;
}, {
    id: number;
    created_at: string;
    filename: string;
    original_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    url?: string | undefined;
}>;
export declare const forgeUploadSchema: z.ZodObject<{
    fileBuffer: z.ZodString;
    fileName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fileName: string;
    fileBuffer: string;
}, {
    fileName: string;
    fileBuffer: string;
}>;
export declare const forgeTranslateSchema: z.ZodObject<{
    objectId: z.ZodString;
    fileName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    objectId: string;
    fileName: string;
}, {
    objectId: string;
    fileName: string;
}>;
export declare const forgeAuthResponseSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export declare const forgeUploadResponseSchema: z.ZodObject<{
    objectId: z.ZodString;
    bucketKey: z.ZodString;
    objectKey: z.ZodString;
    size: z.ZodNumber;
    location: z.ZodString;
}, "strip", z.ZodTypeAny, {
    objectId: string;
    size: number;
    bucketKey: string;
    objectKey: string;
    location: string;
}, {
    objectId: string;
    size: number;
    bucketKey: string;
    objectKey: string;
    location: string;
}>;
export declare const forgeTranslationResponseSchema: z.ZodObject<{
    urn: z.ZodString;
    status: z.ZodString;
    progress: z.ZodString;
    output: z.ZodObject<{
        destination: z.ZodObject<{
            region: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            region: string;
        }, {
            region: string;
        }>;
        formats: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            views: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            type: string;
            views: string[];
        }, {
            type: string;
            views: string[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        destination: {
            region: string;
        };
        formats: {
            type: string;
            views: string[];
        }[];
    }, {
        destination: {
            region: string;
        };
        formats: {
            type: string;
            views: string[];
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    status: string;
    progress: string;
    urn: string;
    output: {
        destination: {
            region: string;
        };
        formats: {
            type: string;
            views: string[];
        }[];
    };
}, {
    status: string;
    progress: string;
    urn: string;
    output: {
        destination: {
            region: string;
        };
        formats: {
            type: string;
            views: string[];
        }[];
    };
}>;
export declare const forgeManifestResponseSchema: z.ZodObject<{
    urn: z.ZodString;
    status: z.ZodString;
    progress: z.ZodString;
    region: z.ZodString;
    version: z.ZodString;
    derivatives: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    status: string;
    progress: string;
    urn: string;
    version: string;
    region: string;
    derivatives: any[];
}, {
    status: string;
    progress: string;
    urn: string;
    version: string;
    region: string;
    derivatives: any[];
}>;
export declare const forgePropertiesResponseSchema: z.ZodObject<{
    collection: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    collection: any[];
}, {
    collection: any[];
}>;
export declare const forgeTakeoffResponseSchema: z.ZodObject<{
    areas: z.ZodArray<z.ZodAny, "many">;
    lengths: z.ZodArray<z.ZodAny, "many">;
    volumes: z.ZodArray<z.ZodAny, "many">;
    counts: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    areas: any[];
    lengths: any[];
    volumes: any[];
    counts: any[];
}, {
    areas: any[];
    lengths: any[];
    volumes: any[];
    counts: any[];
}>;
//# sourceMappingURL=files.d.ts.map