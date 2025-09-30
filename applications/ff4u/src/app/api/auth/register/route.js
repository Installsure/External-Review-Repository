import sql from '@/app/api/utils/sql.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return Response.json({ error: 'Email, password, and role are required' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['admin', 'moderator', 'safety_officer', 'performer', 'client'];
    if (!validRoles.includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return Response.json({ error: 'User already exists' }, { status: 409 });
    }

    // Create user (in production, hash the password)
    const result = await sql`
      INSERT INTO users (email, role)
      VALUES (${email}, ${role})
      RETURNING id, email, role, created_at
    `;

    const user = result[0];

    // Generate a simple token (in production, use proper JWT)
    const token = `ff4u_${user.id}_${Date.now()}`;

    // Log registration event
    await sql`
      INSERT INTO audit_logs (user_id, action, meta)
      VALUES (${user.id}, 'user_registered', ${JSON.stringify({ email, role })})
    `;

    return Response.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
