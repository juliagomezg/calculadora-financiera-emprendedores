/*
  # Create contacts table for business leads

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `business_model` (text)
      - `message` (text)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS
    - Add policy for inserting new contacts
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  business_model text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);