import { z } from 'zod';
export declare const createProjectSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
}>;
export declare const updateProjectSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const projectResponseSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number;
    description: string | null;
    created_at: string;
    updated_at: string;
}, {
    name: string;
    id: number;
    description: string | null;
    created_at: string;
    updated_at: string;
}>;
export declare const projectsListResponseSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number;
    description: string | null;
    created_at: string;
    updated_at: string;
}, {
    name: string;
    id: number;
    description: string | null;
    created_at: string;
    updated_at: string;
}>, "many">;
export declare const idSchema: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
//# sourceMappingURL=projects.d.ts.map