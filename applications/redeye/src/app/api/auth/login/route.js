import { verify } from 'argon2';
import { sign } from 'jsonwebtoken';
import sql from '@/app/api/utils/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const userResult = await sql`
      SELECT id, email, password_hash, name, created_at 
      FROM users 
      WHERE email = ${email}
    `;

    if (userResult.rows.length === 0) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await verify(user.password_hash, password);
    if (!isValidPassword) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Get user's organizations
    const orgsResult = await sql`
      SELECT o.id, o.name, o.created_at, m.role
      FROM orgs o
      JOIN memberships m ON o.id = m.org_id
      WHERE m.user_id = ${user.id}
      ORDER BY o.created_at ASC
    `;

    const orgs = orgsResult.rows;

    // Generate JWT tokens
    const accessToken = sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
        orgs: orgs.map((org) => ({
          id: org.id,
          name: org.name,
          role: org.role,
        })),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TTL || '15m' },
    );

    const refreshToken = sign({ sub: user.id, type: 'refresh' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TTL || '30d',
    });

    return Response.json({
      access: accessToken,
      refresh: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      orgs,
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
