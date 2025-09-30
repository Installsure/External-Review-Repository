import sql from '@/app/api/utils/sql';
import { requireAuth } from '@/app/api/utils/auth';

export async function GET(request) {
  try {
    const userId = requireAuth(request);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get introductions where user is either a_user or b_user
    const introductions = await sql`
      SELECT 
        i.id,
        i.a_user,
        i.b_user,
        i.created_at,
        -- Get the other user's profile (not the current user)
        CASE 
          WHEN i.a_user = ${userId} THEN p_b.handle
          ELSE p_a.handle
        END as other_handle,
        CASE 
          WHEN i.a_user = ${userId} THEN p_b.display_name
          ELSE p_a.display_name
        END as other_display_name,
        CASE 
          WHEN i.a_user = ${userId} THEN p_b.avatar_url
          ELSE p_a.avatar_url
        END as other_avatar_url,
        CASE 
          WHEN i.a_user = ${userId} THEN i.b_user
          ELSE i.a_user
        END as other_user_id
      FROM introductions i
      LEFT JOIN profiles p_a ON i.a_user = p_a.user_id
      LEFT JOIN profiles p_b ON i.b_user = p_b.user_id
      WHERE i.a_user = ${userId} OR i.b_user = ${userId}
      ORDER BY i.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return Response.json({
      introductions,
      hasMore: introductions.length === limit,
    });
  } catch (error) {
    console.error('Get introductions failed:', error);

    if (error.message === 'Authentication required') {
      return Response.json(
        {
          error: 'Authentication required',
        },
        { status: 401 },
      );
    }

    return Response.json(
      {
        error: 'Failed to get introductions',
      },
      { status: 500 },
    );
  }
}
