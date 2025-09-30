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

// POST - Create evidence snapshot
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

    // Check if user has safety permissions
    if (!['safety_officer', 'admin', 'performer'].includes(user.role)) {
      return Response.json({ error: 'Safety access required' }, { status: 403 });
    }

    // In production, this would:
    // 1. Capture system state
    // 2. Store media/content snapshots
    // 3. Create legal compliance records
    // 4. Generate evidence package

    const snapshot = {
      type: 'snapshot',
      user_id: user.id,
      timestamp: new Date().toISOString(),
      system_state: {
        active_users: 3,
        active_contents: 0,
        active_bookings: 0,
        safety_status: 'operational',
      },
      evidence_id: `EVIDENCE_${Date.now()}`,
    };

    // Log the snapshot creation
    await sql`
      INSERT INTO audit_logs (user_id, action, meta)
      VALUES (${user.id}, 'evidence_snapshot_created', ${JSON.stringify(snapshot)})
    `;

    return Response.json({
      success: true,
      message: 'Evidence snapshot created successfully',
      snapshot: {
        id: snapshot.evidence_id,
        timestamp: snapshot.timestamp,
        created_by: user.email,
      },
    });
  } catch (error) {
    console.error('Create snapshot error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
