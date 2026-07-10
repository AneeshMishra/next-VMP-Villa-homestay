-- Room inventory migration for VMP Villa
-- Run this in the Supabase SQL Editor AFTER schema-admin.sql

-- Add total_units column to room_config
ALTER TABLE room_config ADD COLUMN IF NOT EXISTS total_units INTEGER NOT NULL DEFAULT 1;

-- Seed unit counts
UPDATE room_config SET total_units = CASE
  WHEN id = 'deluxe-ac'   THEN 4
  WHEN id = 'standard-ac' THEN 2
  WHEN id = '2bhk-flat'   THEN 1
  WHEN id = '1bhk-flat'   THEN 1
  WHEN id = 'dormitory'   THEN 1
  ELSE 1
END;

-- Insert 1bhk-flat into room_config if not already there
INSERT INTO room_config (id, name, description, price_inr, max_guests, amenities, badge, badge_color, sort_order, total_units)
VALUES (
  '1bhk-flat',
  '1BHK Private Flat',
  'Self-contained 1BHK apartment with AC bedroom, private bathroom, balcony, modular kitchen and dining area.',
  2000, 3,
  ARRAY['King Bedroom', 'Attached Bathroom', 'Private Balcony', 'Full Kitchen', 'Dining Area', 'AC', 'Free WiFi', 'Daily Housekeeping'],
  'Great for Couples', '#7b4ea0',
  5, 1
)
ON CONFLICT (id) DO UPDATE SET total_units = 1;
