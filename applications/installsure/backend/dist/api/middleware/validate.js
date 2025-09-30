import { ZodError } from 'zod';
import { createError } from './errorHandler.js';
export const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const validationError = createError('Validation error', 400);
                validationError.zodError = error;
                next(validationError);
            }
            else {
                next(error);
            }
        }
    };
};
export const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            req.query = schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const validationError = createError('Query validation error', 400);
                validationError.zodError = error;
                next(validationError);
            }
            else {
                next(error);
            }
        }
    };
};
export const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            req.params = schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const validationError = createError('Parameter validation error', 400);
                validationError.zodError = error;
                next(validationError);
            }
            else {
                next(error);
            }
        }
    };
};
//# sourceMappingURL=validate.js.map