import { describe, expect, it } from 'vitest'
import { formatDateRange } from './eventFormat'

describe('formatDateRange', () => {
  it('shows a single day when there is no end date or it is the same day', () => {
    expect(formatDateRange('2027-07-05')).toMatch(/^5.*jul.*2027$/)
    expect(formatDateRange('2027-07-05', '2027-07-05')).toBe(formatDateRange('2027-07-05'))
  })

  it('shows a range with both days', () => {
    const range = formatDateRange('2027-07-05', '2027-07-12') ?? ''
    expect(range).toMatch(/5/)
    expect(range).toMatch(/12/)
    expect(range).toMatch(/2027/)
  })

  it('returns null without a start date', () => {
    expect(formatDateRange(undefined)).toBeNull()
  })
})
