import { hash } from 'argon2';
import { sign } from 'jsonwebtoken';
import sql from '@/app/api/utils/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Basic validation
    if (!email || !password || !name) {
      return Response.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return Response.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await hash(password);

    // Create user and organization in transaction
    const results = await sql.transaction([
      // Create user
      {
        text: 'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
        values: [email, passwordHash, name],
      },
      // Create organization (starter)
      {
        text: 'INSERT INTO orgs (name) VALUES ($1) RETURNING id, name, created_at',
        values: [`${name}'s Organization`],
      },
    ]);

    const user = results[0].rows[0];
    const org = results[1].rows[0];

    // Create membership
    await sql`
      INSERT INTO memberships (user_id, org_id, role) 
      VALUES (${user.id}, ${org.id}, 'OWNER')
    `;

    // Generate JWT tokens
    const accessToken = sign(
      { sub: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TTL || '15m' },
    );

    const refreshToken = sign({ sub: user.id, type: 'refresh' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TTL || '30d',
    });

    return Response.json(
      {
        access: accessToken,
        refresh: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        org: {
          id: org.id,
          name: org.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Signup error:', error);

    if (error.code === '23505') {
      // Unique violation
      return Response.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
