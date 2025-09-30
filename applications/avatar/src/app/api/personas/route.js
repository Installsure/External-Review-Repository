export async function GET(_request) {
  try {
    const personas = [
      {
        id: 'dating-hero',
        displayName: 'Companion',
        tone: {
          style: 'warm-empathetic',
          humor: 0.3,
          flirtation: 0.2,
        },
        ethics: {
          discloseAI: true,
          consentBoundaries: true,
          escalateCrisis: true,
        },
        domain: {
          role: 'Companionship',
          goals: ['rapport', 'shared_interests', 'light_planning'],
        },
        memoryPolicy: {
          retainDays: 180,
          scope: ['name', 'likes', 'milestones'],
        },
      },
      {
        id: 'construction-smart-alec',
        displayName: 'RFI Enforcer',
        tone: { style: 'witty-firm' },
        ethics: { discloseAI: true },
        domain: { role: 'Project Coordination' },
        memoryPolicy: { retainDays: 30 },
      },
    ];

    return Response.json(personas);
  } catch (error) {
    console.error('Error fetching personas:', error);
    return Response.json({ error: 'Failed to fetch personas' }, { status: 500 });
  }
}
