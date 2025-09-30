import sql from '@/app/api/utils/db';

export async function GET() {
  try {
    // Check database connection
    const dbHealthy = await sql.healthCheck();

    // TODO: Check Redis when implemented
    const redisHealthy = true;

    return Response.json({
      ok: true,
      db: dbHealthy ? 'ok' : 'error',
      redis: redisHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return Response.json(
      {
        ok: false,
        db: 'error',
        redis: 'error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
