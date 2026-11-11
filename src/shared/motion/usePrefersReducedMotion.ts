import { useEffect, useState } from 'react'
import { REDUCED_MOTION_QUERY, canAnimate, prefersReducedMotion } from './gsap'

export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    if (!canAnimate()) return
    const query = window.matchMedia(REDUCED_MOTION_QUERY)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
