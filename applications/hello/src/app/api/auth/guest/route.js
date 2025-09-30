import sql from '@/app/api/utils/sql';

function generateUserId() {
  return (
    'guest_' +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function signJWT(payload) {
  const secret = process.env.JWT_SECRET || 'change-me';
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');

  // Simple HMAC-SHA256 signature (in production, use a proper JWT library)
  const crypto = globalThis.crypto || require('crypto').webcrypto;
  const encoder = new TextEncoder();
  const key = crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  return key
    .then((k) => crypto.subtle.sign('HMAC', k, encoder.encode(`${header}.${payloadStr}`)))
    .then((signature) => `${header}.${payloadStr}.${Buffer.from(signature).toString('base64url')}`);
}

export async function POST(request) {
  try {
    const { userId: existingUserId } = await request.json().catch(() => ({}));

    let userId = existingUserId;

    // If no userId provided or user doesn't exist, create new one
    if (!userId) {
      userId = generateUserId();
    }

    // Check if user exists, if not create them
    const existingUser = await sql`
      SELECT id FROM users WHERE id = ${userId}
    `;

    if (existingUser.length === 0) {
      await sql`
        INSERT INTO users (id) VALUES (${userId})
      `;
    }

    // Create JWT payload
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    };

    // For simplicity in demo, we'll create a basic token
    // In production, use proper JWT library
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');

    return Response.json({
      token,
      userId,
    });
  } catch (error) {
    console.error('Guest auth failed:', error);

    return Response.json(
      {
        error: 'Authentication failed',
      },
      { status: 500 },
    );
  }
}
