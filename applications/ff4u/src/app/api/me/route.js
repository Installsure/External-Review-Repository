import sql from '@/app/api/utils/sql.js';

// Helper function to extract user from token
async function getUserFromToken(token) {
  if (!token || !token.startsWith('ff4u_')) {
    return null;
  }

  try {
    // Extract user ID from simple token format: ff4u_{user_id}_{timestamp}
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

export async function GET(request) {
  try {
    // Get token from Authorization header or localStorage (would be in cookie in production)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || request.headers.get('x-ff4u-token');

    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get additional profile data if performer
    let profile = null;
    if (user.role === 'performer') {
      const profileResult = await sql`
        SELECT id, display_name, bio, kyc_status, consent_tos, created_at
        FROM performer_profiles
        WHERE user_id = ${user.id}
      `;
      profile = profileResult.length > 0 ? profileResult[0] : null;
    }

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        plan: user.plan,
        created_at: user.created_at,
        profile,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
