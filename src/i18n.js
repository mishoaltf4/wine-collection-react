import i18next from 'i18next'
import ka from './locales/ka.json'
import en from './locales/en.json'

// One instance per language so the same code can render both languages on the server and the client
export function createI18n(lng) {
  const instance = i18next.createInstance()
  instance.init({
    resources: { ka: { translation: ka }, en: { translation: en } },
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    initAsync: false,
  })
  return instance
}
