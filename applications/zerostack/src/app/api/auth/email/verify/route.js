// Mock OTP storage - shared with start endpoint
// In production, this would be Redis or database
const otpStore = new Map();

// Mock JWT signing - in production use proper JWT library
function generateMockToken(email) {
  const payload = {
    sub: `user_${Math.random().toString(36).substr(2, 9)}`,
    email: email,
    name: email.split('@')[0],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  // In production: return jwt.sign(payload, process.env.JWT_SECRET)
  return `mock.jwt.token.${btoa(JSON.stringify(payload))}`;
}

function generateRefreshToken() {
  return `refresh_${Math.random().toString(36).substr(2, 16)}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Basic validation
    if (!email || !code) {
      return Response.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    // Check if OTP exists and is valid
    const otpData = otpStore.get(email);
    if (!otpData) {
      return Response.json({ error: 'No verification code found for this email' }, { status: 400 });
    }

    // Check if OTP has expired
    if (Date.now() > otpData.expires) {
      otpStore.delete(email);
      return Response.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // Check if code matches
    if (otpData.code !== code) {
      return Response.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // OTP is valid, clear it and generate tokens
    otpStore.delete(email);

    const accessToken = generateMockToken(email);
    const refreshToken = generateRefreshToken();

    // Set secure HTTP-only cookies for tokens
    const headers = new Headers();
    headers.set(
      'Set-Cookie',
      [
        `zs_access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${24 * 60 * 60}`, // 24 hours
        `zs_refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`, // 7 days
      ].join(', '),
    );

    return Response.json(
      {
        message: 'Authentication successful',
        access: accessToken,
        refresh: refreshToken,
        user: {
          email: email,
          name: email.split('@')[0],
        },
      },
      { headers },
    );
  } catch (error) {
    console.error('Auth email verify error:', error);
    return Response.json({ error: 'Failed to verify code' }, { status: 500 });
  }
}
