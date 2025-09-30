import sql from '../utils/sql.js';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const workspaceId = url.searchParams.get('workspace_id');

    // Get user from token (mock for now)
    const userEmail = 'admin@zerostack.dev';

    let query;
    const params = [userEmail];

    if (workspaceId) {
      // Get apps for specific workspace
      query = `
        SELECT 
          a.id,
          a.name,
          a.slug,
          a.blueprint,
          a.status,
          a.config,
          a.endpoints,
          a.created_at,
          a.updated_at,
          o.name as workspace_name
        FROM apps a
        INNER JOIN orgs o ON o.id = a.org_id
        INNER JOIN memberships m ON m.org_id = o.id
        INNER JOIN users u ON u.id = m.user_id
        WHERE u.email = $1 AND a.org_id = $2
        ORDER BY a.created_at DESC
      `;
      params.push(workspaceId);
    } else {
      // Get all apps for user
      query = `
        SELECT 
          a.id,
          a.name,
          a.slug,
          a.blueprint,
          a.status,
          a.config,
          a.endpoints,
          a.created_at,
          a.updated_at,
          o.name as workspace_name
        FROM apps a
        INNER JOIN orgs o ON o.id = a.org_id
        INNER JOIN memberships m ON m.org_id = o.id
        INNER JOIN users u ON u.id = m.user_id
        WHERE u.email = $1
        ORDER BY a.created_at DESC
      `;
    }

    const apps = await sql(query, params);
    return Response.json({ apps });
  } catch (error) {
    console.error('Get apps error:', error);
    return Response.json({ error: 'Failed to fetch apps' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { workspaceId, name, blueprint } = body;

    // Basic validation
    if (!workspaceId || !name || !blueprint) {
      return Response.json(
        { error: 'Workspace ID, name, and blueprint are required' },
        { status: 400 },
      );
    }

    // Validate blueprint
    const validBlueprints = ['store', 'dating', 'content'];
    if (!validBlueprints.includes(blueprint)) {
      return Response.json(
        { error: `Blueprint must be one of: ${validBlueprints.join(', ')}` },
        { status: 400 },
      );
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    if (!slug) {
      return Response.json(
        { error: 'Could not generate valid slug from app name' },
        { status: 400 },
      );
    }

    // Get user and verify workspace access
    const userEmail = 'admin@zerostack.dev';
    const accessCheck = await sql`
      SELECT o.id, u.id as user_id
      FROM orgs o
      INNER JOIN memberships m ON m.org_id = o.id
      INNER JOIN users u ON u.id = m.user_id
      WHERE u.email = ${userEmail} AND o.id = ${workspaceId}
    `;

    if (accessCheck.length === 0) {
      return Response.json({ error: 'Workspace not found or access denied' }, { status: 404 });
    }

    const userId = accessCheck[0].user_id;

    // Check if app slug already exists in this workspace
    const existing = await sql`
      SELECT id FROM apps 
      WHERE org_id = ${workspaceId} AND slug = ${slug}
    `;

    if (existing.length > 0) {
      return Response.json(
        { error: 'App with this name already exists in workspace' },
        { status: 409 },
      );
    }

    // Generate mock endpoints based on blueprint
    const endpoints = {
      web: `https://${slug}-demo.zerostack.dev`,
      api: `https://api-${slug}-demo.zerostack.dev`,
    };

    // Create app and provision job in transaction
    const result = await sql.transaction([
      sql`
        INSERT INTO apps (org_id, name, slug, blueprint, status, endpoints)
        VALUES (${workspaceId}, ${name}, ${slug}, ${blueprint}, 'provisioning', ${JSON.stringify(endpoints)})
        RETURNING id, name, slug, blueprint, status, config, endpoints, created_at, updated_at
      `,
      sql`
        INSERT INTO jobs (app_id, job_type, payload)
        VALUES ((SELECT currval('apps_id_seq')), 'provision_app', ${JSON.stringify({ blueprint, name, slug })})
      `,
    ]);

    const app = result[0][0];

    // Log event
    await sql`
      INSERT INTO events (app_id, org_id, user_id, event_type, metadata)
      VALUES (${app.id}, ${workspaceId}, ${userId}, 'app_created', ${JSON.stringify({ app_name: name, blueprint })})
    `;

    // Simulate provisioning process (in real implementation, this would be handled by a worker)
    setTimeout(async () => {
      try {
        await sql`
          UPDATE apps 
          SET status = 'active', updated_at = NOW()
          WHERE id = ${app.id}
        `;

        await sql`
          UPDATE jobs
          SET status = 'completed', result = ${JSON.stringify({ success: true })}, completed_at = NOW()
          WHERE app_id = ${app.id} AND job_type = 'provision_app'
        `;
      } catch (err) {
        console.error('Error updating provisioning status:', err);
      }
    }, 3000);

    return Response.json({ app });
  } catch (error) {
    console.error('Create app error:', error);
    return Response.json({ error: 'Failed to create app' }, { status: 500 });
  }
}
