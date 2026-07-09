-- Admin extension schema for VMP Villa
-- Run this in the Supabase SQL Editor AFTER schema.sql

-- User profiles with roles
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'staff'
                CHECK (role IN ('super_admin', 'admin', 'maintainer', 'staff')),
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public          -- required: prevents "Database error creating new user"
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(COALESCE(NEW.email, 'user'), '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Room configuration (overrides constants.ts at runtime)
CREATE TABLE IF NOT EXISTS room_config (
  id            TEXT PRIMARY KEY,  -- matches ROOMS[].id: deluxe-ac, standard-ac, dormitory
  name          TEXT NOT NULL,
  description   TEXT NOT NULL,
  price_inr     INTEGER NOT NULL CHECK (price_inr > 0),
  max_guests    INTEGER NOT NULL DEFAULT 2,
  amenities     TEXT[] NOT NULL DEFAULT '{}',
  badge         TEXT,
  badge_color   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial room data
INSERT INTO room_config (id, name, description, price_inr, max_guests, amenities, badge, badge_color, sort_order)
VALUES
  ('deluxe-ac', 'Deluxe AC Room', 'Spacious room with queen bed, en-suite bathroom, and warm décor. Ideal for couples.', 1500, 3, ARRAY['AC', 'En-Suite Bath', 'Free WiFi', 'Garden View', 'Safe & Locker'], 'Most Popular', '#e8762b', 1),
  ('standard-ac', 'Standard AC Room', 'Comfortable double room with attached bathroom. Great value for budget-conscious travellers.', 1200, 2, ARRAY['AC', 'Shared Bath', 'Free WiFi', 'TV', 'Daily Housekeeping'], 'Great Value', '#3a6b4a', 2),
  ('dormitory', 'Dormitory Bed', 'Six-bed mixed dormitory with individual lockers. Perfect for solo backpackers.', 500, 1, ARRAY['Bunk Bed', 'Personal Locker', 'Free WiFi', 'Shared Bath'], NULL, NULL, 3),
  ('2bhk-flat', '2BHK Private Flat', 'Fully self-contained 2BHK apartment with two bedrooms, kitchen, dining area, and private balconies. Ideal for families.', 3000, 6, ARRAY['2 Bedrooms', 'Full Kitchen', '2 Attached Baths', '2 Private Balconies', 'Dining Area', 'AC in Both Rooms', 'Free WiFi', 'Daily Housekeeping'], 'Best for Families', '#2b7bb9', 4)
ON CONFLICT (id) DO NOTHING;

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  excerpt     TEXT NOT NULL,
  content     TEXT NOT NULL,
  cover_image TEXT,
  author_id   UUID REFERENCES profiles(id),
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_status_idx ON blog_posts (status, published_at DESC);

-- Site settings (key-value store)
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  label       TEXT NOT NULL,
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default settings
INSERT INTO site_settings (key, value, label, description) VALUES
  ('whatsapp_number', '919876543210', 'WhatsApp Number', 'Country code + number, no +. E.g. 919876543210'),
  ('host_email', 'hello@vmpvilla.in', 'Host Email', 'Booking notifications go here'),
  ('checkin_time', '12:00', 'Check-in Time', 'Standard check-in time (24h)'),
  ('checkout_time', '11:00', 'Check-out Time', 'Standard check-out time (24h)'),
  ('free_cancellation_hours', '48', 'Free Cancellation Window (hrs)', 'Hours before check-in for free cancellation'),
  ('property_name', 'VMP Villa Home Stay', 'Property Name', 'Shown in emails and booking confirmations'),
  ('property_address', 'Tajganj, Agra, UP 282001', 'Property Address', 'Full postal address')
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
-- Service role key bypasses RLS — all admin API routes use service role
