import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MONTH_KEYS, pillars } from '../data/home'
import { localize, pastOf, useEvents } from '../events'
import { useLang } from '../lang'
import SectionBackground from './SectionBackground'
import Divider from './Divider'

// Past events per carousel page: 2 per row, 2 rows
const PAGE_SIZE = 4

const arrow = 'flex size-10 cursor-pointer items-center justify-center rounded-full border border-gold text-gold transition hover:bg-gold hover:text-navy disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold'

export default function About() {
  const { t } = useTranslation()
  const { lang } = useLang()
  const past = pastOf(useEvents()).map((e) => localize(e, lang))
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(past.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const chunks = Array.from({ length: pages }, (_, i) => past.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE))
  const monthName = (m) => t(`MONTHS.${MONTH_KEYS[m]}`)
  // "28 June, 2025 • Batumi, Georgia"
  const dateLine = (e) => [`${e.day} ${monthName(e.month)}, ${e.year}`, e.place].filter(Boolean).join(' • ')

  return (
    <section id="about" className="relative overflow-hidden bg-white px-5 py-16 md:px-10 lg:py-20">
      <SectionBackground />
      <div className="relative mx-auto flex max-w-310 flex-col gap-8">
        <div data-aos="fade-up" className="flex flex-col gap-4">
          <h2 className="title-lg font-display leading-[1.2] text-white">{t('WHAT_WE_DO.TITLE')}</h2>
          <Divider className="w-20" />
          <p className="max-w-3xl text-[15px] leading-[1.7] text-white">{t('WHAT_WE_DO.SUBTITLE')}</p>
        </div>

        <div data-aos="fade-up" className="grid grid-cols-1 rounded-sm bg-navy py-4 md:grid-cols-3 lg:grid-cols-6 lg:py-7">
          {pillars.map((p, i) => (
            <div
              key={p.key}
              className={`flex flex-col items-center justify-center gap-4 p-6 text-center lg:border-l lg:border-gold/30 ${
                i === 0 ? 'lg:border-l-0' : ''
              }`}
            >
              <img src={p.icon} alt="" className="size-12" />
              <p className="font-display text-base font-bold text-gold md:text-lg">{t(`WHAT_WE_DO.ICONS.${p.key}`)}</p>
            </div>
          ))}
        </div>

        <p data-aos="fade-up" className="text-[15px] leading-[1.7] text-white">{t('WHAT_WE_DO.INFO_1')}</p>

        <h3 data-aos="fade-up" className="mt-4 title-sm font-display leading-[1.4] text-white">{t('PAST_EVENTS.TITLE')}</h3>

        <div data-aos="fade-up">
          {/* From md up, all pages share one grid cell, so the section is as tall as the fullest page and never jumps */}
          <div className="grid">
            {chunks.map((chunk, pi) => (
              <div
                key={pi}
                aria-hidden={pi !== current}
                inert={pi !== current}
                className={`col-start-1 row-start-1 content-start gap-5 md:grid md:grid-cols-2 ${pi === current ? 'grid' : 'hidden md:invisible'}`}
              >
                {chunk.map((e) => (
                  <article key={e.id} className="overflow-hidden rounded-sm bg-white/10 shadow-[0_4px_16px_rgba(15,42,74,0.08)]">
                    <img src={e.image} alt={e.title} loading="lazy" decoding="async" className="h-60 w-full object-cover" />
                    <div className="flex flex-col gap-3 p-5">
                      <p className="text-[10px] font-bold uppercase text-fog">{dateLine(e)}</p>
                      <h4 className="font-display text-[22px] font-semibold leading-[1.2] text-gold">{e.title}</h4>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-6">
              <button className={arrow} onClick={() => setPage(current - 1)} disabled={current === 0} aria-label="Previous">
                ‹
              </button>
              <div className="flex gap-2">
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className={`size-2 cursor-pointer rounded-full ${i === current ? 'bg-gold' : 'bg-white/30'}`}
                  />
                ))}
              </div>
              <button className={arrow} onClick={() => setPage(current + 1)} disabled={current === pages - 1} aria-label="Next">
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
