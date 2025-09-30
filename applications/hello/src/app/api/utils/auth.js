export function getUserFromAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);

    // For demo purposes, we're using simple base64 encoding
    // In production, use proper JWT verification
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString());

      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload.sub;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export function requireAuth(request) {
  const userId = getUserFromAuth(request);
  if (!userId) {
    throw new Error('Authentication required');
  }
  return userId;
}
