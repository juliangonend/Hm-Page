import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { HockeyBall } from '../../../shared/ui/HockeyBall'
import { canAnimate, onIntroDone, prefersReducedMotion } from '../../../shared/motion'
import { cx } from '../../../shared/lib/cx'
import { scrollBallPosition } from './scrollBallPosition'
import styles from './ScrollBall.module.css'

const BALL_SIZE = 40

/**
 * A hockey ball that rolls down a chalk line next to the scrollbar, following the page scroll.
 * Clicking the line jumps to that point of the page. Smaller and display-only on touch devices.
 */
export const ScrollBall = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(() => !canAnimate() || prefersReducedMotion())

  useEffect(() => (visible ? undefined : onIntroDone(() => setVisible(true))), [visible])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const track = trackRef.current
      const ball = ballRef.current
      if (!track || !ball) return
      const { progress, offset, rotation } = scrollBallPosition({
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        trackLength: track.clientHeight,
        // CSS shrinks the ball on small screens: measure it instead of trusting BALL_SIZE
        ballSize: ball.offsetWidth || BALL_SIZE,
      })
      ball.style.transform = `translate3d(0, ${offset}px, 0)`
      // The spin group already sets its transform-origin to the ball center
      const spin = ball.querySelector<SVGGElement>('[data-ball-spin]')
      if (spin) spin.style.transform = `rotate(${rotation}deg)`
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const jumpTo = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientY - rect.top) / rect.height
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: ratio * scrollable, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  return (
    <div className={cx(styles.rail, visible && styles.visible)} aria-hidden="true">
      <div ref={trackRef} className={styles.track} onPointerDown={jumpTo}>
        <div ref={fillRef} className={styles.fill} />
        <div ref={ballRef} className={styles.ball}>
          <HockeyBall size={BALL_SIZE} />
        </div>
      </div>
    </div>
  )
}
