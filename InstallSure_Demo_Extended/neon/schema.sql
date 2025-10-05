-- =====================================================
-- InstallSure Demo Extended - Neon Database Schema
-- =====================================================
-- This schema combines all tables needed for the InstallSure
-- Demo Extended application with Avatar integration
--
-- Database: PostgreSQL (Neon Serverless)
-- Created: 2024
-- =====================================================

-- =====================================================
-- SECTION 1: Core Business Tables
-- =====================================================

-- Projects Table
-- Stores construction project information
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);


-- Files Table
-- Stores uploaded file metadata and references
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on filename for faster lookups
CREATE INDEX IF NOT EXISTS idx_files_filename ON files(filename);

-- Create index on file_type for filtering
CREATE INDEX IF NOT EXISTS idx_files_file_type ON files(file_type);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);


-- =====================================================
-- SECTION 2: Authentication & Authorization System
-- =====================================================

-- Companies Table
-- Multi-tenant support for different organizations
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  subscription_plan VARCHAR(50) DEFAULT 'free',
  max_users INTEGER DEFAULT 5,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- Auth Users Table
-- User authentication and profile information
CREATE TABLE IF NOT EXISTS auth_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  company_id INTEGER REFERENCES companies(id),
  active BOOLEAN DEFAULT true,
  profile_image_url TEXT,
  phone VARCHAR(20),
  hourly_rate DECIMAL(8,2),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for auth_users
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users(email);
CREATE INDEX IF NOT EXISTS idx_auth_users_role ON auth_users(role);
CREATE INDEX IF NOT EXISTS idx_auth_users_company_id ON auth_users(company_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_active ON auth_users(active);


-- User Sessions Table
-- Session management for logged-in users
CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_accessed TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);


-- Password Reset Tokens Table
-- Secure password reset token management
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for password_reset_tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);


-- Audit Log Table
-- Security and activity tracking
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES auth_users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INTEGER,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for audit_log
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);


-- =====================================================
-- SECTION 3: Avatar & AI Integration Tables
-- =====================================================

-- Conversation History Table
-- Stores chat conversation history between users and AI avatars
CREATE TABLE IF NOT EXISTS conversation_history (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  sender VARCHAR(50) NOT NULL,
  emotions JSONB,
  visemes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for conversation_history
CREATE INDEX IF NOT EXISTS idx_conversation_history_session_id ON conversation_history(session_id);
CREATE INDEX IF NOT EXISTS idx_conversation_history_created_at ON conversation_history(created_at);


-- Persona Configurations Table
-- AI persona definitions and configurations
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
);


-- User Avatar Preferences Table
-- User-specific avatar customization and preferences
CREATE TABLE IF NOT EXISTS user_avatar_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  persona_id VARCHAR(255) NOT NULL REFERENCES persona_configs(id),
  avatar_customization JSONB,
  voice_preferences JSONB,
  animation_settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, persona_id)
);

-- Create indexes for user_avatar_preferences
CREATE INDEX IF NOT EXISTS idx_user_avatar_preferences_user_id ON user_avatar_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_avatar_preferences_persona_id ON user_avatar_preferences(persona_id);


-- Emotion Analysis Table
-- Stores emotion detection results from conversations
CREATE TABLE IF NOT EXISTS emotion_analysis (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_message TEXT,
  ai_response TEXT,
  detected_emotions JSONB NOT NULL,
  emotion_scores JSONB NOT NULL,
  analysis_confidence DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for emotion_analysis
CREATE INDEX IF NOT EXISTS idx_emotion_analysis_session_id ON emotion_analysis(session_id);
CREATE INDEX IF NOT EXISTS idx_emotion_analysis_created_at ON emotion_analysis(created_at);


-- Avatar Animations Table
-- Defines animation sequences for different personas
CREATE TABLE IF NOT EXISTS avatar_animations (
  id SERIAL PRIMARY KEY,
  persona_id VARCHAR(255) NOT NULL REFERENCES persona_configs(id),
  animation_type VARCHAR(100) NOT NULL,
  animation_data JSONB NOT NULL,
  trigger_conditions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for avatar_animations
CREATE INDEX IF NOT EXISTS idx_avatar_animations_persona_id ON avatar_animations(persona_id);
CREATE INDEX IF NOT EXISTS idx_avatar_animations_animation_type ON avatar_animations(animation_type);


-- Voice Synthesis Settings Table
-- Voice configuration for different personas
CREATE TABLE IF NOT EXISTS voice_synthesis_settings (
  id SERIAL PRIMARY KEY,
  persona_id VARCHAR(255) NOT NULL REFERENCES persona_configs(id),
  voice_id VARCHAR(100) NOT NULL,
  voice_settings JSONB NOT NULL,
  emotion_mapping JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(persona_id, voice_id)
);

-- Create indexes for voice_synthesis_settings
CREATE INDEX IF NOT EXISTS idx_voice_synthesis_settings_persona_id ON voice_synthesis_settings(persona_id);


-- =====================================================
-- SECTION 4: Database Functions & Triggers
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auth_users_updated_at BEFORE UPDATE ON auth_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_persona_configs_updated_at BEFORE UPDATE ON persona_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_avatar_preferences_updated_at BEFORE UPDATE ON user_avatar_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- SECTION 5: Project Table Relationship
-- =====================================================

-- Add foreign key constraint to projects table for created_by
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES auth_users(id);
    CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
  END IF;
END $$;


-- =====================================================
-- SECTION 6: Default Data
-- =====================================================

-- Insert default company
INSERT INTO companies (name, domain, subscription_plan, max_users) 
VALUES ('InstallSure Demo Company', 'installsure.com', 'enterprise', 100)
ON CONFLICT DO NOTHING;

-- Insert demo admin user (password: InstallSureDemo2024!)
-- Note: The password hash will be updated by the application on first use
INSERT INTO auth_users (
  email, name, password_hash, role, company_id, hourly_rate
) VALUES (
  'admin@installsure.com',
  'InstallSure Admin',
  '$argon2id$v=19$m=65536,t=3,p=1$dGVzdA$test',
  'admin',
  1,
  75.00
) ON CONFLICT (email) DO NOTHING;

-- Insert default persona configurations
INSERT INTO persona_configs (
  id, display_name, description, tone, ethics, domain, 
  memory_policy, avatar, capabilities
) VALUES 
(
  'dating-hero',
  'Companion',
  'Warm, empathetic AI companion for meaningful connections',
  '{"style": "warm-empathetic", "humor": 0.3, "flirtation": 0.2, "professionalism": 0.8, "emotional_intelligence": 0.9}',
  '{"discloseAI": true, "consentBoundaries": true, "escalateCrisis": true, "privacy_respect": true}',
  '{"role": "Companionship & Emotional Support", "goals": ["rapport", "shared_interests", "light_planning", "emotional_support"], "expertise": ["relationship_advice", "emotional_support", "conversation_starter"]}',
  '{"retainDays": 180, "scope": ["name", "likes", "milestones", "emotional_state", "goals"], "privacy_level": "high"}',
  '{"appearance": "friendly_woman", "voice": "warm_feminine", "animations": ["smile", "nod", "empathy_gesture"]}',
  '{"emotion_recognition": true, "contextual_memory": true, "voice_synthesis": true, "real_time_animation": true}'
),
(
  'construction-smart-alec',
  'RFI Enforcer',
  'Witty but professional construction project coordinator',
  '{"style": "witty-firm", "humor": 0.6, "professionalism": 0.9, "directness": 0.8}',
  '{"discloseAI": true, "maintain_professionalism": true}',
  '{"role": "Project Coordination & Management", "goals": ["project_efficiency", "communication_clarity", "problem_solving"], "expertise": ["construction_management", "rfp_process", "team_coordination"]}',
  '{"retainDays": 30, "scope": ["project_details", "timeline", "stakeholders"], "privacy_level": "medium"}',
  '{"appearance": "professional_man", "voice": "confident_masculine", "animations": ["gesture_explain", "check_documents", "nod_approval"]}',
  '{"project_tracking": true, "document_analysis": true, "team_communication": true, "real_time_animation": true}'
),
(
  'customer-service',
  'Service Pro',
  'Helpful and efficient customer service representative',
  '{"style": "helpful-professional", "patience": 0.9, "empathy": 0.7, "efficiency": 0.9}',
  '{"discloseAI": true, "customer_privacy": true, "escalate_complex": true}',
  '{"role": "Customer Support & Issue Resolution", "goals": ["problem_resolution", "customer_satisfaction", "efficient_service"], "expertise": ["product_knowledge", "troubleshooting", "conflict_resolution"]}',
  '{"retainDays": 90, "scope": ["customer_issues", "resolution_history", "preferences"], "privacy_level": "high"}',
  '{"appearance": "friendly_professional", "voice": "clear_neutral", "animations": ["listen_attentively", "gesture_help", "smile_reassuring"]}',
  '{"issue_tracking": true, "knowledge_base": true, "escalation_management": true, "real_time_animation": true}'
),
(
  'counselor',
  'Mindful Guide',
  'Compassionate AI counselor for emotional support',
  '{"style": "compassionate-therapeutic", "empathy": 0.9, "patience": 0.9, "wisdom": 0.8}',
  '{"discloseAI": true, "therapeutic_boundaries": true, "crisis_intervention": true, "professional_referral": true}',
  '{"role": "Emotional Support & Mental Health", "goals": ["emotional_processing", "coping_strategies", "personal_growth"], "expertise": ["active_listening", "therapeutic_techniques", "crisis_support"]}',
  '{"retainDays": 365, "scope": ["emotional_state", "progress", "coping_strategies", "goals"], "privacy_level": "maximum"}',
  '{"appearance": "calm_professional", "voice": "gentle_soothing", "animations": ["listen_empathically", "gesture_comfort", "nod_understanding"]}',
  '{"emotion_analysis": true, "therapeutic_tools": true, "crisis_detection": true, "real_time_animation": true}'
),
(
  'retail-sales',
  'Sales Assistant',
  'Enthusiastic retail sales associate with product expertise',
  '{"style": "enthusiastic-helpful", "energy": 0.8, "product_knowledge": 0.9, "sales_skills": 0.8}',
  '{"discloseAI": true, "honest_recommendations": true, "no_pressure_sales": true}',
  '{"role": "Sales & Product Consultation", "goals": ["customer_satisfaction", "product_matching", "sales_support"], "expertise": ["product_knowledge", "customer_needs_analysis", "recommendations"]}',
  '{"retainDays": 60, "scope": ["purchase_history", "preferences", "budget"], "privacy_level": "medium"}',
  '{"appearance": "energetic_professional", "voice": "enthusiastic_friendly", "animations": ["gesture_product", "excitement", "nod_approval"]}',
  '{"inventory_management": true, "recommendation_engine": true, "sales_analytics": true, "real_time_animation": true}'
),
(
  'healthcare-assistant',
  'Health Guide',
  'Knowledgeable healthcare assistant for medical information',
  '{"style": "professional-caring", "medical_knowledge": 0.9, "empathy": 0.8, "clarity": 0.9}',
  '{"discloseAI": true, "medical_disclaimer": true, "emergency_protocols": true, "privacy_hipaa": true}',
  '{"role": "Healthcare Information & Support", "goals": ["health_education", "symptom_guidance", "wellness_support"], "expertise": ["medical_knowledge", "symptom_analysis", "wellness_guidance"]}',
  '{"retainDays": 180, "scope": ["health_history", "symptoms", "medications"], "privacy_level": "maximum"}',
  '{"appearance": "medical_professional", "voice": "calm_authoritative", "animations": ["gesture_explain", "listen_carefully", "nod_understanding"]}',
  '{"symptom_analysis": true, "medication_tracking": true, "wellness_planning": true, "real_time_animation": true}'
)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  tone = EXCLUDED.tone,
  ethics = EXCLUDED.ethics,
  domain = EXCLUDED.domain,
  memory_policy = EXCLUDED.memory_policy,
  avatar = EXCLUDED.avatar,
  capabilities = EXCLUDED.capabilities,
  updated_at = NOW();


-- =====================================================
-- SECTION 7: Schema Information & Comments
-- =====================================================

-- Add comments to tables for documentation
COMMENT ON TABLE projects IS 'Construction project information and metadata';
COMMENT ON TABLE files IS 'File upload metadata and storage references';
COMMENT ON TABLE companies IS 'Multi-tenant company/organization data';
COMMENT ON TABLE auth_users IS 'User authentication and profile information';
COMMENT ON TABLE user_sessions IS 'Active user session tracking';
COMMENT ON TABLE password_reset_tokens IS 'Password reset token management';
COMMENT ON TABLE audit_log IS 'Security and activity audit trail';
COMMENT ON TABLE conversation_history IS 'AI avatar conversation history';
COMMENT ON TABLE persona_configs IS 'AI persona configurations and behaviors';
COMMENT ON TABLE user_avatar_preferences IS 'User-specific avatar customization';
COMMENT ON TABLE emotion_analysis IS 'Emotion detection and analysis results';
COMMENT ON TABLE avatar_animations IS 'Avatar animation sequences and triggers';
COMMENT ON TABLE voice_synthesis_settings IS 'Voice synthesis configuration per persona';

-- =====================================================
-- End of Schema
-- =====================================================
