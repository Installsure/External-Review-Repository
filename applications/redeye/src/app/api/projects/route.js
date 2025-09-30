import sql from '@/app/api/utils/db';
import { requireAuth, requireOrgRole } from '@/app/api/utils/auth';

// GET /api/projects - List projects with filters
export const GET = requireAuth(async (request, context) => {
  try {
    const { user } = context;
    const url = new URL(request.url);

    const orgId = url.searchParams.get('org');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('q');
    const limit = Math.min(parseInt(url.searchParams.get('limit')) || 20, 100);
    const offset = parseInt(url.searchParams.get('offset')) || 0;

    if (!orgId) {
      return Response.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    // Check if user has access to this org
    const userOrg = user.orgs.find((o) => o.id === orgId);
    if (!userOrg) {
      return Response.json({ error: 'Access denied to this organization' }, { status: 403 });
    }

    // Build query with filters
    const whereConditions = ['p.org_id = $1'];
    const params = [orgId];
    let paramIndex = 2;

    if (status) {
      whereConditions.push(`p.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(
        `(LOWER(p.name) LIKE LOWER($${paramIndex}) OR LOWER(p.description) LIKE LOWER($${paramIndex}))`,
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add limit and offset
    params.push(limit, offset);

    const query = `
      SELECT 
        p.id, p.name, p.description, p.status, p.created_at,
        u.name as created_by_name,
        COUNT(t.id) as task_count,
        COUNT(CASE WHEN t.status = 'DONE' THEN 1 END) as completed_tasks
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY p.id, p.name, p.description, p.status, p.created_at, u.name
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const result = await sql(query, params);

    return Response.json({
      projects: result.rows,
      pagination: {
        limit,
        offset,
        total: result.rows.length === limit ? offset + limit + 1 : offset + result.rows.length,
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST /api/projects - Create new project
export const POST = requireAuth(async (request, context) => {
  try {
    const { user } = context;
    const body = await request.json();
    const { name, description, status = 'ACTIVE', org_id } = body;

    if (!name || !org_id) {
      return Response.json({ error: 'Name and organization ID are required' }, { status: 400 });
    }

    // Check if user has permission to create projects in this org
    const userOrg = user.orgs.find((o) => o.id === org_id);
    if (!userOrg) {
      return Response.json({ error: 'Access denied to this organization' }, { status: 403 });
    }

    // Create project
    const result = await sql`
      INSERT INTO projects (name, description, status, org_id, created_by)
      VALUES (${name}, ${description}, ${status}, ${org_id}, ${user.id})
      RETURNING id, name, description, status, org_id, created_by, created_at
    `;

    const project = result.rows[0];

    // Log activity
    await sql`
      INSERT INTO activity (org_id, actor, kind, entity, entity_id, detail)
      VALUES (
        ${org_id}, 
        ${user.id}, 
        'CREATED', 
        'project', 
        ${project.id}, 
        ${JSON.stringify({ name: project.name })}
      )
    `;

    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});
