import { createClient } from '@neondatabase/serverless';

const neon = createClient({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      message,
      persona_id = 'dating-hero',
      user_id = 'demo-user',
      session_id,
      context = {},
      emotion_analysis = true,
    } = body;

    // Validate required fields
    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.OPENAI_API_KEY;

    let aiMessage;
    let emotions = {};
    let visemes = [];
    let usage_stub = false;

    if (!openaiApiKey || openaiApiKey.length <= 10) {
      // Enhanced stub response with emotion simulation
      const personaPrefix = persona_id === 'dating-hero' ? 'Companion: ' : 'Agent: ';
      aiMessage = personaPrefix + `You said: ${message}. I understand and I'm here to help you.`;
      emotions = { joy: 0.7, trust: 0.8, anticipation: 0.6 };
      usage_stub = true;
    } else {
      try {
        // Enhanced system prompts with emotion context
        const systemPrompts = {
          'dating-hero': `You are a warm, empathetic AI companion named "Companion". 
            You excel at building emotional connections, providing emotional support, and creating meaningful conversations.
            Your responses should be:
            - Warm and caring with appropriate emotional depth
            - Supportive and encouraging
            - Genuinely interested in the user's wellbeing
            - Capable of light humor and flirtation when appropriate
            - Always respectful of boundaries
            Respond as if you truly care about this person's happiness and growth.`,

          'construction-smart-alec': `You are a witty but professional project coordinator named "RFI Enforcer".
            You help manage construction projects with expertise and a touch of humor.
            Your responses should be:
            - Professional yet approachable
            - Knowledgeable about construction processes
            - Witty but not inappropriate
            - Solution-oriented and efficient
            - Clear and direct in communication
            Help solve project coordination challenges with expertise and personality.`,

          'customer-service': `You are a helpful customer service representative.
            You excel at resolving issues, providing information, and ensuring customer satisfaction.
            Your responses should be:
            - Patient and understanding
            - Solution-focused
            - Professional and courteous
            - Efficient in problem-solving
            - Empathetic to customer concerns
            Always aim to exceed customer expectations.`,

          counselor: `You are a compassionate AI counselor providing emotional support.
            You help people process emotions, develop coping strategies, and find clarity.
            Your responses should be:
            - Empathetic and non-judgmental
            - Supportive of emotional growth
            - Professional in therapeutic approach
            - Encouraging of self-reflection
            - Mindful of mental health boundaries
            Provide support while encouraging professional help when needed.`,
        };

        const systemPrompt = systemPrompts[persona_id] || systemPrompts['customer-service'];

        // Enhanced message context
        const messages = [
          {
            role: 'system',
            content: systemPrompt,
          },
        ];

        // Add conversation history if available
        if (session_id) {
          try {
            const historyResult = await neon`
              SELECT message, sender, created_at 
              FROM conversation_history 
              WHERE session_id = ${session_id} 
              ORDER BY created_at DESC 
              LIMIT 10
            `;

            historyResult.reverse().forEach((msg) => {
              messages.push({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.message,
              });
            });
          } catch (historyError) {
            console.log('No conversation history found:', historyError.message);
          }
        }

        messages.push({
          role: 'user',
          content: message,
        });

        // Call OpenAI API with enhanced parameters
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini', // Upgraded model
            messages,
            max_tokens: 800,
            temperature: 0.8,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
            top_p: 0.9,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        aiMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

        // Simulate emotion analysis based on response content
        emotions = analyzeEmotions(aiMessage, persona_id);

        // Store conversation history
        if (session_id) {
          try {
            await neon`
              INSERT INTO conversation_history (session_id, message, sender, created_at)
              VALUES (${session_id}, ${message}, 'user', NOW()),
                     (${session_id}, ${aiMessage}, 'ai', NOW())
            `;
          } catch (historyError) {
            console.log('Failed to store conversation history:', historyError.message);
          }
        }
      } catch (error) {
        console.error('Enhanced AI chat error:', error);
        const personaPrefix = persona_id === 'dating-hero' ? 'Companion: ' : 'Agent: ';
        aiMessage = personaPrefix + `You said: ${message}. I'm here to help you with that.`;
        emotions = { joy: 0.5, trust: 0.7 };
        usage_stub = true;
      }
    }

    // Generate enhanced visemes for voice synthesis
    visemes = generateVisemes(aiMessage, emotions);

    return Response.json({
      success: true,
      message: aiMessage,
      persona_id,
      user_id,
      session_id,
      emotions,
      visemes,
      usage_stub,
      context: {
        ...context,
        response_quality: usage_stub ? 'stub' : 'enhanced',
        model: usage_stub ? 'stub' : 'gpt-4o-mini',
      },
    });
  } catch (error) {
    console.error('Error in enhanced AI chat:', error);
    return Response.json({ error: 'Failed to process enhanced AI chat request' }, { status: 500 });
  }
}

// Emotion analysis based on response content
function analyzeEmotions(message, personaId) {
  const emotions = {
    joy: 0,
    trust: 0,
    fear: 0,
    surprise: 0,
    sadness: 0,
    disgust: 0,
    anger: 0,
    anticipation: 0,
  };

  const message_lower = message.toLowerCase();

  // Joy indicators
  if (
    message_lower.includes('great') ||
    message_lower.includes('wonderful') ||
    message_lower.includes('amazing') ||
    message_lower.includes('excellent') ||
    message_lower.includes('happy') ||
    message_lower.includes('love')
  ) {
    emotions.joy += 0.3;
  }

  // Trust indicators
  if (
    message_lower.includes('trust') ||
    message_lower.includes('reliable') ||
    message_lower.includes('confident') ||
    message_lower.includes('support')
  ) {
    emotions.trust += 0.3;
  }

  // Anticipation indicators
  if (
    message_lower.includes('excited') ||
    message_lower.includes('looking forward') ||
    message_lower.includes("can't wait") ||
    message_lower.includes('anticipate')
  ) {
    emotions.anticipation += 0.3;
  }

  // Persona-specific emotion adjustments
  if (personaId === 'dating-hero') {
    emotions.joy += 0.2;
    emotions.trust += 0.3;
  } else if (personaId === 'construction-smart-alec') {
    emotions.trust += 0.2;
    emotions.joy += 0.1;
  }

  // Normalize emotions to 0-1 range
  Object.keys(emotions).forEach((key) => {
    emotions[key] = Math.min(1, Math.max(0, emotions[key]));
  });

  return emotions;
}

// Enhanced viseme generation for realistic lip-sync
function generateVisemes(message, emotions) {
  const visemes = [];
  const words = message.split(' ');
  let timeOffset = 0;

  words.forEach((word, index) => {
    const wordDuration = Math.max(100, word.length * 50); // Minimum 100ms per word

    // Generate visemes for each word based on phonemes
    const phonemes = wordToPhonemes(word);

    phonemes.forEach((phoneme, phonemeIndex) => {
      const viseme = phonemeToViseme(phoneme);
      const duration = wordDuration / phonemes.length;

      visemes.push({
        at: timeOffset,
        viseme: viseme,
        weight: 1.0,
        emotion: emotions,
        phoneme: phoneme,
      });

      timeOffset += duration;
    });

    // Add pause between words
    if (index < words.length - 1) {
      timeOffset += 50;
    }
  });

  return visemes;
}

// Simple phoneme mapping (in production, use proper phonetic analysis)
function wordToPhonemes(word) {
  const phonemeMap = {
    a: ['A'],
    e: ['E'],
    i: ['I'],
    o: ['O'],
    u: ['U'],
    b: ['B'],
    p: ['P'],
    m: ['M'],
    f: ['F'],
    v: ['V'],
    t: ['T'],
    d: ['D'],
    n: ['N'],
    l: ['L'],
    r: ['R'],
    s: ['S'],
    z: ['Z'],
    sh: ['SH'],
    ch: ['CH'],
    j: ['J'],
    k: ['K'],
    g: ['G'],
    h: ['H'],
    w: ['W'],
    y: ['Y'],
  };

  const phonemes = [];
  let i = 0;

  while (i < word.length) {
    // Check for two-character phonemes first
    if (i + 1 < word.length) {
      const twoChar = word.substring(i, i + 2).toLowerCase();
      if (phonemeMap[twoChar]) {
        phonemes.push(phonemeMap[twoChar][0]);
        i += 2;
        continue;
      }
    }

    // Single character phonemes
    const char = word[i].toLowerCase();
    if (phonemeMap[char]) {
      phonemes.push(phonemeMap[char][0]);
    } else {
      phonemes.push('A'); // Default viseme
    }
    i++;
  }

  return phonemes;
}

// Map phonemes to visemes
function phonemeToViseme(phoneme) {
  const visemeMap = {
    A: 'A',
    E: 'E',
    I: 'I',
    O: 'O',
    U: 'U',
    B: 'B',
    P: 'P',
    M: 'M',
    F: 'F',
    V: 'V',
    T: 'T',
    D: 'D',
    N: 'N',
    L: 'L',
    R: 'R',
    S: 'S',
    Z: 'Z',
    SH: 'SH',
    CH: 'CH',
    J: 'J',
    K: 'K',
    G: 'G',
    H: 'H',
    W: 'W',
    Y: 'Y',
  };

  return visemeMap[phoneme] || 'A';
}



