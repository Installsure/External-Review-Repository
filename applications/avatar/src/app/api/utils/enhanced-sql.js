import { createClient } from '@neondatabase/serverless';

const neon = createClient({
  connectionString: process.env.DATABASE_URL,
});

// Enhanced database schema for Avatar system
export const createEnhancedTables = async () => {
  try {
    // Conversation history table
    await neon`
      CREATE TABLE IF NOT EXISTS conversation_history (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        sender VARCHAR(50) NOT NULL,
        emotions JSONB,
        visemes JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Enhanced persona configurations
    await neon`
      CREATE TABLE IF NOT EXISTS persona_configs (
        id VARCHAR(255) PRIMARY KEY,
        display_name VARCHAR(255) NOT NULL,
        description TEXT,
        tone JSONB NOT NULL,
        ethics JSONB NOT NULL,
        domain JSONB NOT NULL,
        memory_policy JSONB NOT NULL,
        avatar JSONB,
        capabilities JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // User preferences for avatars
    await neon`
      CREATE TABLE IF NOT EXISTS user_avatar_preferences (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        persona_id VARCHAR(255) NOT NULL,
        avatar_customization JSONB,
        voice_preferences JSONB,
        animation_settings JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, persona_id)
      )
    `;

    // Emotion analysis results
    await neon`
      CREATE TABLE IF NOT EXISTS emotion_analysis (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        user_message TEXT,
        ai_response TEXT,
        detected_emotions JSONB NOT NULL,
        emotion_scores JSONB NOT NULL,
        analysis_confidence DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Avatar animation sequences
    await neon`
      CREATE TABLE IF NOT EXISTS avatar_animations (
        id SERIAL PRIMARY KEY,
        persona_id VARCHAR(255) NOT NULL,
        animation_type VARCHAR(100) NOT NULL,
        animation_data JSONB NOT NULL,
        trigger_conditions JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Voice synthesis settings
    await neon`
      CREATE TABLE IF NOT EXISTS voice_synthesis_settings (
        id SERIAL PRIMARY KEY,
        persona_id VARCHAR(255) NOT NULL,
        voice_id VARCHAR(100) NOT NULL,
        voice_settings JSONB NOT NULL,
        emotion_mapping JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(persona_id, voice_id)
      )
    `;

    console.log('Enhanced database tables created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating enhanced database tables:', error);
    return { success: false, error: error.message };
  }
};

// Insert default persona configurations
export const insertDefaultPersonas = async () => {
  const defaultPersonas = [
    {
      id: 'dating-hero',
      display_name: 'Companion',
      description: 'Warm, empathetic AI companion for meaningful connections',
      tone: {
        style: 'warm-empathetic',
        humor: 0.3,
        flirtation: 0.2,
        professionalism: 0.8,
        emotional_intelligence: 0.9,
      },
      ethics: {
        discloseAI: true,
        consentBoundaries: true,
        escalateCrisis: true,
        privacy_respect: true,
      },
      domain: {
        role: 'Companionship & Emotional Support',
        goals: ['rapport', 'shared_interests', 'light_planning', 'emotional_support'],
        expertise: ['relationship_advice', 'emotional_support', 'conversation_starter'],
      },
      memory_policy: {
        retainDays: 180,
        scope: ['name', 'likes', 'milestones', 'emotional_state', 'goals'],
        privacy_level: 'high',
      },
      avatar: {
        appearance: 'friendly_woman',
        voice: 'warm_feminine',
        animations: ['smile', 'nod', 'empathy_gesture'],
      },
      capabilities: {
        emotion_recognition: true,
        contextual_memory: true,
        voice_synthesis: true,
        real_time_animation: true,
      },
    },
    {
      id: 'construction-smart-alec',
      display_name: 'RFI Enforcer',
      description: 'Witty but professional construction project coordinator',
      tone: {
        style: 'witty-firm',
        humor: 0.6,
        professionalism: 0.9,
        directness: 0.8,
      },
      ethics: {
        discloseAI: true,
        maintain_professionalism: true,
      },
      domain: {
        role: 'Project Coordination & Management',
        goals: ['project_efficiency', 'communication_clarity', 'problem_solving'],
        expertise: ['construction_management', 'rfp_process', 'team_coordination'],
      },
      memory_policy: {
        retainDays: 30,
        scope: ['project_details', 'timeline', 'stakeholders'],
        privacy_level: 'medium',
      },
      avatar: {
        appearance: 'professional_man',
        voice: 'confident_masculine',
        animations: ['gesture_explain', 'check_documents', 'nod_approval'],
      },
      capabilities: {
        project_tracking: true,
        document_analysis: true,
        team_communication: true,
        real_time_animation: true,
      },
    },
    {
      id: 'customer-service',
      display_name: 'Service Pro',
      description: 'Helpful and efficient customer service representative',
      tone: {
        style: 'helpful-professional',
        patience: 0.9,
        empathy: 0.7,
        efficiency: 0.9,
      },
      ethics: {
        discloseAI: true,
        customer_privacy: true,
        escalate_complex: true,
      },
      domain: {
        role: 'Customer Support & Issue Resolution',
        goals: ['problem_resolution', 'customer_satisfaction', 'efficient_service'],
        expertise: ['product_knowledge', 'troubleshooting', 'conflict_resolution'],
      },
      memory_policy: {
        retainDays: 90,
        scope: ['customer_issues', 'resolution_history', 'preferences'],
        privacy_level: 'high',
      },
      avatar: {
        appearance: 'friendly_professional',
        voice: 'clear_neutral',
        animations: ['listen_attentively', 'gesture_help', 'smile_reassuring'],
      },
      capabilities: {
        issue_tracking: true,
        knowledge_base: true,
        escalation_management: true,
        real_time_animation: true,
      },
    },
    {
      id: 'counselor',
      display_name: 'Mindful Guide',
      description: 'Compassionate AI counselor for emotional support',
      tone: {
        style: 'compassionate-therapeutic',
        empathy: 0.9,
        patience: 0.9,
        wisdom: 0.8,
      },
      ethics: {
        discloseAI: true,
        therapeutic_boundaries: true,
        crisis_intervention: true,
        professional_referral: true,
      },
      domain: {
        role: 'Emotional Support & Mental Health',
        goals: ['emotional_processing', 'coping_strategies', 'personal_growth'],
        expertise: ['active_listening', 'therapeutic_techniques', 'crisis_support'],
      },
      memory_policy: {
        retainDays: 365,
        scope: ['emotional_state', 'progress', 'coping_strategies', 'goals'],
        privacy_level: 'maximum',
      },
      avatar: {
        appearance: 'calm_professional',
        voice: 'gentle_soothing',
        animations: ['listen_empathically', 'gesture_comfort', 'nod_understanding'],
      },
      capabilities: {
        emotion_analysis: true,
        therapeutic_tools: true,
        crisis_detection: true,
        real_time_animation: true,
      },
    },
    {
      id: 'retail-sales',
      display_name: 'Sales Assistant',
      description: 'Enthusiastic retail sales associate with product expertise',
      tone: {
        style: 'enthusiastic-helpful',
        energy: 0.8,
        product_knowledge: 0.9,
        sales_skills: 0.8,
      },
      ethics: {
        discloseAI: true,
        honest_recommendations: true,
        no_pressure_sales: true,
      },
      domain: {
        role: 'Sales & Product Consultation',
        goals: ['customer_satisfaction', 'product_matching', 'sales_support'],
        expertise: ['product_knowledge', 'customer_needs_analysis', 'recommendations'],
      },
      memory_policy: {
        retainDays: 60,
        scope: ['purchase_history', 'preferences', 'budget'],
        privacy_level: 'medium',
      },
      avatar: {
        appearance: 'energetic_professional',
        voice: 'enthusiastic_friendly',
        animations: ['gesture_product', 'excitement', 'nod_approval'],
      },
      capabilities: {
        inventory_management: true,
        recommendation_engine: true,
        sales_analytics: true,
        real_time_animation: true,
      },
    },
    {
      id: 'healthcare-assistant',
      display_name: 'Health Guide',
      description: 'Knowledgeable healthcare assistant for medical information',
      tone: {
        style: 'professional-caring',
        medical_knowledge: 0.9,
        empathy: 0.8,
        clarity: 0.9,
      },
      ethics: {
        discloseAI: true,
        medical_disclaimer: true,
        emergency_protocols: true,
        privacy_hipaa: true,
      },
      domain: {
        role: 'Healthcare Information & Support',
        goals: ['health_education', 'symptom_guidance', 'wellness_support'],
        expertise: ['medical_knowledge', 'symptom_analysis', 'wellness_guidance'],
      },
      memory_policy: {
        retainDays: 180,
        scope: ['health_history', 'symptoms', 'medications'],
        privacy_level: 'maximum',
      },
      avatar: {
        appearance: 'medical_professional',
        voice: 'calm_authoritative',
        animations: ['gesture_explain', 'listen_carefully', 'nod_understanding'],
      },
      capabilities: {
        symptom_analysis: true,
        medication_tracking: true,
        wellness_planning: true,
        real_time_animation: true,
      },
    },
  ];

  try {
    for (const persona of defaultPersonas) {
      await neon`
        INSERT INTO persona_configs (
          id, display_name, description, tone, ethics, domain, 
          memory_policy, avatar, capabilities
        ) VALUES (
          ${persona.id}, ${persona.display_name}, ${persona.description},
          ${JSON.stringify(persona.tone)}, ${JSON.stringify(persona.ethics)},
          ${JSON.stringify(persona.domain)}, ${JSON.stringify(persona.memory_policy)},
          ${JSON.stringify(persona.avatar)}, ${JSON.stringify(persona.capabilities)}
        ) ON CONFLICT (id) DO UPDATE SET
          display_name = EXCLUDED.display_name,
          description = EXCLUDED.description,
          tone = EXCLUDED.tone,
          ethics = EXCLUDED.ethics,
          domain = EXCLUDED.domain,
          memory_policy = EXCLUDED.memory_policy,
          avatar = EXCLUDED.avatar,
          capabilities = EXCLUDED.capabilities,
          updated_at = NOW()
      `;
    }

    console.log('Default personas inserted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error inserting default personas:', error);
    return { success: false, error: error.message };
  }
};

// Initialize enhanced database
export const initializeEnhancedDatabase = async () => {
  try {
    const tablesResult = await createEnhancedTables();
    if (!tablesResult.success) {
      throw new Error(`Failed to create tables: ${tablesResult.error}`);
    }

    const personasResult = await insertDefaultPersonas();
    if (!personasResult.success) {
      throw new Error(`Failed to insert personas: ${personasResult.error}`);
    }

    return { success: true, message: 'Enhanced database initialized successfully' };
  } catch (error) {
    console.error('Error initializing enhanced database:', error);
    return { success: false, error: error.message };
  }
};

export default neon;



