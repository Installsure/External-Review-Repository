import sql from '@/app/api/utils/sql';
import { requireAuth } from '@/app/api/utils/auth';

export async function POST(request) {
  try {
    const userId = requireAuth(request);
    const body = await request.json();

    const { to_handle, note } = body;

    if (!to_handle) {
      return Response.json(
        {
          error: 'to_handle is required',
        },
        { status: 400 },
      );
    }

    // Verify the target profile exists
    const targetProfile = await sql`
      SELECT user_id FROM profiles WHERE handle = ${to_handle}
    `;

    if (targetProfile.length === 0) {
      return Response.json(
        {
          error: 'Target profile not found',
        },
        { status: 404 },
      );
    }

    // Check if user is trying to send hello to themselves
    if (targetProfile[0].user_id === userId) {
      return Response.json(
        {
          error: 'Cannot send hello to yourself',
        },
        { status: 400 },
      );
    }

    // Check if a hello already exists between these users
    const existingHello = await sql`
      SELECT id FROM hellos 
      WHERE from_user = ${userId} AND to_handle = ${to_handle}
      AND status = 'PENDING'
    `;

    if (existingHello.length > 0) {
      return Response.json(
        {
          error: 'Hello request already sent',
        },
        { status: 409 },
      );
    }

    // Create the hello request
    const hello = await sql`
      INSERT INTO hellos (from_user, to_handle, note, status)
      VALUES (${userId}, ${to_handle}, ${note || null}, 'PENDING')
      RETURNING id, from_user, to_handle, note, status, created_at
    `;

    return Response.json(hello[0], { status: 201 });
  } catch (error) {
    console.error('Send hello failed:', error);

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
        error: 'Failed to send hello',
      },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const userId = requireAuth(request);
    const url = new URL(request.url);
    const direction = url.searchParams.get('direction') || 'both';
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let hellos = [];

    if (direction === 'incoming' || direction === 'both') {
      // Get incoming hellos (where user's handle is the target)
      const userProfile = await sql`
        SELECT handle FROM profiles WHERE user_id = ${userId}
      `;

      if (userProfile.length > 0) {
        const incomingQuery = `
          SELECT h.id, h.from_user, h.to_handle, h.note, h.status, h.created_at, 
                 p.display_name as from_display_name, p.handle as from_handle, p.avatar_url as from_avatar_url
          FROM hellos h
          LEFT JOIN profiles p ON h.from_user = p.user_id
          WHERE h.to_handle = $1
          ${status ? 'AND h.status = $2' : ''}
          ORDER BY h.created_at DESC
          LIMIT $${status ? '3' : '2'} OFFSET $${status ? '4' : '3'}
        `;

        const params = [userProfile[0].handle];
        if (status) params.push(status);
        params.push(limit, offset);

        const incoming = await sql(incomingQuery, params);
        hellos = hellos.concat(incoming.map((h) => ({ ...h, direction: 'incoming' })));
      }
    }

    if (direction === 'outgoing' || direction === 'both') {
      // Get outgoing hellos (sent by user)
      const outgoingQuery = `
        SELECT h.id, h.from_user, h.to_handle, h.note, h.status, h.created_at,
               p.display_name as to_display_name, p.avatar_url as to_avatar_url
        FROM hellos h
        LEFT JOIN profiles p ON h.to_handle = p.handle
        WHERE h.from_user = $1
        ${status ? 'AND h.status = $2' : ''}
        ORDER BY h.created_at DESC
        LIMIT $${status ? '3' : '2'} OFFSET $${status ? '4' : '3'}
      `;

      const params = [userId];
      if (status) params.push(status);
      params.push(limit, offset);

      const outgoing = await sql(outgoingQuery, params);
      hellos = hellos.concat(outgoing.map((h) => ({ ...h, direction: 'outgoing' })));
    }

    // Sort by created_at desc
    hellos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return Response.json({
      hellos: hellos.slice(0, limit),
      hasMore: hellos.length === limit,
    });
  } catch (error) {
    console.error('Get hellos failed:', error);

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
        error: 'Failed to get hellos',
      },
      { status: 500 },
    );
  }
}
