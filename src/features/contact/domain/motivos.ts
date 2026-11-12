export const MOTIVOS = [
  'CAMPUS',
  'PERSONALIZADOS',
  'ARQUEROS',
  'JUGADORES',
  'PSICOMOTRICIDAD',
  'ASESORAMIENTO',
  'GIRAS',
  'OTRO',
] as const

export type Motivo = (typeof MOTIVOS)[number]

/** Quick-pick chips used by the inline contact form. */
export const INLINE_MOTIVOS: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'Jugadores', value: 'JUGADORES' },
  { label: 'Arqueros', value: 'ARQUEROS' },
  { label: 'Clubes', value: 'CLUBES' },
  { label: 'Giras', value: 'GIRAS' },
  { label: 'Otro', value: 'OTRO' },
]
