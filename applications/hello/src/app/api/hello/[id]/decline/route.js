import sql from '@/app/api/utils/sql';
import { requireAuth } from '@/app/api/utils/auth';

export async function POST(request, { params }) {
  try {
    const userId = requireAuth(request);
    const { id } = params;

    if (!id) {
      return Response.json(
        {
          error: 'Hello ID is required',
        },
        { status: 400 },
      );
    }

    // Get the hello and verify user can decline it
    const hellos = await sql`
      SELECT h.id, h.from_user, h.to_handle, h.status, p.user_id as target_user_id
      FROM hellos h
      JOIN profiles p ON h.to_handle = p.handle
      WHERE h.id = ${id} AND h.status = 'PENDING'
    `;

    if (hellos.length === 0) {
      return Response.json(
        {
          error: 'Hello request not found or already processed',
        },
        { status: 404 },
      );
    }

    const hello = hellos[0];

    // Verify the current user is the recipient
    if (hello.target_user_id !== userId) {
      return Response.json(
        {
          error: 'Unauthorized to decline this hello',
        },
        { status: 403 },
      );
    }

    // Decline the hello
    const updatedHello = await sql`
      UPDATE hellos 
      SET status = 'DECLINED' 
      WHERE id = ${id}
      RETURNING id, from_user, to_handle, note, status, created_at
    `;

    return Response.json({
      hello: updatedHello[0],
    });
  } catch (error) {
    console.error('Decline hello failed:', error);

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
        error: 'Failed to decline hello',
      },
      { status: 500 },
    );
  }
}
