/** Resolves a file from `public/` against the deploy base (GitHub Pages sub-path). */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
