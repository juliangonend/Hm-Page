export interface Coach {
  firstName: string
  lastName: string
  tag: string
  achievements: string[]
  photo: string
  alt: string
}

export const COACHES: Coach[] = [
  {
    firstName: 'Jose',
    lastName: 'Gonzalez',
    tag: 'HEAD COACH',
    achievements: [
      'Head Coach Damas AMHSC',
      'Director Regional CAH Centro-cuyo',
      'Medalla de plata Juegos Olímpicos de la Juventud Singapur 2010 con Argentina',
      'Medalla de oro Juegos Suramericanos de la Juventud 2022 sub 17 con Argentina',
    ],
    photo: 'jose-sinfondo3.webp',
    alt: 'Jose Gonzalez, Head Coach de Hockey Management',
  },
  {
    firstName: 'Cristian',
    lastName: 'Gonzalez',
    tag: 'ENTRENADOR',
    achievements: [
      'Primera división Honor Club Hockey Sanse Complutense',
      'Medalla de Plata Panamericana 2023',
      'Mundial Odisha 2023',
    ],
    photo: 'cristianfoto3.webp',
    alt: 'Cristian Gonzalez, entrenador de Hockey Management',
  },
]
