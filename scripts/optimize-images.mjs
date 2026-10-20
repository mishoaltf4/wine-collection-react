// One-off: converts the heavy source images to WebP and generates favicon / share image.
// Run: node scripts/optimize-images.mjs  (originals are kept next to the .webp files)
import sharp from 'sharp'

const dir = 'src/assets/images/home/'
const jobs = [
  ['hero.png', 1920, 72],
  ['incoming-events.png', 1280, 50],
  ['event-31-oct.png', 1200, 75],
  ['event.png', 1200, 75],
  ['something.jpg', 900, 75],
]

for (const [file, width, quality] of jobs) {
  const out = dir + file.replace(/\.\w+$/, '.webp')
  const info = await sharp(dir + file).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(out)
  console.log(out, Math.round(info.size / 1024) + ' kB', info.width + 'x' + info.height)
}

// 1200x630 Open Graph image
await sharp(dir + 'hero.png').resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toFile('public/og-image.jpg')

// Favicons from the logo
const logo = 'src/assets/icons/wcg-logo.svg'
await sharp(logo, { density: 300 }).resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile('public/favicon.png')
await sharp(logo, { density: 300 }).resize(180, 180, { fit: 'contain', background: '#0f2a4a' }).png().toFile('public/apple-touch-icon.png')
console.log('og-image.jpg, favicon.png, apple-touch-icon.png written')
