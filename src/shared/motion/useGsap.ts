import { useLayoutEffect, useRef, type RefObject } from 'react'
import { getGsap, canAnimate, prefersReducedMotion } from './gsap'

type GsapApi = ReturnType<typeof getGsap>

export interface GsapSetupContext extends GsapApi {
  /** User prefers reduced motion: show final states with a short fade only. */
  reduced: boolean
  scope: HTMLElement
}

type Setup = (context: GsapSetupContext) => void | (() => void)

/**
 * Runs GSAP code inside a `gsap.context` scoped to `scope`, reverting everything on
 * unmount (safe under StrictMode double-invocation). No-op where animation is impossible.
 */
export const useGsap = (scope: RefObject<HTMLElement>, setup: Setup, key: unknown = null): void => {
  const setupRef = useRef(setup)
  setupRef.current = setup

  useLayoutEffect(() => {
    const element = scope.current
    if (!element || !canAnimate()) return
    const api = getGsap()
    const reduced = prefersReducedMotion()
    const ctx = api.gsap.context(() => setupRef.current({ ...api, reduced, scope: element }), element)
    return () => ctx.revert()
  }, [scope, key])
}
