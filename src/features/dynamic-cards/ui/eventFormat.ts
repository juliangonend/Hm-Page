/** "2027-07-05" → that day at noon (noon avoids any time-zone day shift), or null. */
const toDay = (iso?: string): Date | null => {
  if (!iso) return null
  const date = new Date(`${iso}T12:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

const SHORT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
const LONG: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }

/**
 * Event dates, day precision only.
 * short: "5 jul 2027" · "5–12 jul 2027"
 * long:  "lunes, 5 de julio de 2027" · "5–12 de julio de 2027"
 */
export const formatDateRange = (start?: string, end?: string, style: 'short' | 'long' = 'short'): string | null => {
  const from = toDay(start)
  if (!from) return null
  const to = toDay(end)
  if (!to || to.getTime() <= from.getTime()) {
    const single = style === 'long' ? { weekday: 'long' as const, ...LONG } : SHORT
    return from.toLocaleDateString('es-AR', single)
  }
  return new Intl.DateTimeFormat('es-AR', style === 'long' ? LONG : SHORT).formatRange(from, to)
}
