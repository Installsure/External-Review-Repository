export async function POST(request) {
  try {
    const body = await request.json();
    const { message, persona_id = 'dating-hero', user_id = 'demo-user', session_id } = body;

    // Validate required fields
    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;

    let aiMessage;
    let usage_stub = false;

    if (!openaiApiKey || openaiApiKey.length <= 10) {
      // Return a persona-aware stub response
      const personaPrefix = persona_id === 'dating-hero' ? 'Companion: ' : 'Agent: ';
      aiMessage = personaPrefix + `You said: ${message}. I'm here to help.`;
      usage_stub = true;
    } else {
      try {
        // Call OpenAI API with persona context
        const systemPrompt =
          persona_id === 'dating-hero'
            ? 'You are a warm, empathetic companion. Be supportive and caring in your responses.'
            : 'You are a witty but firm project coordinator. Be helpful but direct in your responses.';

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: systemPrompt,
              },
              {
                role: 'user',
                content: message,
              },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        aiMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
      } catch (error) {
        console.error('OpenAI API error:', error);
        const personaPrefix = persona_id === 'dating-hero' ? 'Companion: ' : 'Agent: ';
        aiMessage = personaPrefix + `You said: ${message}. I'm here to help.`;
        usage_stub = true;
      }
    }

    // Generate visemes for voice synthesis (stub data)
    const visemes = ['A', 'E', 'I', 'O', 'U'].map((v, i) => ({
      at: i * 120,
      viseme: v,
      weight: 1.0,
    }));

    return Response.json({
      success: true,
      message: aiMessage,
      persona_id,
      user_id,
      session_id,
      visemes,
      usage_stub,
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return Response.json({ error: 'Failed to process AI chat request' }, { status: 500 });
  }
}
