-- InstallSure Database Schema for Neon PostgreSQL
-- Last Updated: 2025-09-29
-- Description: Complete database schema for InstallSure BIM quantity takeoff and cost estimation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    project_number VARCHAR(50) UNIQUE,
    description TEXT,
    location VARCHAR(255),
    client_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'completed', 'archived')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

-- BIM Models table
CREATE TABLE IF NOT EXISTS bim_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    model_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(20) CHECK (file_type IN ('IFC', 'RVT', 'DWG', 'PDF', 'NWD')),
    file_size_bytes BIGINT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(50),
    discipline VARCHAR(50),
    status VARCHAR(50) DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'ready', 'error')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quantity Takeoffs table
CREATE TABLE IF NOT EXISTS quantity_takeoffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    bim_model_id UUID REFERENCES bim_models(id) ON DELETE SET NULL,
    tag VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    quantity DECIMAL(15, 4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    material VARCHAR(100),
    notes TEXT,
    element_id VARCHAR(100),
    properties JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, tag)
);

-- Cost Database table
CREATE TABLE IF NOT EXISTS cost_database (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_type VARCHAR(100) NOT NULL,
    material VARCHAR(100) NOT NULL,
    material_cost_per_unit DECIMAL(10, 2) NOT NULL,
    labor_cost_per_unit DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    effective_date DATE DEFAULT CURRENT_DATE,
    region VARCHAR(100),
    supplier VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_type, material, region, effective_date)
);

-- Cost Estimates table
CREATE TABLE IF NOT EXISTS cost_estimates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    takeoff_id UUID NOT NULL REFERENCES quantity_takeoffs(id) ON DELETE CASCADE,
    cost_database_id UUID REFERENCES cost_database(id) ON DELETE SET NULL,
    material_cost_per_unit DECIMAL(10, 2) NOT NULL,
    labor_cost_per_unit DECIMAL(10, 2) NOT NULL,
    total_material_cost DECIMAL(15, 2) NOT NULL,
    total_labor_cost DECIMAL(15, 2) NOT NULL,
    total_cost DECIMAL(15, 2) NOT NULL,
    markup_percent DECIMAL(5, 2) DEFAULT 0,
    markup_amount DECIMAL(15, 2) DEFAULT 0,
    final_cost DECIMAL(15, 2) NOT NULL,
    estimate_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'estimator', 'viewer', 'user')),
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Members table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'manager', 'estimator', 'member', 'viewer')),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- Audit Log table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bim_models_project_id ON bim_models(project_id);
CREATE INDEX IF NOT EXISTS idx_bim_models_status ON bim_models(status);
CREATE INDEX IF NOT EXISTS idx_quantity_takeoffs_project_id ON quantity_takeoffs(project_id);
CREATE INDEX IF NOT EXISTS idx_quantity_takeoffs_category ON quantity_takeoffs(category);
CREATE INDEX IF NOT EXISTS idx_cost_estimates_project_id ON cost_estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_cost_estimates_takeoff_id ON cost_estimates(takeoff_id);
CREATE INDEX IF NOT EXISTS idx_cost_database_type_material ON cost_database(item_type, material);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bim_models_updated_at BEFORE UPDATE ON bim_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quantity_takeoffs_updated_at BEFORE UPDATE ON quantity_takeoffs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_database_updated_at BEFORE UPDATE ON cost_database
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_estimates_updated_at BEFORE UPDATE ON cost_estimates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample cost database entries
INSERT INTO cost_database (item_type, material, material_cost_per_unit, labor_cost_per_unit, unit, region)
VALUES
    ('Pipe', 'Copper', 8.50, 12.00, 'LF', 'US-National'),
    ('Pipe', 'PVC', 2.25, 6.50, 'LF', 'US-National'),
    ('Pipe', 'Steel', 6.75, 10.50, 'LF', 'US-National'),
    ('Cable', 'Electrical', 1.25, 3.50, 'LF', 'US-National'),
    ('Framing', 'Wood', 3.50, 8.00, 'LF', 'US-National'),
    ('Framing', 'Steel', 5.25, 12.50, 'LF', 'US-National'),
    ('Wall', 'Drywall', 1.85, 3.25, 'SF', 'US-National'),
    ('Floor', 'Concrete', 4.50, 6.50, 'SF', 'US-National'),
    ('Ceiling', 'Drywall', 2.00, 3.50, 'SF', 'US-National'),
    ('Concrete', 'Concrete', 125.00, 45.00, 'CY', 'US-National'),
    ('Excavation', 'Earth', 15.00, 35.00, 'CY', 'US-National'),
    ('Fixture', 'Plumbing', 285.00, 125.00, 'EA', 'US-National'),
    ('Door', 'Hardware', 450.00, 180.00, 'EA', 'US-National'),
    ('Window', 'Glass', 425.00, 175.00, 'EA', 'US-National')
ON CONFLICT (item_type, material, region, effective_date) DO NOTHING;

-- Create a view for project summary
CREATE OR REPLACE VIEW project_summary AS
SELECT
    p.id,
    p.project_name,
    p.project_number,
    p.status,
    p.budget,
    COUNT(DISTINCT qt.id) as total_takeoffs,
    COUNT(DISTINCT bm.id) as total_models,
    SUM(ce.final_cost) as estimated_total_cost,
    p.created_at,
    p.updated_at
FROM projects p
LEFT JOIN quantity_takeoffs qt ON p.id = qt.project_id
LEFT JOIN bim_models bm ON p.id = bm.project_id
LEFT JOIN cost_estimates ce ON p.id = ce.project_id
GROUP BY p.id, p.project_name, p.project_number, p.status, p.budget, p.created_at, p.updated_at;

-- Create a view for detailed cost estimates
CREATE OR REPLACE VIEW detailed_estimates AS
SELECT
    p.project_name,
    p.project_number,
    qt.tag,
    qt.category,
    qt.type,
    qt.quantity,
    qt.unit,
    qt.material,
    ce.material_cost_per_unit,
    ce.labor_cost_per_unit,
    ce.total_material_cost,
    ce.total_labor_cost,
    ce.total_cost,
    ce.markup_percent,
    ce.final_cost,
    ce.estimate_date
FROM cost_estimates ce
JOIN quantity_takeoffs qt ON ce.takeoff_id = qt.id
JOIN projects p ON ce.project_id = p.id;

-- Grant permissions (adjust based on your user setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO installsure_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO installsure_app;

-- Comments for documentation
COMMENT ON TABLE projects IS 'Main projects table storing project information';
COMMENT ON TABLE bim_models IS 'BIM model files associated with projects';
COMMENT ON TABLE quantity_takeoffs IS 'Quantity takeoff data extracted from BIM models';
COMMENT ON TABLE cost_database IS 'Unit costs for materials and labor';
COMMENT ON TABLE cost_estimates IS 'Calculated cost estimates based on takeoffs';
COMMENT ON TABLE users IS 'Application users and authentication';
COMMENT ON TABLE project_members IS 'Project team members and their roles';
COMMENT ON TABLE audit_log IS 'Audit trail for all system changes';

-- Sample data for testing (optional - comment out for production)
-- INSERT INTO users (username, email, full_name, role, password_hash)
-- VALUES ('admin', 'admin@installsure.com', 'System Administrator', 'admin', 'CHANGE_ME');
