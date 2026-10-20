import { renderToString } from 'react-dom/server'
import Root from './Root.jsx'
import { seoToHtml } from './seo'

// Used by scripts/prerender.mjs
export function render(lang, events = []) {
  return { html: renderToString(<Root initialLang={lang} initialEvents={events} />), head: seoToHtml(lang, events) }
}
