import type { RefObject } from 'react'
import { useGsap } from './useGsap'

/** Reveals `[data-word]` children: yPercent 108 → 0, expo.out, once at 'top 78%'. */
export const useWordReveal = (ref: RefObject<HTMLElement>) => {
  useGsap(ref, ({ gsap, reduced, scope }) => {
    const words = scope.querySelectorAll('[data-word]')
    if (words.length === 0) return
    const scrollTrigger = { trigger: scope, start: 'top 78%', once: true }
    if (reduced) {
      gsap.from(scope, { opacity: 0, duration: 0.2, scrollTrigger })
      return
    }
    gsap.from(words, { yPercent: 108, duration: 1.05, ease: 'expo.out', stagger: 0.06, scrollTrigger })
  })
}
