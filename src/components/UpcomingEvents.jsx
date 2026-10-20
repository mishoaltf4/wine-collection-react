import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MONTH_KEYS, WEEKDAY_KEYS, upcomingEvents } from '../data/home'
import { facebookLink } from '../data/links'
import SectionBackground from './SectionBackground'
import Divider from './Divider'

const dateId = (year, month, day) => `${year}-${month}-${day}`

// Festivals by date, so a calendar day can be checked in O(1)
const eventsByDate = Object.fromEntries(upcomingEvents.map((e) => [dateId(e.year, e.month, e.day), e]))

// Monday-first grid, null = empty cell
function buildCalendar(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
}

export default function UpcomingEvents() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(upcomingEvents[0])
  const [view, setView] = useState({ year: selected.year, month: selected.month })

  const cells = buildCalendar(view.year, view.month)
  const ev = `UPCOMING_EVENTS.EVENTS.${selected.key}`

  const shiftMonth = (delta) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })

  const arrow =
    'flex size-9 cursor-pointer items-center justify-center rounded-full text-xl text-white/70 transition-colors duration-300 hover:bg-white/15 hover:text-white'

  return (
    <section id="events" className="relative overflow-hidden px-5 py-16 md:px-10 lg:py-25">
      <SectionBackground />
      <div className="relative mx-auto flex max-w-310 flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h2 data-aos="fade-up" className="title-lg font-display text-gold">{t('UPCOMING_EVENTS.TITLE')}</h2>
          <Divider className="w-full" gold={false} />
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <div data-aos="fade-right" className="flex w-full flex-col gap-6 lg:w-130 lg:shrink-0">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 font-display">
                <span className="title-xl text-white">{t(`MONTHS.${MONTH_KEYS[view.month]}`)}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <button className={arrow} onClick={() => shiftMonth(-1)} aria-label="Previous month">
                    ‹
                  </button>
                  <span className="text-2xl text-white/70 md:text-[32px]">{view.year}</span>
                  <button className={arrow} onClick={() => shiftMonth(1)} aria-label="Next month">
                    ›
                  </button>
                </div>
              </div>
              <Divider className="w-full" gold={false} />
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {WEEKDAY_KEYS.map((d) => (
                <span key={d} className="pb-1 text-center text-xs font-semibold uppercase text-white/60">
                  {t(`WEEKENDS.${d}`)}
                </span>
              ))}
              {cells.map((day, i) => {
                const base = 'flex aspect-square max-h-16 items-center justify-center rounded-xs'
                if (day === null) return <div key={i} />

                const festival = eventsByDate[dateId(view.year, view.month, day)]
                if (!festival) {
                  return (
                    <div key={i} className={`${base} text-white/40`}>
                      {day}
                    </div>
                  )
                }

                const isSelected = festival === selected
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(festival)}
                    aria-pressed={isSelected}
                    className={`${base} cursor-pointer text-white transition-colors duration-300 ${
                      isSelected ? 'bg-gold' : 'hover:bg-white/20'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          <article data-aos="fade-left" data-aos-delay="150" className="flex flex-1 flex-col gap-6 rounded-sm bg-white/10 p-5 shadow-[0_12px_32px_rgba(15,42,74,0.15)] md:p-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase text-gold">
                {t(`${ev}.DATE`)} · {t(`${ev}.PLACE_SHORT`)}
              </p>
              <h3 className="title-md font-display leading-[1.2] text-navy">{t(`${ev}.TITLE`)}</h3>
            </div>
            <Divider className="w-full" gold={false} />
            <p className="text-[15px] leading-[1.6] text-fog">{t(`${ev}.DESCRIPTION`)}</p>
            <Divider className="w-full" gold={false} />
            <div className="relative h-55 overflow-hidden rounded-sm">
              <img
                key={selected.key}
                src={selected.image}
                alt={t(`${ev}.TITLE`)}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
              <div className="absolute bottom-4 left-4 rounded-sm bg-white/70 px-3.5 py-2.5 text-navy shadow-[0_4px_12px_rgba(15,42,74,0.12)]">
                <p className="text-[11px] font-semibold uppercase font-features-['case']">{t('COMMON.PLACE')}</p>
                <p className="text-[15px] font-semibold">{t(`${ev}.PLACE`)}</p>
              </div>
            </div>
            <a
              href={facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-sm border border-navy bg-navy px-5 py-3.5 text-center text-sm font-semibold uppercase text-gold shadow-[0_8px_10px_rgba(15,42,74,0.2)] hover:brightness-125"
            >
              {t('COMMON.SEE_MORE')}
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
