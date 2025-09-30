import sql from '@/app/api/utils/db';
import { requireAuth } from '@/app/api/utils/auth';

// GET /api/tasks - List tasks for a project
export const GET = requireAuth(async (request, context) => {
  try {
    const { user } = context;
    const url = new URL(request.url);

    const projectId = url.searchParams.get('project_id');
    const status = url.searchParams.get('status');
    const assignee = url.searchParams.get('assignee');
    const limit = Math.min(parseInt(url.searchParams.get('limit')) || 50, 100);
    const offset = parseInt(url.searchParams.get('offset')) || 0;

    if (!projectId) {
      return Response.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Check if user has access to this project's org
    const projectCheck = await sql`
      SELECT p.org_id 
      FROM projects p 
      WHERE p.id = ${projectId}
    `;

    if (projectCheck.rows.length === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const orgId = projectCheck.rows[0].org_id;
    const userOrg = user.orgs.find((o) => o.id === orgId);
    if (!userOrg) {
      return Response.json({ error: 'Access denied to this project' }, { status: 403 });
    }

    // Build query with filters
    const whereConditions = ['t.project_id = $1'];
    const params = [projectId];
    let paramIndex = 2;

    if (status) {
      whereConditions.push(`t.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (assignee) {
      whereConditions.push(`t.assignee = $${paramIndex}`);
      params.push(assignee);
      paramIndex++;
    }

    // Add limit and offset
    params.push(limit, offset);

    const query = `
      SELECT 
        t.id, t.title, t.body, t.status, t.priority, t.created_at,
        u1.name as assignee_name,
        u1.email as assignee_email,
        COUNT(c.id) as comment_count
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee = u1.id
      LEFT JOIN comments c ON t.id = c.task_id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY t.id, t.title, t.body, t.status, t.priority, t.created_at, u1.name, u1.email
      ORDER BY t.priority DESC, t.created_at ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const result = await sql(query, params);

    return Response.json({
      tasks: result.rows,
      pagination: {
        limit,
        offset,
        total: result.rows.length === limit ? offset + limit + 1 : offset + result.rows.length,
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});

// POST /api/tasks - Create new task
export const POST = requireAuth(async (request, context) => {
  try {
    const { user } = context;
    const body = await request.json();
    const { title, body: taskBody, project_id, status = 'TODO', assignee, priority = 0 } = body;

    if (!title || !project_id) {
      return Response.json({ error: 'Title and project ID are required' }, { status: 400 });
    }

    // Check if user has access to this project
    const projectCheck = await sql`
      SELECT p.org_id, p.name as project_name
      FROM projects p 
      WHERE p.id = ${project_id}
    `;

    if (projectCheck.rows.length === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projectCheck.rows[0];
    const userOrg = user.orgs.find((o) => o.id === project.org_id);
    if (!userOrg) {
      return Response.json({ error: 'Access denied to this project' }, { status: 403 });
    }

    // Create task
    const result = await sql`
      INSERT INTO tasks (title, body, project_id, status, assignee, priority)
      VALUES (${title}, ${taskBody}, ${project_id}, ${status}, ${assignee}, ${priority})
      RETURNING id, title, body, project_id, status, assignee, priority, created_at
    `;

    const task = result.rows[0];

    // Log activity
    await sql`
      INSERT INTO activity (org_id, actor, kind, entity, entity_id, detail)
      VALUES (
        ${project.org_id}, 
        ${user.id}, 
        'CREATED', 
        'task', 
        ${task.id}, 
        ${JSON.stringify({
          title: task.title,
          project_name: project.project_name,
          status: task.status,
        })}
      )
    `;

    return Response.json(task, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});
