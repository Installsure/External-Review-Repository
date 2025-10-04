import sql from '@/app/api/utils/db';
import { requireAuth } from '@/app/api/utils/auth';

// GET /api/search - Full-text search across projects, tasks, and comments
export const GET = requireAuth(async (request, context) => {
  try {
    const { user } = context;
    const url = new URL(request.url);

    const query = url.searchParams.get('q');
    const orgId = url.searchParams.get('org');
    const kinds = url.searchParams.get('kinds')?.split(',') || ['project', 'task', 'comment'];
    const limit = Math.min(parseInt(url.searchParams.get('limit'), 10) || 20, 50);
    const offset = parseInt(url.searchParams.get('offset'), 10) || 0;

    if (!query || query.trim().length < 2) {
      return Response.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 },
      );
    }

    if (!orgId) {
      return Response.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    // Check if user has access to this org
    const userOrg = user.orgs.find((o) => o.id === orgId);
    if (!userOrg) {
      return Response.json({ error: 'Access denied to this organization' }, { status: 403 });
    }

    const searchTerm = query.trim().replace(/[^\w\s]/g, '');
    const results = [];

    // Search projects
    if (kinds.includes('project')) {
      const projectResults = await sql`
        SELECT 
          'project' as kind,
          p.id,
          p.name as title,
          p.description as body,
          p.created_at,
          u.name as created_by_name,
          ts_headline(p.name, plainto_tsquery(${searchTerm}), 'StartSel=<mark>, StopSel=</mark>') as title_highlight,
          ts_headline(COALESCE(p.description, ''), plainto_tsquery(${searchTerm}), 'StartSel=<mark>, StopSel=</mark>') as body_highlight
        FROM projects p
        LEFT JOIN users u ON p.created_by = u.id
        WHERE p.org_id = ${orgId}
          AND (
            to_tsvector('english', p.name) @@ plainto_tsquery(${searchTerm})
            OR to_tsvector('english', COALESCE(p.description, '')) @@ plainto_tsquery(${searchTerm})
          )
        ORDER BY p.created_at DESC
      `;
      results.push(...projectResults.rows);
    }

    // Search tasks
    if (kinds.includes('task')) {
      const taskResults = await sql`
        SELECT 
          'task' as kind,
          t.id,
          t.title,
          t.body,
          t.created_at,
          p.name as project_name,
          u.name as assignee_name,
          ts_headline(t.title, plainto_tsquery(${searchTerm}), 'StartSel=<mark>, StopSel=</mark>') as title_highlight,
          ts_headline(COALESCE(t.body, ''), plainto_tsquery(${searchTerm}), 'StartSel=<mark>, StopSel=</mark>') as body_highlight
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assignee = u.id
        WHERE p.org_id = ${orgId}
          AND (
            to_tsvector('english', t.title) @@ plainto_tsquery(${searchTerm})
            OR to_tsvector('english', COALESCE(t.body, '')) @@ plainto_tsquery(${searchTerm})
          )
        ORDER BY t.created_at DESC
      `;
      results.push(...taskResults.rows);
    }

    // Search comments
    if (kinds.includes('comment')) {
      const commentResults = await sql`
        SELECT 
          'comment' as kind,
          c.id,
          t.title as task_title,
          c.body,
          c.created_at,
          p.name as project_name,
          u.name as author_name,
          '' as title_highlight,
          ts_headline(c.body, plainto_tsquery(${searchTerm}), 'StartSel=<mark>, StopSel=</mark>') as body_highlight
        FROM comments c
        JOIN tasks t ON c.task_id = t.id
        JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON c.user_id = u.id
        WHERE p.org_id = ${orgId}
          AND to_tsvector('english', c.body) @@ plainto_tsquery(${searchTerm})
        ORDER BY c.created_at DESC
      `;
      results.push(...commentResults.rows);
    }

    // Sort by created_at desc and apply pagination
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const paginatedResults = results.slice(offset, offset + limit);

    return Response.json({
      results: paginatedResults,
      pagination: {
        limit,
        offset,
        total: results.length,
      },
      query: query,
      kinds: kinds,
    });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
});
