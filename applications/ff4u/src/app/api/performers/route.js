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

// GET - List verified performers
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

    // Only clients and admins can view performer listings
    if (!['client', 'admin'].includes(user.role)) {
      return Response.json({ error: 'Client access required' }, { status: 403 });
    }

    // Get performer profiles with user information
    const performers = await sql`
      SELECT 
        pp.id,
        pp.user_id,
        pp.display_name,
        pp.bio,
        pp.kyc_status,
        pp.consent_tos,
        pp.created_at,
        u.email
      FROM performer_profiles pp
      JOIN users u ON pp.user_id = u.id
      WHERE u.role = 'performer'
      ORDER BY pp.created_at DESC
    `;

    // Only return basic information, no sensitive data
    const formattedPerformers = performers.map((performer) => ({
      id: performer.id,
      user_id: performer.user_id,
      display_name: performer.display_name,
      bio: performer.bio,
      kyc_status: performer.kyc_status,
      created_at: performer.created_at,
      // Exclude email and other sensitive information
    }));

    return Response.json({ performers: formattedPerformers });
  } catch (error) {
    console.error('Get performers error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create performer profile
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
    const { display_name, bio, consent_tos } = body;

    if (!display_name) {
      return Response.json({ error: 'Display name is required' }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await sql`
      SELECT id FROM performer_profiles WHERE user_id = ${user.id}
    `;

    if (existingProfile.length > 0) {
      // Update existing profile
      const result = await sql`
        UPDATE performer_profiles
        SET display_name = ${display_name}, bio = ${bio || ''}, consent_tos = ${consent_tos || false}
        WHERE user_id = ${user.id}
        RETURNING id, display_name, bio, kyc_status, consent_tos, created_at
      `;

      return Response.json({ profile: result[0] });
    } else {
      // Create new profile
      const result = await sql`
        INSERT INTO performer_profiles (user_id, display_name, bio, kyc_status, consent_tos)
        VALUES (${user.id}, ${display_name}, ${bio || ''}, 'pending', ${consent_tos || false})
        RETURNING id, display_name, bio, kyc_status, consent_tos, created_at
      `;

      // Log profile creation
      await sql`
        INSERT INTO audit_logs (user_id, action, meta)
        VALUES (${user.id}, 'performer_profile_created', ${JSON.stringify({ display_name })})
      `;

      return Response.json({ profile: result[0] });
    }
  } catch (error) {
    console.error('Create performer profile error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
