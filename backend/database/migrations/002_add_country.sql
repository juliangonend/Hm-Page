-- Run ONCE on databases created before country existed (Hostinger: phpMyAdmin → SQL).
-- Existing events default to Argentina; change them from the back office.
ALTER TABLE events
  ADD COLUMN country CHAR(2) NOT NULL DEFAULT 'AR' AFTER venue;
