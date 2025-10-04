import sql from '@/app/api/utils/sql';
import { requireAuth } from '@/app/api/utils/auth';

export async function GET(request, { params }) {
  try {
    const userId = requireAuth(request);
    const { introId } = params;

    if (!introId) {
      return Response.json(
        {
          error: 'Introduction ID is required',
        },
        { status: 400 },
      );
    }

    // Verify user is part of this introduction
    const intro = await sql`
      SELECT id FROM introductions 
      WHERE id = ${introId} 
      AND (a_user = ${userId} OR b_user = ${userId})
    `;

    if (intro.length === 0) {
      return Response.json(
        {
          error: 'Introduction not found or access denied',
        },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    // Get messages for this introduction
    const messages = await sql`
      SELECT 
        m.id,
        m.intro_id,
        m.sender,
        m.content,
        m.created_at,
        p.display_name as sender_display_name,
        p.handle as sender_handle,
        p.avatar_url as sender_avatar_url
      FROM messages m
      LEFT JOIN profiles p ON m.sender = p.user_id
      WHERE m.intro_id = ${introId}
      ORDER BY m.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return Response.json({
      messages: messages.reverse(), // Show oldest first
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error('Get messages failed:', error);

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
        error: 'Failed to get messages',
      },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  try {
    const userId = requireAuth(request);
    const { introId } = params;

    if (!introId) {
      return Response.json(
        {
          error: 'Introduction ID is required',
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return Response.json(
        {
          error: 'Message content is required',
        },
        { status: 400 },
      );
    }

    // Verify user is part of this introduction
    const intro = await sql`
      SELECT id FROM introductions 
      WHERE id = ${introId} 
      AND (a_user = ${userId} OR b_user = ${userId})
    `;

    if (intro.length === 0) {
      return Response.json(
        {
          error: 'Introduction not found or access denied',
        },
        { status: 404 },
      );
    }

    // Create the message
    const message = await sql`
      INSERT INTO messages (intro_id, sender, content)
      VALUES (${introId}, ${userId}, ${content.trim()})
      RETURNING id, intro_id, sender, content, created_at
    `;

    return Response.json(message[0], { status: 201 });
  } catch (error) {
    console.error('Send message failed:', error);

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
        error: 'Failed to send message',
      },
      { status: 500 },
    );
  }
}
