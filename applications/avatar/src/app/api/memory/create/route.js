import sql from '@/app/api/utils/sql';

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, persona_id, summary, embedding = null } = body;

    // Validate required fields
    if (!user_id || !persona_id || !summary) {
      return Response.json(
        { error: 'Missing required fields: user_id, persona_id, summary' },
        { status: 400 },
      );
    }

    // Insert memory entry
    const result = await sql`
      INSERT INTO memory (user_id, persona_id, summary, embedding)
      VALUES (${user_id}, ${persona_id}, ${summary}, ${embedding})
      RETURNING *
    `;

    return Response.json({
      success: true,
      memory: result[0],
    });
  } catch (error) {
    console.error('Error creating memory:', error);
    return Response.json({ error: 'Failed to create memory entry' }, { status: 500 });
  }
}
