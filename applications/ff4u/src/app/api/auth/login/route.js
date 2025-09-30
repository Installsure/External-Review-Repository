import sql from '@/app/api/utils/sql.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user (in production, compare hashed password)
    const result = await sql`
      SELECT id, email, role, created_at
      FROM users 
      WHERE email = ${email}
    `;

    if (result.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result[0];

    // In production, verify password hash here
    // For demo, accept any password for existing demo users or "demo123"
    const isDemoUser = [
      'admin@ff4u.com',
      'moderator@ff4u.com',
      'safety@ff4u.com',
      'performer1@ff4u.com',
      'client1@ff4u.com',
    ].includes(email);

    if (!isDemoUser && password !== 'demo123') {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate a simple token (in production, use proper JWT)
    const token = `ff4u_${user.id}_${Date.now()}`;

    // Log login event
    await sql`
      INSERT INTO audit_logs (user_id, action, meta)
      VALUES (${user.id}, 'user_login', ${JSON.stringify({ email, login_time: new Date() })})
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
    console.error('Login error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
