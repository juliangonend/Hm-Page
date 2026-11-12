import { useRef, useState } from 'react'
import { SectionTitle } from '../../shared/ui/SectionTitle'
import { revealUp, useGsap } from '../../shared/motion'
import type { Testimonial } from './domain/Testimonial'
import { toEmbed, type VideoEmbed } from './domain/videoEmbed'
import styles from './Testimonials.module.css'

interface TestimonialsProps {
  items: Testimonial[]
}

type Playable = Testimonial & { embed: VideoEmbed }

const playable = (items: Testimonial[]): Playable[] =>
  items.flatMap((item) => {
    const embed = toEmbed(item.url)
    return embed ? [{ ...item, embed }] : []
  })

const titleFor = (item: Testimonial, index: number) => {
  if (!item.author) return `Testimonio en video ${index + 1}`
  return item.club ? `Testimonio de ${item.author} (${item.club})` : `Testimonio de ${item.author}`
}

/** Presentational: video testimonials (Instagram reels or YouTube), one large video at a time. */
export const Testimonials = ({ items }: TestimonialsProps) => {
  const ref = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const videos = playable(items)

  useGsap(ref, (ctx) => {
    const { scope } = ctx
    revealUp(ctx, scope.querySelectorAll('[data-reveal]'), scope)
  })

  if (videos.length === 0) return null

  const goTo = (index: number) => {
    const target = Math.max(0, Math.min(videos.length - 1, index))
    setActive(target)
    const track = trackRef.current
    track?.scrollTo?.({ left: target * track.clientWidth, behavior: 'smooth' })
  }

  // Keep the dots in sync when the user swipes the track instead of using the arrows
  const syncFromScroll = () => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    setActive(Math.round(track.scrollLeft / track.clientWidth))
  }

  const single = videos.length === 1

  return (
    <section ref={ref} id="testimonios" className={`section ${styles.section}`} aria-labelledby="testimonials-title">
      <div className="container">
        <header className={styles.header}>
          <span className="eyebrow" data-reveal>
            LO QUE DICEN LOS CLUBES
          </span>
          <SectionTitle id="testimonials-title" text="Testimonios" />
        </header>

        <div className={styles.slider} data-reveal>
          {single ? null : (
            <button
              type="button"
              className={`${styles.arrow} ${styles.prev}`}
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Testimonio anterior"
            >
              <span aria-hidden="true">‹</span>
            </button>
          )}

          <ul ref={trackRef} className={styles.track} onScroll={syncFromScroll}>
            {videos.map((item, index) => (
              <li key={item.id} className={styles.slide} aria-hidden={index !== active || undefined}>
                <div className={`${styles.frame} ${styles[item.embed.platform]}`}>
                  <iframe
                    src={item.embed.src}
                    title={titleFor(item, index)}
                    className={styles.video}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                {item.author ? (
                  <p className={styles.caption}>
                    <span className={styles.author}>{item.author}</span>
                    {item.club ? <span className={styles.club}>{item.club}</span> : null}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          {single ? null : (
            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              onClick={() => goTo(active + 1)}
              disabled={active === videos.length - 1}
              aria-label="Testimonio siguiente"
            >
              <span aria-hidden="true">›</span>
            </button>
          )}
        </div>

        {single ? null : (
          <div className={styles.dots}>
            {videos.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={styles.dot}
                onClick={() => goTo(index)}
                aria-label={`Ver testimonio ${index + 1}`}
                aria-current={index === active || undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
