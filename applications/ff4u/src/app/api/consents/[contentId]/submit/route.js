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

// POST - Submit content for review
export async function POST(request, { params }) {
  try {
    const { contentId } = params;
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

    // Verify the content belongs to this performer
    const contentResult = await sql`
      SELECT id, status, performer_id
      FROM contents
      WHERE id = ${contentId} AND performer_id = ${user.id}
    `;

    if (contentResult.length === 0) {
      return Response.json({ error: 'Content not found' }, { status: 404 });
    }

    const content = contentResult[0];

    if (content.status !== 'DRAFT') {
      return Response.json(
        { error: 'Only draft content can be submitted for review' },
        { status: 400 },
      );
    }

    // Use transaction to update both tables
    await sql.transaction([
      // Update content status to REVIEW
      sql`
        UPDATE contents 
        SET status = 'REVIEW'
        WHERE id = ${contentId}
      `,

      // Update consent record - performer has approved by submitting
      sql`
        UPDATE consents
        SET performer_approved = true, signed_at = now()
        WHERE content_id = ${contentId}
      `,

      // Log the submission
      sql`
        INSERT INTO audit_logs (user_id, action, meta)
        VALUES (${user.id}, 'content_submitted_for_review', ${JSON.stringify({ content_id: contentId })})
      `,
    ]);

    return Response.json({
      success: true,
      message: 'Content submitted for review successfully',
    });
  } catch (error) {
    console.error('Submit for review error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
