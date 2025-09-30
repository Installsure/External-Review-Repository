// import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { persona_id = 'dating-hero', user_id = 'demo-user' } = body;

    // Validate persona_id
    if (!persona_id) {
      return Response.json({ error: 'persona_id is required' }, { status: 400 });
    }

    // Generate a secure session token using crypto
    const session_id = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const created_at = new Date().toISOString();

    return Response.json({
      success: true,
      session: {
        session_id,
        user_id,
        persona_id,
        created_at,
        expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      },
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return Response.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
