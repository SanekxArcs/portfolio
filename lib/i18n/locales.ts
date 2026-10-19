export const locales = ['en', 'pl', 'uk'] as const
export type Locale = (typeof locales)[number]
export const languageLabels = {en: 'EN', pl: 'PL', uk: 'UA'} as const
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}
export function localePath(locale: Locale, path = '') {
  return `/${locale}${path}`
}
