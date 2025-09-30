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

// POST - Emergency stop all platform activities
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

    // Check if user has emergency stop permissions
    if (!['safety_officer', 'admin', 'performer'].includes(user.role)) {
      return Response.json({ error: 'Emergency stop access required' }, { status: 403 });
    }

    // In production, this would:
    // 1. Immediately terminate all active streams
    // 2. Cancel all in-progress bookings
    // 3. Set all in-review content back to review
    // 4. Notify all users of emergency situation
    // 5. Lock platform until safety review

    const emergencyActions = [];

    try {
      // Cancel all requested/confirmed bookings
      const cancelledBookings = await sql`
        UPDATE bookings 
        SET status = 'CANCELLED'
        WHERE status IN ('REQUESTED', 'CONFIRMED')
        RETURNING id
      `;
      emergencyActions.push(`Cancelled ${cancelledBookings.length} bookings`);

      // Set all review content back to review (in case they were in process)
      const reviewContent = await sql`
        UPDATE contents 
        SET status = 'REVIEW'
        WHERE status = 'REVIEW'
        RETURNING id
      `;
      emergencyActions.push(`Secured ${reviewContent.length} content items under review`);

      // Log the emergency stop
      await sql`
        INSERT INTO audit_logs (user_id, action, meta)
        VALUES (${user.id}, 'emergency_stop_activated', ${JSON.stringify({
          triggered_by: user.email,
          timestamp: new Date().toISOString(),
          actions: emergencyActions,
          reason: 'Manual emergency stop activation',
        })})
      `;

      return Response.json({
        success: true,
        message: 'Emergency stop activated successfully',
        actions_taken: emergencyActions,
        timestamp: new Date().toISOString(),
        triggered_by: user.email,
      });
    } catch (dbError) {
      console.error('Database error during emergency stop:', dbError);

      // Still log that emergency stop was attempted
      await sql`
        INSERT INTO audit_logs (user_id, action, meta)
        VALUES (${user.id}, 'emergency_stop_failed', ${JSON.stringify({
          triggered_by: user.email,
          timestamp: new Date().toISOString(),
          error: dbError.message,
        })})
      `;

      return Response.json(
        {
          error: 'Emergency stop partially failed - contact system admin immediately',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Emergency stop error:', error);
    return Response.json({ error: 'Critical error - emergency stop failed' }, { status: 500 });
  }
}
