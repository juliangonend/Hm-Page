import { describe, expect, it } from 'vitest'
import { toEmbed } from './videoEmbed'

describe('toEmbed', () => {
  it.each([
    ['https://www.instagram.com/reel/C8abc_12-X/', 'https://www.instagram.com/reel/C8abc_12-X/embed/'],
    ['https://www.instagram.com/reel/C8abc_12-X/?utm_source=ig_web_copy_link', 'https://www.instagram.com/reel/C8abc_12-X/embed/'],
    ['https://instagram.com/reels/C8abc_12-X', 'https://www.instagram.com/reel/C8abc_12-X/embed/'],
    ['https://www.instagram.com/p/C8abc_12-X/', 'https://www.instagram.com/p/C8abc_12-X/embed/'],
  ])('turns the Instagram link %s into its embed url', (url, expected) => {
    expect(toEmbed(url)).toEqual({ platform: 'instagram', src: expected })
  })

  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ?si=abc', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://m.youtube.com/watch?feature=share&v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ])('turns the YouTube link %s into a privacy-enhanced embed url', (url, id) => {
    expect(toEmbed(url)).toEqual({ platform: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` })
  })

  it.each(['', 'not a url', 'https://vimeo.com/123', 'https://www.instagram.com/hockeymanagement/'])(
    'returns null for an unsupported link (%s)',
    (url) => {
      expect(toEmbed(url)).toBeNull()
    },
  )
})
