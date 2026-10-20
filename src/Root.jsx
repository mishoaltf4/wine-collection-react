import { useCallback, useEffect, useMemo, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import App from './App'
import { createI18n } from './i18n'
import { LangContext, langFromPath } from './lang'
import { fetchEvents } from './api'
import { EventsContext } from './events'
import { applySeo } from './seo'

export default function Root({ initialLang, initialEvents = [] }) {
  const [lang, setLangState] = useState(initialLang)
  const [events, setEvents] = useState(initialEvents)
  const i18n = useMemo(() => createI18n(lang), [lang])

  // Each language has its own URL (/ka/, /en/); switching updates the URL without a reload
  const setLang = useCallback((next) => {
    history.pushState(null, '', `/${next}/${location.hash}`)
    try {
      localStorage.setItem('lang', next)
    } catch {
      // storage unavailable
    }
    setLangState(next)
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const fromPath = langFromPath(location.pathname)
      if (fromPath) setLangState(fromPath)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // The prerendered events can be stale, so refresh them from the API once the page is live
  useEffect(() => {
    fetchEvents().then(setEvents).catch(() => {})
  }, [])

  useEffect(() => {
    applySeo(lang, events)
  }, [lang, events])

  // AOS touches `window` on import, so load it client-side only, after hydration
  useEffect(() => {
    let onLoad
    import('aos').then(({ default: AOS }) => {
      AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 80 })
      // Lazy images change the page height, so recalculate trigger positions after load
      onLoad = () => AOS.refresh()
      if (document.readyState === 'complete') onLoad()
      else window.addEventListener('load', onLoad)
    })
    return () => window.removeEventListener('load', onLoad)
  }, [])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])

  return (
    <LangContext value={value}>
      <I18nextProvider i18n={i18n}>
        <EventsContext value={events}>
          <App />
        </EventsContext>
      </I18nextProvider>
    </LangContext>
  )
}
