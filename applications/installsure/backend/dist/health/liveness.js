export const livenessHandler = (req, res) => {
    // Liveness check - always returns OK if the process is alive
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
};
//# sourceMappingURL=liveness.js.map