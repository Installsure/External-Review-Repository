import sql from '@/app/api/utils/sql';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const persona_id = searchParams.get('persona_id');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    // Build query dynamically
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (user_id) {
      paramCount++;
      whereClause += ` AND user_id = $${paramCount}`;
      params.push(user_id);
    }

    if (persona_id) {
      paramCount++;
      whereClause += ` AND persona_id = $${paramCount}`;
      params.push(persona_id);
    }

    const query = `
      SELECT id, user_id, persona_id, ts, summary
      FROM memory 
      ${whereClause}
      ORDER BY ts DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    params.push(limit, offset);

    const memories = await sql(query, params);

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM memory ${whereClause}`;
    const countResult = await sql(countQuery, params.slice(0, -2)); // Remove limit/offset params
    const total = parseInt(countResult[0].total, 10);

    return Response.json({
      success: true,
      memories,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error listing memories:', error);
    return Response.json({ error: 'Failed to retrieve memories' }, { status: 500 });
  }
}
