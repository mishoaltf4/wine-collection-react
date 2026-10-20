import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import 'aos/dist/aos.css'
import './index.css'
import Root from './Root.jsx'
import { langFromPath, preferredLang } from './lang'

const container = document.getElementById('root')

if (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) {
  // Admin panel: client-only, not prerendered
  const { default: Admin } = await import('./pages/Admin.jsx')
  createRoot(container).render(
    <StrictMode>
      <Admin />
    </StrictMode>,
  )
} else {
  let lang = langFromPath(location.pathname)
  if (!lang) {
    // '/' has no language: send the visitor to /ka/ or /en/
    lang = preferredLang()
    history.replaceState(null, '', `/${lang}/${location.hash}`)
  }

  // The prerender embeds the events it rendered with, so hydration matches the server markup
  const app = (
    <StrictMode>
      <Root initialLang={lang} initialEvents={window.__EVENTS__ ?? []} />
    </StrictMode>
  )

  // Prerendered pages already contain markup -> hydrate it; in dev the root is empty
  if (container.firstElementChild) hydrateRoot(container, app)
  else createRoot(container).render(app)
}
