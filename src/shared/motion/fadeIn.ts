import type { GsapSetupContext } from './useGsap'

/** Generic once-only fade-up reveal on scroll. */
export const revealUp = (
  { gsap, reduced }: GsapSetupContext,
  targets: gsap.TweenTarget,
  trigger: gsap.DOMTarget,
  vars: gsap.TweenVars = {},
) => {
  if (reduced) return gsap.from(targets, { opacity: 0, duration: 0.2, scrollTrigger: { trigger, start: 'top 78%', once: true } })
  return gsap.from(targets, {
    y: 32,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: { trigger, start: 'top 78%', once: true },
    ...vars,
  })
}
