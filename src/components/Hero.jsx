import { useTranslation } from 'react-i18next'
import hero from '../assets/images/home/hero.webp'
import Divider from './Divider'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section id="top" className="relative flex min-h-140 items-center overflow-hidden px-5 py-24 md:px-10 lg:h-205 lg:py-35">
      {/* Largest image on the page: load it first, with dimensions to avoid layout shift */}
      <img
        src={hero}
        alt=""
        width={1664}
        height={945}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(9,23,41,0.45)]" />
      <div className="relative mx-auto flex w-full max-w-310 flex-col gap-7">
        {/* Two lines: EN has a line break in the locale file, KA is balanced into two lines */}
        {/* AOS element keeps a static className: React rewriting it on language change would strip AOS's classes and hide the title */}
        <div data-aos="fade-up">
          <h1 className="title-hero whitespace-pre-line text-balance font-display leading-[1.15] text-white">
            {t('HERO.TITLE')}
          </h1>
        </div>
        <Divider className="w-25" data-aos="fade-up" data-aos-delay="150" />
        <p data-aos="fade-up" data-aos-delay="300" className="max-w-180 text-base leading-[1.75] text-white/85">{t('HERO.SUBTITLE')}</p>
      </div>
    </section>
  )
}
