-- Run ONCE on databases created before end_date existed (Hostinger: phpMyAdmin → SQL).
-- Existing events keep being one-day events (no end date).
ALTER TABLE events
  ADD COLUMN end_date DATE NULL AFTER event_date;
