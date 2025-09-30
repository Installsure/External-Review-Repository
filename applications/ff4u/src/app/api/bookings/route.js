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

// GET - List bookings for current user
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

    let bookings = [];

    if (user.role === 'client') {
      // Get bookings made by this client
      bookings = await sql`
        SELECT 
          b.id,
          b.slot_start,
          b.slot_end,
          b.status,
          b.created_at,
          pp.display_name as performer_name,
          u.email as performer_email
        FROM bookings b
        JOIN users u ON b.performer_id = u.id
        LEFT JOIN performer_profiles pp ON u.id = pp.user_id
        WHERE b.client_id = ${user.id}
        ORDER BY b.slot_start DESC
      `;
    } else if (user.role === 'performer') {
      // Get bookings for this performer
      bookings = await sql`
        SELECT 
          b.id,
          b.slot_start,
          b.slot_end,
          b.status,
          b.created_at,
          u.email as client_email
        FROM bookings b
        JOIN users u ON b.client_id = u.id
        WHERE b.performer_id = ${user.id}
        ORDER BY b.slot_start DESC
      `;
    } else if (['admin', 'moderator', 'safety_officer'].includes(user.role)) {
      // Get all bookings for staff
      bookings = await sql`
        SELECT 
          b.id,
          b.slot_start,
          b.slot_end,
          b.status,
          b.created_at,
          c.email as client_email,
          p.email as performer_email,
          pp.display_name as performer_name
        FROM bookings b
        JOIN users c ON b.client_id = c.id
        JOIN users p ON b.performer_id = p.id
        LEFT JOIN performer_profiles pp ON p.id = pp.user_id
        ORDER BY b.slot_start DESC
      `;
    }

    return Response.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new booking
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

    if (user.role !== 'client') {
      return Response.json({ error: 'Client role required' }, { status: 403 });
    }

    const body = await request.json();
    const { performer_id, slot_start, slot_end, special_requests } = body;

    if (!performer_id || !slot_start || !slot_end) {
      return Response.json(
        { error: 'Performer ID, start time, and end time are required' },
        { status: 400 },
      );
    }

    // Validate the performer exists and is verified
    const performerResult = await sql`
      SELECT pp.id, pp.kyc_status, u.role
      FROM performer_profiles pp
      JOIN users u ON pp.user_id = u.id
      WHERE u.id = ${performer_id} AND u.role = 'performer'
    `;

    if (performerResult.length === 0) {
      return Response.json({ error: 'Performer not found' }, { status: 404 });
    }

    const performer = performerResult[0];
    if (performer.kyc_status !== 'verified') {
      return Response.json({ error: 'Performer is not verified' }, { status: 400 });
    }

    // Parse dates
    const startTime = new Date(slot_start);
    const endTime = new Date(slot_end);

    if (startTime <= new Date()) {
      return Response.json({ error: 'Booking time must be in the future' }, { status: 400 });
    }

    if (endTime <= startTime) {
      return Response.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    // Check for conflicts with existing bookings
    const conflicts = await sql`
      SELECT id FROM bookings
      WHERE performer_id = ${performer_id}
        AND status IN ('REQUESTED', 'CONFIRMED')
        AND (
          (slot_start <= ${startTime.toISOString()} AND slot_end > ${startTime.toISOString()})
          OR 
          (slot_start < ${endTime.toISOString()} AND slot_end >= ${endTime.toISOString()})
          OR
          (slot_start >= ${startTime.toISOString()} AND slot_end <= ${endTime.toISOString()})
        )
    `;

    if (conflicts.length > 0) {
      return Response.json({ error: 'Time slot conflicts with existing booking' }, { status: 409 });
    }

    // Create the booking
    const result = await sql`
      INSERT INTO bookings (client_id, performer_id, slot_start, slot_end, status)
      VALUES (${user.id}, ${performer_id}, ${startTime.toISOString()}, ${endTime.toISOString()}, 'REQUESTED')
      RETURNING id, slot_start, slot_end, status, created_at
    `;

    const booking = result[0];

    // Log the booking request
    await sql`
      INSERT INTO audit_logs (user_id, action, meta)
      VALUES (${user.id}, 'booking_requested', ${JSON.stringify({
        booking_id: booking.id,
        performer_id,
        slot_start: startTime.toISOString(),
        slot_end: endTime.toISOString(),
        special_requests,
      })})
    `;

    return Response.json({
      booking: {
        id: booking.id,
        slot_start: booking.slot_start,
        slot_end: booking.slot_end,
        status: booking.status,
        created_at: booking.created_at,
      },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
