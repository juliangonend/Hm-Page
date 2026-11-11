import type { PromoCard } from '../domain/PromoCard'

/** Hardcoded upcoming events. Edit here until the back office adapter is plugged in. */
export const UPCOMING_EVENTS: readonly PromoCard[] = [
  {
    id: 'campus-verano-2027',
    category: 'campus',
    title: 'Campus de Verano 2027',
    description:
      'Mendoza, 12 al 16 de enero. Cinco jornadas intensivas de técnica individual, arrastre y juego para jugadores y arqueros.',
    badge: 'Campus · 12–16 ene',
    ctaLabel: 'Quiero inscribirme',
    spotsLeft: 12,
    startsAt: '2027-01-12',
    published: true,
    order: 1,
  },
  {
    id: 'clinica-arqueros-2027',
    category: 'entrenamiento',
    title: 'Clínica de Arqueros',
    description:
      'Grupos reducidos con un especialista: técnica, táctica y coordinación para arqueros de todas las edades.',
    badge: 'Clínica · Febrero',
    ctaLabel: 'Reservar lugar',
    spotsLeft: 6,
    startsAt: '2027-02-06',
    published: true,
    order: 2,
  },
  {
    id: 'gira-espana-2027',
    category: 'gira',
    title: 'Gira España 2027',
    description:
      'Partidos, entrenamientos y actividades culturales para clubes. Nos ocupamos de todo para que solo se dediquen a disfrutar.',
    badge: 'Gira · Julio',
    ctaLabel: 'Pedir información',
    startsAt: '2027-07-01',
    published: true,
    order: 3,
  },
]
