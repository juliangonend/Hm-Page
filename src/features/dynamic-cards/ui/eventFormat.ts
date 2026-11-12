/** "2027-07-05" → "5 jul 2027" (noon avoids any time-zone day shift). */
export const formatShortDate = (iso?: string): string | null => {
  if (!iso) return null
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** "2027-07-05" → "lunes, 5 de julio de 2027" */
export const formatLongDate = (iso?: string): string | null => {
  if (!iso) return null
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
