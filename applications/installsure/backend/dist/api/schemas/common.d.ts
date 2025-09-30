import { z } from 'zod';
export declare const idSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
}, {
    limit?: number | undefined;
    page?: number | undefined;
}>;
export declare const searchSchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    q?: string | undefined;
}, {
    q?: string | undefined;
}>;
export declare const successResponseSchema: z.ZodObject<{
    success: z.ZodDefault<z.ZodBoolean>;
    data: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    data?: any;
}, {
    data?: any;
    success?: boolean | undefined;
}>;
export declare const errorResponseSchema: z.ZodObject<{
    error: z.ZodString;
    requestId: z.ZodOptional<z.ZodString>;
    retryAfter: z.ZodOptional<z.ZodNumber>;
    stack: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    error: string;
    requestId?: string | undefined;
    stack?: string | undefined;
    retryAfter?: number | undefined;
    details?: any;
}, {
    error: string;
    requestId?: string | undefined;
    stack?: string | undefined;
    retryAfter?: number | undefined;
    details?: any;
}>;
export declare const healthResponseSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    uptime: z.ZodNumber;
    version: z.ZodString;
    timestamp: z.ZodString;
    environment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    timestamp: string;
    version: string;
    ok: boolean;
    uptime: number;
    environment: string;
}, {
    timestamp: string;
    version: string;
    ok: boolean;
    uptime: number;
    environment: string;
}>;
export declare const fileUploadSchema: z.ZodObject<{
    fieldname: z.ZodString;
    originalname: z.ZodString;
    encoding: z.ZodString;
    mimetype: z.ZodString;
    size: z.ZodNumber;
    destination: z.ZodString;
    filename: z.ZodString;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    encoding: string;
    fieldname: string;
    originalname: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
}, {
    path: string;
    encoding: string;
    fieldname: string;
    originalname: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
}>;
export declare const allowedFileTypes: readonly [".ifc", ".dwg", ".rvt", ".step", ".obj", ".gltf", ".glb"];
export declare const fileTypeSchema: z.ZodEnum<[".ifc", ".dwg", ".rvt", ".step", ".obj", ".gltf", ".glb"]>;
//# sourceMappingURL=common.d.ts.map