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

    // Get the hello and verify user can accept it
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
          error: 'Unauthorized to accept this hello',
        },
        { status: 403 },
      );
    }

    // Use transaction to accept hello and create introduction
    const result = await sql.transaction([
      // Accept the hello
      sql`
        UPDATE hellos 
        SET status = 'ACCEPTED' 
        WHERE id = ${id}
        RETURNING id, from_user, to_handle, note, status, created_at
      `,
      // Create introduction between the two users
      sql`
        INSERT INTO introductions (a_user, b_user)
        VALUES (${hello.from_user}, ${userId})
        ON CONFLICT (least(a_user,b_user), greatest(a_user,b_user)) DO NOTHING
        RETURNING id, a_user, b_user, created_at
      `,
    ]);

    const [updatedHello, introduction] = result;

    return Response.json({
      hello: updatedHello[0],
      introduction: introduction[0] || null,
    });
  } catch (error) {
    console.error('Accept hello failed:', error);

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
        error: 'Failed to accept hello',
      },
      { status: 500 },
    );
  }
}
