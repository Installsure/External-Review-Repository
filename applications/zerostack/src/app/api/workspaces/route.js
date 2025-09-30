import sql from '../utils/sql.js';

export async function GET(request) {
  try {
    // Get user from token (mock for now)
    const userEmail = 'admin@zerostack.dev'; // In production, extract from JWT

    // Get user's workspaces (orgs)
    const workspaces = await sql`
      SELECT 
        o.id,
        o.name,
        o.slug,
        o.avatar_url,
        o.billing_email,
        o.created_at,
        m.role,
        COUNT(a.id) as app_count
      FROM orgs o
      INNER JOIN memberships m ON m.org_id = o.id
      INNER JOIN users u ON u.id = m.user_id
      LEFT JOIN apps a ON a.org_id = o.id
      WHERE u.email = ${userEmail}
      GROUP BY o.id, o.name, o.slug, o.avatar_url, o.billing_email, o.created_at, m.role
      ORDER BY o.created_at DESC
    `;

    return Response.json({ workspaces });
  } catch (error) {
    console.error('Get workspaces error:', error);
    return Response.json({ error: 'Failed to fetch workspaces' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    // Basic validation
    if (!name || !slug) {
      return Response.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return Response.json(
        {
          error: 'Slug must contain only lowercase letters, numbers, and hyphens',
        },
        { status: 400 },
      );
    }

    // Get user (mock for now)
    const userEmail = 'admin@zerostack.dev';
    const user = await sql`SELECT id FROM users WHERE email = ${userEmail}`;

    if (user.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user[0].id;

    // Check if slug already exists
    const existing = await sql`SELECT id FROM orgs WHERE slug = ${slug}`;
    if (existing.length > 0) {
      return Response.json({ error: 'Workspace with this slug already exists' }, { status: 409 });
    }

    // Create workspace and membership in transaction
    const result = await sql.transaction([
      sql`
        INSERT INTO orgs (name, slug, billing_email)
        VALUES (${name}, ${slug}, ${userEmail})
        RETURNING id, name, slug, avatar_url, billing_email, created_at
      `,
      sql`
        INSERT INTO memberships (user_id, org_id, role)
        VALUES (${userId}, (SELECT currval('orgs_id_seq')), 'owner')
      `,
    ]);

    const workspace = result[0][0];

    // Log event
    await sql`
      INSERT INTO events (org_id, user_id, event_type, metadata)
      VALUES (${workspace.id}, ${userId}, 'workspace_created', ${JSON.stringify({ workspace_name: name })})
    `;

    return Response.json({
      workspace: {
        ...workspace,
        role: 'owner',
        app_count: 0,
      },
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    return Response.json({ error: 'Failed to create workspace' }, { status: 500 });
  }
}
