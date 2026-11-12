import type { Motivo } from '../contact/domain/motivos'

export interface Training {
  id: string
  title: string
  badge: string
  text: string
  image: string
  motivo: Motivo
}

export const TRAININGS: Training[] = [
  {
    id: 'jugadores',
    title: 'Jugadores',
    badge: 'Desde 11 años',
    text: 'Llevá tu juego al siguiente nivel con entrenamientos enfocados en cada aspecto individual: defensa, definición, habilidades aéreas, técnicas 3D, posturas y mucho más. Formate como un jugador Hockey Management.',
    image: 'header/img-6.webp',
    motivo: 'JUGADORES',
  },
  {
    id: 'arqueros',
    title: 'Arqueros',
    badge: 'Todas las edades',
    text: 'Desarrollá todo tu potencial como arquero con entrenamientos técnicos, tácticos y coordinativos, guiados por un especialista. Con grupos reducidos, adaptados a todas las edades y niveles.',
    image: 'header/header-3.webp',
    motivo: 'ARQUEROS',
  },
  {
    id: 'psicomotricidad',
    title: 'Psicomotricidad',
    badge: 'Hasta 10 años',
    text: 'A través del juego y el movimiento, trabajamos la coordinación, el equilibrio, la postura y el control corporal, para crecer con una buena base para el hockey.',
    image: 'header/header-1.webp',
    motivo: 'PSICOMOTRICIDAD',
  },
  {
    id: 'arrastradores',
    title: 'Arrastradores',
    badge: 'Especialización',
    text: 'Entrenamientos especializados en arrastre, perfeccioná tu técnica para marcar la diferencia en cada partido.',
    image: 'header/img-7.webp',
    motivo: 'PERSONALIZADOS',
  },
]
