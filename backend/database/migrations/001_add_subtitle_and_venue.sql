-- Run ONCE on databases created before subtitle/venue existed (Hostinger: phpMyAdmin → SQL).
-- Existing events keep their data; the new fields start empty.
ALTER TABLE events
  ADD COLUMN subtitle VARCHAR(200) NULL AFTER title,
  ADD COLUMN venue    VARCHAR(150) NULL AFTER subtitle;
