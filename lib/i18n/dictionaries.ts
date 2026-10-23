import en from '@/content/site/en.json'
import pl from '@/content/site/pl.json'
import uk from '@/content/site/uk.json'
import type {Locale} from './locales'
export type Dictionary = typeof en
const dictionaries: Record<Locale, Dictionary> = {en, pl, uk}
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
