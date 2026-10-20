import { useTranslation } from 'react-i18next'
import { wineries } from '../data/home'
import nationalAgency from '../assets/images/home/erovnuli-saagento.png'
import ministry from '../assets/images/home/garemos-saagento.png'
import Carousel from './Carousel'
import SectionBackground from './SectionBackground'
import Divider from './Divider'

export default function Partners() {
  const { t } = useTranslation()

  return (
    <section id="partners" className="relative overflow-hidden bg-navy px-5 pb-16 pt-16 md:px-10 lg:pb-25 lg:pt-20">
      <SectionBackground />
      <div className="relative mx-auto flex max-w-310 flex-col gap-12">
        <div className="flex flex-col gap-4">
          <div data-aos="fade-up" className="flex flex-col gap-4">
            <h2 className="font-display text-3xl text-gold md:text-[44px]">{t('PARTNERS.TITLE')}</h2>
            <Divider className="w-15" />
            <p className="max-w-3xl text-[15px] leading-[1.7] text-white/70">{t('PARTNERS.CONTENT')}</p>
          </div>
          <Divider className="w-full" gold={false} />
        </div>

        <Carousel
          data-aos="fade-up"
          items={wineries}
          renderItem={(w) => (
            <article className="h-full overflow-hidden rounded-sm bg-white/10 shadow-[0_12px_32px_rgba(15,42,74,0.15)]">
              <img src={w.image} alt={w.name} loading="lazy" decoding="async" className="h-60 w-full object-cover" />
              <div className="flex flex-col gap-2 p-5">
                <p className="text-[10px] font-bold uppercase text-fog">{w.region}</p>
                <h3 className="font-display text-[22px] text-gold">{w.name}</h3>
              </div>
            </article>
          )}
        />

        <div data-aos="fade-up" className="flex flex-col gap-6 rounded-sm bg-white/10 p-6 md:p-8">
          <h3 className="font-display text-2xl text-gold">{t('PARTNERS.SUPPORT.TITLE')}</h3>
          <div className="flex flex-col gap-4 text-sm leading-[1.7] text-white/80 lg:flex-row lg:gap-10">
            <p className="flex-1">{t('PARTNERS.SUPPORT.SUBTITLE_1')}</p>
            <p className="flex-1">{t('PARTNERS.SUPPORT.SUBTITLE_2')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-8">
            <img src={ministry} alt="" loading="lazy" decoding="async" className="h-16 w-auto" />
            <img src={nationalAgency} alt="" loading="lazy" decoding="async" className="h-16 w-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}
