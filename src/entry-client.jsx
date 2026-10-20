import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import 'aos/dist/aos.css'
import './index.css'
import Root from './Root.jsx'
import { langFromPath, preferredLang } from './lang'

let lang = langFromPath(location.pathname)
if (!lang) {
  // '/' has no language: send the visitor to /ka/ or /en/
  lang = preferredLang()
  history.replaceState(null, '', `/${lang}/${location.hash}`)
}

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <Root initialLang={lang} />
  </StrictMode>
)

// Prerendered pages already contain markup -> hydrate it; in dev the root is empty
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
