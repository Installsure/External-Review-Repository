import sql from '@/app/api/utils/sql';

export async function GET() {
  try {
    // Test database connection
    await sql`SELECT 1`;

    return Response.json({
      ok: true,
      db: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return Response.json(
      {
        ok: false,
        db: 'error',
        error: 'Database connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
