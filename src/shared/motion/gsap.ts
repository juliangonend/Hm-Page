import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

/** Registers GSAP plugins exactly once and returns the instances. */
export const getGsap = () => {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
  return { gsap, ScrollTrigger }
}

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** False in non-browser environments (SSR, jsdom without matchMedia): animations become no-ops. */
export const canAnimate = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'

export const prefersReducedMotion = (): boolean =>
  canAnimate() && window.matchMedia(REDUCED_MOTION_QUERY).matches
