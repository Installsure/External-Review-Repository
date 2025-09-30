import { verify } from 'jsonwebtoken';

// Extract JWT token from Authorization header
export function extractToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove "Bearer " prefix
}

// Verify JWT token and return decoded payload
export function verifyToken(token) {
  try {
    return verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware to require authentication
export function requireAuth(handler) {
  return async (request, context) => {
    const token = extractToken(request);
    if (!token) {
      return Response.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Add user info to request context
    const enhancedContext = {
      ...context,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        orgs: payload.orgs || [],
      },
    };

    return handler(request, enhancedContext);
  };
}

// Check if user has required role in organization
export function hasOrgRole(userOrgs, orgId, requiredRole) {
  const org = userOrgs.find((o) => o.id === orgId);
  if (!org) return false;

  const roleHierarchy = {
    VIEWER: 1,
    MEMBER: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  const userLevel = roleHierarchy[org.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;

  return userLevel >= requiredLevel;
}

// Middleware to require specific org role
export function requireOrgRole(requiredRole = 'MEMBER') {
  return function (handler) {
    return requireAuth(async (request, context) => {
      const { user } = context;
      const url = new URL(request.url);
      const orgId = url.searchParams.get('org') || url.searchParams.get('org_id');

      if (!orgId) {
        return Response.json({ error: 'Organization ID required' }, { status: 400 });
      }

      if (!hasOrgRole(user.orgs, orgId, requiredRole)) {
        return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      return handler(request, { ...context, orgId });
    });
  };
}
