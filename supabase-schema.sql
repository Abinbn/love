-- Valentine's Confession Platform - Supabase SQL Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CONFESSIONS TABLE
-- ============================================
CREATE TABLE confessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Message content
  message TEXT NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 1000),
  mood VARCHAR(20) CHECK (mood IN ('sweet', 'nervous', 'bold', 'shy')),
  song_link TEXT,
  
  -- College information
  college_name VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  year_or_batch VARCHAR(50),
  section VARCHAR(50),
  
  -- Recipient hints
  recipient_hint TEXT CHECK (char_length(recipient_hint) <= 200),
  
  -- Sender information (optional based on anonymous flag)
  is_anonymous BOOLEAN DEFAULT true,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  sender_phone VARCHAR(20),
  sender_section VARCHAR(50),
  additional_message TEXT CHECK (char_length(additional_message) <= 200),
  
  -- Unique code for finding
  unique_code VARCHAR(8) UNIQUE NOT NULL,
  
  -- Engagement metrics
  views INTEGER DEFAULT 0 CHECK (views >= 0),
  reactions JSONB DEFAULT '{"hearts": 0, "smiles": 0, "tears": 0}',
  
  -- Status and delivery
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_delivered BOOLEAN DEFAULT false,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Moderation
  flagged BOOLEAN DEFAULT false,
  admin_notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_confessions_unique_code ON confessions(unique_code);
CREATE INDEX idx_confessions_college ON confessions(college_name);
CREATE INDEX idx_confessions_department ON confessions(department);
CREATE INDEX idx_confessions_created_at ON confessions(created_at DESC);
CREATE INDEX idx_confessions_status ON confessions(status);

-- ============================================
-- CONFESSION REACTIONS TABLE
-- ============================================
CREATE TABLE confession_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  confession_id UUID REFERENCES confessions(id) ON DELETE CASCADE NOT NULL,
  reaction_type VARCHAR(50) NOT NULL CHECK (reaction_type IN ('hearts', 'smiles', 'tears')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_identifier VARCHAR(255) NOT NULL,
  
  -- Ensure one reaction per session per confession
  UNIQUE(confession_id, session_identifier, reaction_type)
);

CREATE INDEX idx_reactions_confession ON confession_reactions(confession_id);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment confession views
CREATE OR REPLACE FUNCTION increment_confession_views(confession_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE confessions
  SET views = views + 1
  WHERE id = confession_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get confession statistics
CREATE OR REPLACE FUNCTION get_confession_statistics()
RETURNS TABLE (
  total_confessions BIGINT,
  approved_confessions BIGINT,
  pending_confessions BIGINT,
  total_views BIGINT,
  total_reactions BIGINT,
  anonymous_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_confessions,
    COUNT(*) FILTER (WHERE status = 'approved')::BIGINT as approved_confessions,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending_confessions,
    COALESCE(SUM(views), 0)::BIGINT as total_views,
    (SELECT COUNT(*)::BIGINT FROM confession_reactions) as total_reactions,
    ROUND(
      (COUNT(*) FILTER (WHERE is_anonymous = true)::NUMERIC / 
      NULLIF(COUNT(*), 0)::NUMERIC * 100), 2
    ) as anonymous_percentage
  FROM confessions;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update reaction counts in confessions table
CREATE OR REPLACE FUNCTION update_confession_reactions()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE confessions
  SET reactions = jsonb_set(
    reactions,
    ARRAY[NEW.reaction_type],
    to_jsonb((reactions->>NEW.reaction_type)::int + 1)
  )
  WHERE id = NEW.confession_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reactions
AFTER INSERT ON confession_reactions
FOR EACH ROW
EXECUTE FUNCTION update_confession_reactions();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE confession_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Confessions policies
-- Allow anyone to read approved confessions
CREATE POLICY "Public confessions are viewable by everyone" ON confessions
  FOR SELECT USING (status = 'approved' OR status = 'pending');

-- Allow anyone to create confessions
CREATE POLICY "Anyone can create confessions" ON confessions
  FOR INSERT WITH CHECK (true);

-- Only admins can update/delete (you'll need to implement auth for this)
CREATE POLICY "Admins can update confessions" ON confessions
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can delete confessions" ON confessions
  FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users));

-- Reaction policies
CREATE POLICY "Anyone can view reactions" ON confession_reactions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add reactions" ON confession_reactions
  FOR INSERT WITH CHECK (true);

-- Admin policies
CREATE POLICY "Admins can read admin table" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Add your admin email here
INSERT INTO admin_users (email) VALUES ('your-admin-email@example.com');

-- Sample confession (for testing)
INSERT INTO confessions (
  message,
  mood,
  college_name,
  department,
  year_or_batch,
  unique_code,
  is_anonymous,
  status
) VALUES (
  'I''ve admired you from afar... Happy Valentine''s Day! 💝',
  'sweet',
  'Sample College',
  'Computer Science',
  '3rd Year',
  'TEST1234',
  true,
  'approved'
);
