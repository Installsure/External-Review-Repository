import sql from '@/app/api/utils/sql';
import { requireAuth } from '@/app/api/utils/auth';

export async function GET(request) {
  try {
    const userId = requireAuth(request);

    const profiles = await sql`
      SELECT user_id, handle, display_name, avatar_url, bio, links, updated_at
      FROM profiles 
      WHERE user_id = ${userId}
    `;

    if (profiles.length === 0) {
      return Response.json(
        {
          error: 'Profile not found',
        },
        { status: 404 },
      );
    }

    return Response.json(profiles[0]);
  } catch (error) {
    console.error('Get profile failed:', error);

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
        error: 'Failed to get profile',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const userId = requireAuth(request);
    const body = await request.json();

    const { handle, display_name, bio, avatar_url, links } = body;

    // Validate required fields
    if (!handle || !display_name) {
      return Response.json(
        {
          error: 'Handle and display name are required',
        },
        { status: 400 },
      );
    }

    // Validate handle format (alphanumeric + underscore/dash)
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(handle)) {
      return Response.json(
        {
          error:
            'Handle must be 3-20 characters and contain only letters, numbers, underscore, or dash',
        },
        { status: 400 },
      );
    }

    try {
      // Check if this profile exists
      const existingProfile = await sql`
        SELECT user_id FROM profiles WHERE user_id = ${userId}
      `;

      let profile;

      if (existingProfile.length === 0) {
        // Create new profile
        profile = await sql`
          INSERT INTO profiles (user_id, handle, display_name, bio, avatar_url, links, updated_at)
          VALUES (${userId}, ${handle}, ${display_name}, ${bio || null}, ${avatar_url || null}, ${JSON.stringify(links || {})}, NOW())
          RETURNING user_id, handle, display_name, avatar_url, bio, links, updated_at
        `;
      } else {
        // Update existing profile
        profile = await sql`
          UPDATE profiles 
          SET handle = ${handle}, 
              display_name = ${display_name}, 
              bio = ${bio || null}, 
              avatar_url = ${avatar_url || null}, 
              links = ${JSON.stringify(links || {})},
              updated_at = NOW()
          WHERE user_id = ${userId}
          RETURNING user_id, handle, display_name, avatar_url, bio, links, updated_at
        `;
      }

      return Response.json(profile[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);

      // Check for unique constraint violation (duplicate handle)
      if (dbError.message?.includes('profiles_handle_key')) {
        return Response.json(
          {
            error: 'Handle already taken',
          },
          { status: 409 },
        );
      }

      throw dbError;
    }
  } catch (error) {
    console.error('Update profile failed:', error);

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
        error: 'Failed to update profile',
      },
      { status: 500 },
    );
  }
}
