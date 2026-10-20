import { renderToString } from 'react-dom/server'
import Root from './Root.jsx'
import { seoToHtml } from './seo'

// Used by scripts/prerender.mjs
export function render(lang) {
  return { html: renderToString(<Root initialLang={lang} />), head: seoToHtml(lang) }
}
