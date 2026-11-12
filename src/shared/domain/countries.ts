export const COUNTRY_CODES = ['AR', 'CL', 'ES'] as const

/** ISO 3166-1 alpha-2 code of a country where Hockey Management works. */
export type CountryCode = (typeof COUNTRY_CODES)[number]

export interface Country {
  code: CountryCode
  label: string
  /** WhatsApp line that answers this country, international format without "+". */
  whatsapp: string
}

const ARGENTINA_LINE = '542616683140'
const SPAIN_LINE = '34623036136'

export const COUNTRIES: readonly Country[] = [
  { code: 'AR', label: 'Argentina', whatsapp: ARGENTINA_LINE },
  { code: 'CL', label: 'Chile', whatsapp: SPAIN_LINE },
  { code: 'ES', label: 'España', whatsapp: SPAIN_LINE },
]

export const DEFAULT_COUNTRY: CountryCode = 'AR'

export const findCountry = (code: string | null | undefined): Country | undefined =>
  COUNTRIES.find((country) => country.code === code)

/** Normalizes any API value to a known code; unknown or missing means Argentina. */
export const toCountryCode = (value: string | null | undefined): CountryCode =>
  findCountry(value?.toUpperCase())?.code ?? DEFAULT_COUNTRY
