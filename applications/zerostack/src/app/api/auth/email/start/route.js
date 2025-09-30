// Mock OTP storage - in production this would be Redis or database
const otpStore = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Basic validation
    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 5-minute expiry
    otpStore.set(email, {
      code: otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // In production, send email via SMTP
    console.log(`OTP for ${email}: ${otp}`);

    // Mock email sending delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return Response.json({
      message: 'Verification code sent to your email',
      email: email,
    });
  } catch (error) {
    console.error('Auth email start error:', error);
    return Response.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}
