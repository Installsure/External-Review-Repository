# InstallSure Demo Extended - Neon Database Schema

This directory contains the consolidated database schema for the InstallSure Demo Extended application with Avatar integration.

## Files

- **schema.sql** - Complete PostgreSQL database schema for Neon Serverless

## Database Structure

The schema includes the following major components:

### Core Business Tables
- `projects` - Construction project information
- `files` - File upload metadata and storage references

### Authentication & Authorization
- `companies` - Multi-tenant organization support
- `auth_users` - User authentication and profiles
- `user_sessions` - Session management
- `password_reset_tokens` - Password reset token management
- `audit_log` - Security and activity tracking

### Avatar & AI Integration
- `conversation_history` - AI avatar conversation logs
- `persona_configs` - AI persona definitions
- `user_avatar_preferences` - User-specific customizations
- `emotion_analysis` - Emotion detection results
- `avatar_animations` - Animation sequences
- `voice_synthesis_settings` - Voice configuration

## Usage

### With Neon Database

```bash
# Connect to your Neon database
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Execute the schema
\i schema.sql
```

### With Local PostgreSQL

```bash
# Create a local database
createdb installsure_demo

# Apply the schema
psql installsure_demo < schema.sql
```

## Features

- ✅ Comprehensive indexing for performance
- ✅ Foreign key constraints for data integrity
- ✅ Automatic timestamp updates via triggers
- ✅ Default data for quick setup
- ✅ JSONB columns for flexible data storage
- ✅ Security audit logging
- ✅ Multi-tenant support

## Default Data

The schema includes:
- Demo company: "InstallSure Demo Company"
- Admin user: admin@installsure.com (password needs to be set on first use)
- 6 pre-configured AI personas (Companion, RFI Enforcer, Service Pro, Mindful Guide, Sales Assistant, Health Guide)

## Notes

- Compatible with PostgreSQL 12+
- Optimized for Neon Serverless Database
- Uses JSONB for flexible schema evolution
- All tables use `IF NOT EXISTS` for safe re-runs
- Triggers automatically maintain `updated_at` timestamps
