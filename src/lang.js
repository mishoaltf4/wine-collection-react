import { createContext, useContext } from 'react'

export const LANGS = ['ka', 'en']
export const DEFAULT_LANG = 'ka'

export const LangContext = createContext({ lang: DEFAULT_LANG, setLang: () => {} })
export const useLang = () => useContext(LangContext)

// '/en/' -> 'en', '/' -> null
export function langFromPath(pathname) {
  const seg = pathname.split('/')[1]
  return LANGS.includes(seg) ? seg : null
}

// Used when the visitor lands on '/': remembered choice, else browser language
export function preferredLang() {
  try {
    const stored = localStorage.getItem('lang')
    if (LANGS.includes(stored)) return stored
  } catch {
    // storage unavailable
  }
  return navigator.language?.toLowerCase().startsWith('ka') ? 'ka' : 'en'
}
