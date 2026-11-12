import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionTitle } from './SectionTitle'

describe('SectionTitle', () => {
  it('keeps the spaces between words in the heading text', () => {
    render(<SectionTitle text="Potenciamos tu club" />)
    expect(screen.getByRole('heading').textContent).toBe('Potenciamos tu club')
  })

  it('puts the spaces outside the inline-block word masks (inside them the browser collapses them)', () => {
    render(<SectionTitle text="Potenciamos tu club" />)
    const masks = Array.from(screen.getByRole('heading').children)
    expect(masks.map((mask) => mask.textContent)).toEqual(['Potenciamos', 'tu', 'club'])
  })
})
