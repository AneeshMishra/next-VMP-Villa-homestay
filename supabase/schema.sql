-- VMP Villa bookings table
-- Run this in the Supabase SQL Editor after creating your project

CREATE TABLE IF NOT EXISTS bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id             TEXT NOT NULL,
  room_name           TEXT NOT NULL,
  check_in            DATE NOT NULL,
  check_out           DATE NOT NULL,
  nights              INTEGER NOT NULL CHECK (nights > 0),
  guests              INTEGER NOT NULL CHECK (guests > 0),
  guest_name          TEXT NOT NULL,
  guest_email         TEXT NOT NULL,
  guest_phone         TEXT NOT NULL,
  special_requests    TEXT,
  amount_paise        INTEGER NOT NULL CHECK (amount_paise > 0),
  razorpay_order_id   TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature  TEXT,
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookups by status or guest email
CREATE INDEX IF NOT EXISTS bookings_status_idx      ON bookings (status);
CREATE INDEX IF NOT EXISTS bookings_check_in_idx    ON bookings (check_in);
CREATE INDEX IF NOT EXISTS bookings_guest_email_idx ON bookings (guest_email);

-- Index for availability checks (room + date overlap queries)
CREATE INDEX IF NOT EXISTS bookings_avail_idx ON bookings (room_id, check_in, check_out, status);

-- Row Level Security: all writes go through the service role key (server-side only)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow server (service role) full access — no policy needed for service role
-- Public read is NOT allowed by default (RLS blocks anon/authenticated reads)
