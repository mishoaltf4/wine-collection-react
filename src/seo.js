import ka from './locales/ka.json'
import en from './locales/en.json'
import { upcomingEvents } from './data/home'
import { facebookLink, instagramLink } from './data/links'
import { LANGS } from './lang'

// Set VITE_SITE_URL in .env to the production domain (no trailing slash)
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '')

const dict = { ka, en }
const OG_LOCALE = { ka: 'ka_GE', en: 'en_US' }
const ORG_NAME = 'Wine Collection of Georgia'
const pad = (n) => String(n).padStart(2, '0')

function organization(lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG_NAME,
    alternateName: ka.SEO.SITE_NAME,
    url: `${SITE_URL}/${lang}/`,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    email: 'Winecollectionofgeorgia@gmail.com',
    telephone: '+995500052331',
    sameAs: [instagramLink, facebookLink],
  }
}

function events(lang) {
  const t = dict[lang].UPCOMING_EVENTS.EVENTS
  return upcomingEvents
    .filter((e) => !e.dummy)
    .map((e) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: t[e.key].TITLE,
      description: t[e.key].DESCRIPTION,
      startDate: `${e.year}-${pad(e.month + 1)}-${pad(e.day)}`,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: { '@type': 'Place', name: t[e.key].PLACE, address: t[e.key].PLACE },
      image: `${SITE_URL}${e.image}`,
      inLanguage: lang,
      organizer: { '@id': `${SITE_URL}/#organization` },
    }))
}

// Tag descriptors shared by the prerender (-> HTML string) and the client (-> DOM updates on language switch)
export function getSeoTags(lang) {
  const { TITLE: title, DESCRIPTION: description, SITE_NAME: siteName } = dict[lang].SEO
  const url = `${SITE_URL}/${lang}/`
  const image = `${SITE_URL}/og-image.jpg`
  const meta = (attrs) => ({ tag: 'meta', attrs })

  return [
    { tag: 'title', text: title },
    meta({ name: 'description', content: description }),
    meta({ name: 'robots', content: 'index, follow, max-image-preview:large' }),
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    ...LANGS.map((l) => ({ tag: 'link', attrs: { rel: 'alternate', hreflang: l, href: `${SITE_URL}/${l}/` } })),
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/` } },
    meta({ property: 'og:type', content: 'website' }),
    meta({ property: 'og:site_name', content: siteName }),
    meta({ property: 'og:title', content: title }),
    meta({ property: 'og:description', content: description }),
    meta({ property: 'og:url', content: url }),
    meta({ property: 'og:image', content: image }),
    meta({ property: 'og:image:width', content: '1200' }),
    meta({ property: 'og:image:height', content: '630' }),
    meta({ property: 'og:image:alt', content: title }),
    meta({ property: 'og:locale', content: OG_LOCALE[lang] }),
    ...LANGS.filter((l) => l !== lang).map((l) => meta({ property: 'og:locale:alternate', content: OG_LOCALE[l] })),
    meta({ name: 'twitter:card', content: 'summary_large_image' }),
    meta({ name: 'twitter:title', content: title }),
    meta({ name: 'twitter:description', content: description }),
    meta({ name: 'twitter:image', content: image }),
    ...[organization(lang), ...events(lang)].map((data) => ({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      // '<' escaped so the JSON can never close the script tag
      text: JSON.stringify(data).replace(/</g, '\\u003c'),
    })),
  ]
}

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Prerender: markup for <head>
export function seoToHtml(lang) {
  return getSeoTags(lang)
    .map(({ tag, attrs = {}, text }) => {
      const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${escapeHtml(v)}"`).join('')
      if (tag === 'title') return `<title data-seo>${escapeHtml(text)}</title>`
      if (tag === 'script') return `<script data-seo${a}>${text}</script>`
      return `<${tag} data-seo${a} />`
    })
    .join('\n    ')
}

// Client: replace the SEO tags when the language changes
export function applySeo(lang) {
  document.documentElement.lang = lang
  document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
  for (const { tag, attrs = {}, text } of getSeoTags(lang)) {
    if (tag === 'title') {
      document.title = text
      continue
    }
    const el = document.createElement(tag)
    el.setAttribute('data-seo', '')
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    if (text) el.textContent = text
    document.head.appendChild(el)
  }
}
