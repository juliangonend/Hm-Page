import { useId, type ReactNode } from 'react'
import { findCountry, type CountryCode } from '../domain/countries'

interface CountryFlagProps {
  code: CountryCode
  /** Diameter in px. */
  size?: number
  className?: string
}

/** Drawn on a 30×30 square, then clipped to a circle. */
const FLAGS: Record<CountryCode, ReactNode> = {
  AR: (
    <>
      <rect width="30" height="30" fill="#74ACDF" />
      <rect y="10" width="30" height="10" fill="#FFFFFF" />
      <circle cx="15" cy="15" r="3" fill="#F6B40E" />
    </>
  ),
  CL: (
    <>
      <rect width="30" height="30" fill="#FFFFFF" />
      <rect y="15" width="30" height="15" fill="#D52B1E" />
      <rect width="15" height="15" fill="#0039A6" />
      <polygon
        fill="#FFFFFF"
        points="7.50,4.30 8.26,6.45 10.54,6.51 8.74,7.90 9.38,10.09 7.50,8.80 5.62,10.09 6.26,7.90 4.46,6.51 6.74,6.45"
        transform="translate(1.5 1.5)"
      />
    </>
  ),
  ES: (
    <>
      <rect width="30" height="30" fill="#AA151B" />
      <rect y="7.5" width="30" height="15" fill="#F1BF00" />
    </>
  ),
}

/** Round flag; its accessible name is the country name. */
export const CountryFlag = ({ code, size = 20, className }: CountryFlagProps) => {
  const clipId = useId()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      role="img"
      aria-label={findCountry(code)?.label ?? code}
      className={className}
      style={{ flexShrink: 0, borderRadius: '50%', boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.12)' }}
    >
      <clipPath id={clipId}>
        <circle cx="15" cy="15" r="15" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{FLAGS[code]}</g>
    </svg>
  )
}
