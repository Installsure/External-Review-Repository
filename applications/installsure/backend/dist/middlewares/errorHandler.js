export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json({
        error: isDevelopment ? err.message : 'Internal Server Error',
        ...(isDevelopment && { stack: err.stack }),
    });
};
//# sourceMappingURL=errorHandler.js.map