import sql from '@/app/api/utils/sql.js';

// Helper function to extract user from token
async function getUserFromToken(token) {
  if (!token || !token.startsWith('ff4u_')) {
    return null;
  }

  try {
    const parts = token.split('_');
    if (parts.length !== 3) return null;

    const userId = parts[1];

    const result = await sql`
      SELECT id, email, role, plan, created_at
      FROM users 
      WHERE id = ${userId}
    `;

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

// GET - List contents for current user (performer)
export async function GET(request) {
  try {
    const token =
      request.headers.get('x-ff4u-token') ||
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (user.role !== 'performer') {
      return Response.json({ error: 'Performer role required' }, { status: 403 });
    }

    // Get contents for this performer
    const contents = await sql`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.status,
        c.tags,
        c.price_cents,
        c.created_at
      FROM contents c
      WHERE c.performer_id = ${user.id}
      ORDER BY c.created_at DESC
    `;

    return Response.json({ contents });
  } catch (error) {
    console.error('Get contents error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new content (draft)
export async function POST(request) {
  try {
    const token =
      request.headers.get('x-ff4u-token') ||
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (user.role !== 'performer') {
      return Response.json({ error: 'Performer role required' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, tags, price_cents } = body;

    if (!title) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }

    // Create content as draft
    const result = await sql`
      INSERT INTO contents (performer_id, title, description, tags, price_cents, status)
      VALUES (${user.id}, ${title}, ${description || ''}, ${tags || []}, ${price_cents || 0}, 'DRAFT')
      RETURNING id, title, description, status, tags, price_cents, created_at
    `;

    const content = result[0];

    // Create initial consent record
    await sql`
      INSERT INTO consents (content_id, performer_approved, safety_approved, moderator_approved)
      VALUES (${content.id}, false, false, false)
    `;

    // Log content creation
    await sql`
      INSERT INTO audit_logs (user_id, action, meta)
      VALUES (${user.id}, 'content_created', ${JSON.stringify({ content_id: content.id, title })})
    `;

    return Response.json({ content });
  } catch (error) {
    console.error('Create content error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
