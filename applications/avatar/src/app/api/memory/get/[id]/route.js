import sql from '@/app/api/utils/sql';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id, 10))) {
      return Response.json({ error: 'Valid memory ID is required' }, { status: 400 });
    }

    const result = await sql`
      SELECT id, user_id, persona_id, ts, summary, embedding
      FROM memory 
      WHERE id = ${parseInt(id, 10)}
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Memory not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      memory: result[0],
    });
  } catch (error) {
    console.error('Error getting memory:', error);
    return Response.json({ error: 'Failed to retrieve memory' }, { status: 500 });
  }
}
