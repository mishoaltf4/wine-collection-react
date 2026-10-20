import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import logo from '../assets/icons/wcg-logo.svg'
import { useLang } from '../lang'

const links = [
  { id: 'events', key: 'UPCOMING_EVENTS' },
  { id: 'about', key: 'WHAT_WE_DO' },
  { id: 'partners', key: 'PARTNERS' },
  { id: 'contact', key: 'CONTACT' },
]

export default function Header() {
  const { t } = useTranslation()
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)

  // Lock page scroll while the full-screen menu is open, close it on Escape / when resized to desktop
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const langSwitcher = (
    <div className="flex items-center gap-3 text-xs">
      {['en', 'ka'].map((lng, i) => (
        <div key={lng} className="flex items-center gap-3">
          {i > 0 && <span className="text-muted">|</span>}
          <button
            onClick={() => setLang(lng)}
            className={`flex cursor-pointer flex-col items-center gap-1 ${
              lang === lng ? 'font-bold text-white' : 'font-medium text-muted'
            }`}
          >
            {lng.toUpperCase()}
            <span className={`h-[1.5px] w-4 ${lang === lng ? 'bg-gold' : 'bg-transparent'}`} />
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 bg-navy max-lg:px-5 lg:px-20">
      <div className="flex h-20 items-center justify-between lg:h-25">
        <a href="#top" className="flex items-center gap-3 lg:gap-4" onClick={() => setOpen(false)}>
          <img src={logo} alt="Wine Collection of Georgia" className="size-10 rounded-full lg:size-12" />
          {/* Brand name keeps its own font in every language */}
          <span className="hidden font-brand text-base font-semibold text-gold sm:block lg:text-xl">
            Wine Collection of Georgia
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-10 text-xs font-semibold uppercase text-gold font-features-['case'] lg:flex">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="hover:text-white">
              {t(`NAVIGATION.${l.key}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {/* href to be added */}
          <a
            href="#"
            className="rounded-sm bg-gold px-4 py-2 text-xs font-semibold uppercase text-white transition hover:brightness-110"
          >
            {t('NAVIGATION.CATALOG')}
          </a>
          {langSwitcher}
          <button
            className="flex size-8 cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <span className={`h-0.5 w-6 bg-gold transition duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-gold transition duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-gold transition duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu, always mounted so it can fade in and out */}
      <nav
        aria-hidden={!open}
        className={`fixed inset-0 -z-10 flex flex-col items-center justify-center gap-8 bg-navy px-5 pt-20 text-center font-features-['case'] transition-all duration-500 ease-in-out lg:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-4 opacity-0'
        }`}
      >
        {links.map((l, i) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${150 + i * 70}ms` : '0ms' }}
            className={`text-2xl font-semibold uppercase text-gold transition-all duration-500 hover:text-white ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            {t(`NAVIGATION.${l.key}`)}
          </a>
        ))}
      </nav>
    </header>
  )
}
