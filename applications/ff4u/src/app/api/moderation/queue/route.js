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

// GET - Get content moderation queue
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

    // Check if user has moderation permissions
    if (!['moderator', 'safety_officer', 'admin'].includes(user.role)) {
      return Response.json({ error: 'Moderation access required' }, { status: 403 });
    }

    // Get content in review status with consent information
    const contents = await sql`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.status,
        c.tags,
        c.price_cents,
        c.created_at,
        u.email as performer_email,
        consent.performer_approved,
        consent.safety_approved,
        consent.moderator_approved,
        consent.signed_at
      FROM contents c
      JOIN users u ON c.performer_id = u.id
      LEFT JOIN consents consent ON c.id = consent.content_id
      WHERE c.status = 'REVIEW'
      ORDER BY c.created_at ASC
    `;

    // Format the response to include consent data
    const formattedContents = contents.map((content) => ({
      ...content,
      consent: {
        performer_approved: content.performer_approved,
        safety_approved: content.safety_approved,
        moderator_approved: content.moderator_approved,
        signed_at: content.signed_at,
      },
    }));

    return Response.json({ contents: formattedContents });
  } catch (error) {
    console.error('Get moderation queue error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
