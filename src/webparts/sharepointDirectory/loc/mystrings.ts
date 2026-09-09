// ─── Locale registry ──────────────────────────────────────────────────────────
//
// To add a new language (e.g. German):
//   1. Create src/webparts/sharepointDirectory/loc/de.ts  (copy en.ts, translate)
//   2. Add two lines below:
//        import de from './de'
//        locales.de = de
//
// That's it — no other file needs to change.
// ─────────────────────────────────────────────────────────────────────────────

import fr from './fr'
import en from './en'

export type Strings = typeof fr

// Map ISO-639-1 language code → translation object.
// "en" is used as the fallback when a language is not registered.
const locales: Record<string, Strings> = {
  fr,
  en,
}

let current: Strings = fr

export const strings: Strings = new Proxy({} as Strings, {
  get(_target, prop: keyof Strings) {
    return current[prop]
  },
})

/** Call once at startup with the SharePoint currentUICultureName (e.g. "fr-fr", "en-us"). */
export function setLanguage(locale: string): void {
  const lang = (locale || '').split('-')[0].toLowerCase()
  current = locales[lang] ?? en
}
