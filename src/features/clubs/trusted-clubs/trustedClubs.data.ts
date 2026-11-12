import type { TrustedClub } from './TrustedClub'

/**
 * Clubs shown in the "Clubes que confían en nosotros" field.
 * Logos are die-cut "sticker" versions (background removed + white outline) generated from the
 * originals in /public/clubs/, so they read well on the dark section background.
 * To add a club: process its logo with scripts/make-club-stickers.py, save it in /public/clubs/stickers/ and add an entry.
 * Later this list can come from the back office (same shape).
 */
export const TRUSTED_CLUBS: TrustedClub[] = [
  { id: 'stm', name: 'STM Sports Club', logo: 'clubs/stickers/stm.webp' },
  { id: 'prince-of-wales', name: 'Prince of Wales Country Club', logo: 'clubs/stickers/prince-of-wales.webp' },
  { id: 'peumayen', name: 'Peumayen Rugby Club', logo: 'clubs/stickers/peumayen.webp' },
  { id: 'alfiles', name: 'Sporting Club Alfiles San Juan', logo: 'clubs/stickers/alfiles.webp' },
  { id: 'old-gabs', name: 'Old Gabs Hockey', logo: 'clubs/stickers/old-gabs.webp' },
  { id: 'aleman-concepcion', name: 'Deutscher Sportverein Concepción', logo: 'clubs/stickers/aleman-concepcion.webp' },
  { id: 'panteras', name: 'Panteras Hockey Antofagasta', logo: 'clubs/stickers/panteras.webp' },
  { id: 'uncuyo', name: 'UNCuyo Hockey', logo: 'clubs/stickers/uncuyo.webp' },
  { id: 'gallega', name: 'Federación Galega de Hóckey', logo: 'clubs/stickers/gallega.webp' },
]
