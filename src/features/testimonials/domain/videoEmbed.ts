export type VideoPlatform = 'instagram' | 'youtube'

export interface VideoEmbed {
  platform: VideoPlatform
  src: string
}

const INSTAGRAM = /^\/(reels?|p)\/([\w-]+)\/?$/
const YOUTUBE_ID = /^[\w-]{11}$/

const parse = (url: string): URL | null => {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

const instagramEmbed = (link: URL): VideoEmbed | null => {
  const match = INSTAGRAM.exec(link.pathname)
  if (!match) return null
  const kind = match[1] === 'p' ? 'p' : 'reel'
  return { platform: 'instagram', src: `https://www.instagram.com/${kind}/${match[2]}/embed/` }
}

const youtubeId = (link: URL): string | null => {
  if (link.hostname === 'youtu.be') return link.pathname.slice(1)
  if (link.pathname.startsWith('/shorts/')) return link.pathname.split('/')[2] ?? null
  return link.searchParams.get('v')
}

/**
 * Turns a public Instagram reel/post or YouTube (video/short) link into the url of its embeddable player.
 * Returns null for anything else, so a bad link from the back office never breaks the page.
 */
export const toEmbed = (url: string): VideoEmbed | null => {
  const link = parse(url)
  if (!link) return null
  const host = link.hostname.replace(/^(www|m)\./, '')

  if (host === 'instagram.com') return instagramEmbed(link)
  if (host === 'youtube.com' || host === 'youtu.be') {
    const id = youtubeId(link)
    return id && YOUTUBE_ID.test(id) ? { platform: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` } : null
  }
  return null
}
