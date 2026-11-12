/**
 * Base URL of the back office API (PHP on Hostinger: same domain, /api).
 * Empty when the build has no API (e.g. GitHub Pages): features that need it stay hidden.
 */
export const API_BASE: string = import.meta.env.VITE_API_URL ?? ''

export const hasApi = (): boolean => API_BASE !== ''
