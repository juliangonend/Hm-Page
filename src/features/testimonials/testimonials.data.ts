import type { Testimonial } from './domain/Testimonial'

/**
 * Video testimonials shown before "Co-Fundadores".
 * Paste the public link as copied from the app: Instagram reels for now, YouTube (videos or Shorts) later —
 * both work, no code changes needed to migrate. Later this list can come from the back office (same shape).
 */
export const TESTIMONIALS: Testimonial[] = [
  { id: 'reel-1', url: 'https://www.instagram.com/reel/DI94gMNRR-I/' },
  { id: 'reel-2', url: 'https://www.instagram.com/reel/DMtadyBM5WU/' },
  { id: 'reel-3', url: 'https://www.instagram.com/reel/DSnjNZ-jcyX/' },
]
