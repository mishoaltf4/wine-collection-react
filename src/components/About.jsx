import { useTranslation } from 'react-i18next'
import { pastEvents, pillars } from '../data/home'
import SectionBackground from './SectionBackground'
import Divider from './Divider'

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="relative overflow-hidden bg-white px-5 py-16 md:px-10 lg:py-20">
      <SectionBackground />
      <div className="relative mx-auto flex max-w-310 flex-col gap-8">
        <div data-aos="fade-up" className="flex flex-col gap-4">
          <h2 className="font-display text-3xl leading-[1.2] text-white md:text-[44px]">{t('WHAT_WE_DO.TITLE')}</h2>
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

        <h3 data-aos="fade-up" className="mt-4 font-display text-3xl leading-[1.4] text-white md:text-4xl">{t('PAST_EVENTS.TITLE')}</h3>

        <div className="grid gap-5 md:grid-cols-2">
          {pastEvents.map((e, i) => {
            const item = `PAST_EVENTS.PAST_EVENTS_LIST.${e.key}`
            return (
              <article
                key={e.key}
                data-aos="fade-up"
                data-aos-delay={(i % 2) * 150}
                className="overflow-hidden rounded-sm bg-white/10 shadow-[0_4px_16px_rgba(15,42,74,0.08)]"
              >
                <img
                  src={e.image}
                  alt={t(`${item}.TITLE`)}
                  loading="lazy"
                  decoding="async"
                  className="h-60 w-full object-cover"
                />
                <div className="flex flex-col gap-3 p-5">
                  <p className="text-[10px] font-bold uppercase text-fog">{t(`${item}.DATE`)}</p>
                  <h4 className="font-display text-[22px] font-semibold leading-[1.2] text-gold">{t(`${item}.TITLE`)}</h4>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
