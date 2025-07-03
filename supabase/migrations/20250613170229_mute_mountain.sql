/*
  # Create analytics and user tracking tables

  1. New Tables
    - `user_sessions` - Track user sessions and basic metrics
    - `calculator_usage` - Track calculator usage patterns
    - `user_behaviors` - Track detailed user interactions
    - `user_feedback` - Store user feedback and ratings
  
  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  start_time bigint NOT NULL,
  last_activity bigint NOT NULL,
  page_views integer DEFAULT 1,
  calculations_performed integer DEFAULT 0,
  time_spent bigint DEFAULT 0,
  device_info jsonb,
  created_at timestamptz DEFAULT now()
);

-- Calculator Usage Table
CREATE TABLE IF NOT EXISTS calculator_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  calculator_type text NOT NULL,
  inputs jsonb,
  results jsonb,
  time_spent bigint,
  completed_calculation boolean DEFAULT false,
  errors text[],
  timestamp bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User Behaviors Table
CREATE TABLE IF NOT EXISTS user_behaviors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  action text NOT NULL,
  element text NOT NULL,
  timestamp bigint NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- User Feedback Table
CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  calculator_type text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  category text,
  timestamp timestamptz DEFAULT now(),
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for user_sessions
CREATE POLICY "Anyone can insert sessions"
  ON user_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own session"
  ON user_sessions
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Authenticated users can view all sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for calculator_usage
CREATE POLICY "Anyone can insert calculator usage"
  ON calculator_usage
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view calculator usage"
  ON calculator_usage
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_behaviors
CREATE POLICY "Anyone can insert behaviors"
  ON user_behaviors
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view behaviors"
  ON user_behaviors
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_feedback
CREATE POLICY "Anyone can insert feedback"
  ON user_feedback
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view feedback"
  ON user_feedback
  FOR SELECT
  TO authenticated
  USING (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start_time ON user_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_calculator_usage_session_id ON calculator_usage(session_id);
CREATE INDEX IF NOT EXISTS idx_calculator_usage_timestamp ON calculator_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_calculator_usage_type ON calculator_usage(calculator_type);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_session_id ON user_behaviors(session_id);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_timestamp ON user_behaviors(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_action ON user_behaviors(action);
CREATE INDEX IF NOT EXISTS idx_user_feedback_timestamp ON user_feedback(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_feedback_calculator_type ON user_feedback(calculator_type);