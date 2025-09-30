import sql from '@/app/api/utils/sql';

function generateVCard(profile) {
  const { display_name, handle, bio, links } = profile;

  // Parse links if it's a string
  let parsedLinks = {};
  if (typeof links === 'string') {
    try {
      parsedLinks = JSON.parse(links);
    } catch {
      parsedLinks = {};
    }
  } else {
    parsedLinks = links || {};
  }

  let vcard = 'BEGIN:VCARD\r\n';
  vcard += 'VERSION:3.0\r\n';
  vcard += `FN:${display_name}\r\n`;
  vcard += `NICKNAME:${handle}\r\n`;

  if (bio) {
    vcard += `NOTE:${bio}\r\n`;
  }

  if (parsedLinks.email) {
    vcard += `EMAIL:${parsedLinks.email}\r\n`;
  }

  if (parsedLinks.phone) {
    vcard += `TEL:${parsedLinks.phone}\r\n`;
  }

  if (parsedLinks.website) {
    vcard += `URL:${parsedLinks.website}\r\n`;
  }

  // Add social links as URLs
  if (parsedLinks.socials && Array.isArray(parsedLinks.socials)) {
    parsedLinks.socials.forEach((social) => {
      if (social.url) {
        vcard += `URL:${social.url}\r\n`;
      }
    });
  }

  vcard += 'END:VCARD\r\n';

  return vcard;
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

    // Get profile data
    const profiles = await sql`
      SELECT handle, display_name, avatar_url, bio, links
      FROM profiles 
      WHERE handle = ${handle}
    `;

    if (profiles.length === 0) {
      return Response.json(
        {
          error: 'Profile not found',
        },
        { status: 404 },
      );
    }

    const profile = profiles[0];
    const vcard = generateVCard(profile);

    return new Response(vcard, {
      headers: {
        'Content-Type': 'text/vcard',
        'Content-Disposition': `attachment; filename="${handle}.vcf"`,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Generate vCard failed:', error);

    return Response.json(
      {
        error: 'Failed to generate vCard',
      },
      { status: 500 },
    );
  }
}
