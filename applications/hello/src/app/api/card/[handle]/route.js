import sql from '@/app/api/utils/sql';

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

    // Parse links if it's a string
    if (typeof profile.links === 'string') {
      try {
        profile.links = JSON.parse(profile.links);
      } catch {
        profile.links = {};
      }
    }

    return Response.json(profile);
  } catch (error) {
    console.error('Get card failed:', error);

    return Response.json(
      {
        error: 'Failed to get card',
      },
      { status: 500 },
    );
  }
}
