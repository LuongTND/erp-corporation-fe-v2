export const defaultNS = 'common'
export const locales = ['vi', 'en']
export const defaultLocale = 'vi'

export const i18nConfig = {
  defaultLocale,
  locales,
} as const

export type Locale = (typeof locales)[number]
