// Runs after `vite build` and `vite build --ssr`: renders /ka/ and /en/ to static HTML,
// then writes the root redirect page, sitemap.xml and robots.txt into dist/.
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const LANGS = ['ka', 'en']
const root = process.cwd()
const env = loadEnv('production', root, 'VITE_')
const SITE = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '')

const template = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8')
const { render } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href)

for (const lang of LANGS) {
  const { html, head } = render(lang)
  const page = template
    .replace('<html lang="ka">', () => `<html lang="${lang}">`)
    .replace('<!--app-head-->', () => head)
    .replace('<!--app-html-->', () => html)
  await fs.mkdir(path.join(root, 'dist', lang), { recursive: true })
  await fs.writeFile(path.join(root, 'dist', lang, 'index.html'), page)
  console.log(`prerendered /${lang}/`)
}

// '/' only redirects to a language page (remembered choice, else browser language)
const rootPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wine Collection of Georgia</title>
    <meta http-equiv="refresh" content="0;url=/ka/" />
    ${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/" />`).join('\n    ')}
    <script>
      (function () {
        var l = null;
        try { l = localStorage.getItem('lang'); } catch (e) {}
        if (l !== 'ka' && l !== 'en') l = (navigator.language || '').toLowerCase().indexOf('ka') === 0 ? 'ka' : 'en';
        location.replace('/' + l + '/' + location.hash);
      })();
    </script>
  </head>
  <body>
    <a href="/ka/">ქართული</a> · <a href="/en/">English</a>
  </body>
</html>
`
await fs.writeFile(path.join(root, 'dist/index.html'), rootPage)

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map(
  (lang) => `  <url>
    <loc>${SITE}/${lang}/</loc>
    <lastmod>${today}</lastmod>
${LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE}/${l}/" />`).join('\n')}
  </url>`,
).join('\n')}
</urlset>
`
await fs.writeFile(path.join(root, 'dist/sitemap.xml'), sitemap)
await fs.writeFile(path.join(root, 'dist/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
await fs.rm(path.join(root, 'dist-server'), { recursive: true, force: true })

console.log(`sitemap.xml + robots.txt written for ${SITE}`)
if (SITE === 'https://example.com') console.warn('! VITE_SITE_URL is not set - using the placeholder https://example.com')
