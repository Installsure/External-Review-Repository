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

// POST - Approve/reject content for safety or moderation
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

    const body = await request.json();
    const { approval_type, approved } = body;

    if (!['safety', 'moderation'].includes(approval_type)) {
      return Response.json(
        { error: "Invalid approval type. Must be 'safety' or 'moderation'" },
        { status: 400 },
      );
    }

    // Check permissions
    const canApprove =
      user.role === 'admin' ||
      (approval_type === 'safety' && user.role === 'safety_officer') ||
      (approval_type === 'moderation' && user.role === 'moderator');

    if (!canApprove) {
      return Response.json(
        { error: 'Insufficient permissions for this approval type' },
        { status: 403 },
      );
    }

    // Verify content exists and is in review
    const contentResult = await sql`
      SELECT id, status
      FROM contents
      WHERE id = ${contentId}
    `;

    if (contentResult.length === 0) {
      return Response.json({ error: 'Content not found' }, { status: 404 });
    }

    const content = contentResult[0];
    if (content.status !== 'REVIEW') {
      return Response.json({ error: 'Content is not in review status' }, { status: 400 });
    }

    if (!approved) {
      // If rejected, set content status to REJECTED
      await sql.transaction([
        sql`
          UPDATE contents 
          SET status = 'REJECTED'
          WHERE id = ${contentId}
        `,
        sql`
          INSERT INTO audit_logs (user_id, action, meta)
          VALUES (${user.id}, 'content_rejected', ${JSON.stringify({
            content_id: contentId,
            approval_type,
            rejected_by: user.role,
          })})
        `,
      ]);

      return Response.json({
        success: true,
        message: 'Content rejected',
        status: 'REJECTED',
      });
    }

    // If approved, update the consent record
    const updateField = approval_type === 'safety' ? 'safety_approved' : 'moderator_approved';

    await sql`
      UPDATE consents
      SET ${sql(updateField)} = true
      WHERE content_id = ${contentId}
    `;

    // Check if both approvals are now complete
    const consentResult = await sql`
      SELECT safety_approved, moderator_approved
      FROM consents
      WHERE content_id = ${contentId}
    `;

    const consent = consentResult[0];
    let newStatus = 'REVIEW';

    if (consent.safety_approved && consent.moderator_approved) {
      // Both approvals complete - move to APPROVED
      newStatus = 'APPROVED';
      await sql`
        UPDATE contents 
        SET status = 'APPROVED'
        WHERE id = ${contentId}
      `;
    }

    // Log the approval
    await sql`
      INSERT INTO audit_logs (user_id, action, meta)
      VALUES (${user.id}, 'content_approved', ${JSON.stringify({
        content_id: contentId,
        approval_type,
        approved_by: user.role,
        new_status: newStatus,
      })})
    `;

    return Response.json({
      success: true,
      message: `${approval_type} approval granted`,
      status: newStatus,
      consent: {
        safety_approved: consent.safety_approved,
        moderator_approved: consent.moderator_approved,
      },
    });
  } catch (error) {
    console.error('Content approval error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
