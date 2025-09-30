import sql from '@/app/api/utils/sql';

// Simple QR code generation using HTML Canvas approach
function generateQRCodeSVG(text, size = 200) {
  // For demo purposes, we'll create a simple placeholder
  // In production, use a proper QR code library
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="white"/>
      <rect x="20" y="20" width="20" height="20" fill="black"/>
      <rect x="60" y="20" width="20" height="20" fill="black"/>
      <rect x="100" y="20" width="20" height="20" fill="black"/>
      <rect x="140" y="20" width="20" height="20" fill="black"/>
      <rect x="160" y="20" width="20" height="20" fill="black"/>
      
      <rect x="20" y="60" width="20" height="20" fill="black"/>
      <rect x="100" y="60" width="20" height="20" fill="black"/>
      <rect x="160" y="60" width="20" height="20" fill="black"/>
      
      <rect x="20" y="100" width="20" height="20" fill="black"/>
      <rect x="60" y="100" width="20" height="20" fill="black"/>
      <rect x="100" y="100" width="20" height="20" fill="black"/>
      <rect x="140" y="100" width="20" height="20" fill="black"/>
      <rect x="160" y="100" width="20" height="20" fill="black"/>
      
      <rect x="20" y="140" width="20" height="20" fill="black"/>
      <rect x="160" y="140" width="20" height="20" fill="black"/>
      
      <rect x="20" y="160" width="20" height="20" fill="black"/>
      <rect x="60" y="160" width="20" height="20" fill="black"/>
      <rect x="100" y="160" width="20" height="20" fill="black"/>
      <rect x="140" y="160" width="20" height="20" fill="black"/>
      <rect x="160" y="160" width="20" height="20" fill="black"/>
      
      <text x="${size / 2}" y="${size - 10}" text-anchor="middle" font-size="10" fill="black">${text.slice(0, 20)}</text>
    </svg>
  `;

  return svg;
}

export async function GET(request, { params }) {
  try {
    const { handle } = params;

    if (!handle) {
      return Response.json(
        {
          error: 'Handle is required',
        },
        { status: 400 },
      );
    }

    // Verify profile exists
    const profiles = await sql`
      SELECT handle FROM profiles WHERE handle = ${handle}
    `;

    if (profiles.length === 0) {
      return Response.json(
        {
          error: 'Profile not found',
        },
        { status: 404 },
      );
    }

    // Generate the URL that the QR code should point to
    const baseUrl = process.env.APP_URL || 'http://localhost:5173';
    const cardUrl = `${baseUrl}/card/${handle}`;

    // Generate QR code SVG
    const qrSvg = generateQRCodeSVG(cardUrl);

    return new Response(qrSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        ETag: `"qr-${handle}-${Date.now()}"`,
      },
    });
  } catch (error) {
    console.error('Generate QR code failed:', error);

    return Response.json(
      {
        error: 'Failed to generate QR code',
      },
      { status: 500 },
    );
  }
}
