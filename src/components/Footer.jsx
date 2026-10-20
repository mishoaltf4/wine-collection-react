import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import logo from '../assets/icons/wcg-logo.svg'
import { facebookLink, instagramLink } from '../data/links'

const contacts = [
  { icon: faPhone, text: '+995 500 05 23 31', href: 'tel:+995 500 05 23 31' },
  { icon: faEnvelope, text: 'Winecollectionofgeorgia@gmail.com', href: 'mailto:Winecollectionofgeorgia@gmail.com' },
]

const socials = [
  { icon: faInstagram, label: 'Instagram', href: instagramLink },
  { icon: faFacebookF, label: 'Facebook', href: facebookLink },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer id="contact" className="bg-navy px-5 pb-15 pt-20 md:px-10 lg:pt-30">
     <div className="mx-auto flex max-w-310 flex-col gap-16 lg:gap-20">
      <div data-aos="fade-up" className="flex flex-col gap-12 lg:flex-row lg:justify-between">
        <div className="flex max-w-95 flex-col gap-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Wine Collection of Georgia" className="size-14 rounded-full" />
            <p className="font-brand text-2xl text-white">Wine Collection Of Georgia</p>
          </div>
          <p className="text-sm leading-[1.7] text-white/70">{t('FOOTER.TAGLINE')}</p>
        </div>

        <div className="flex flex-col gap-4 lg:w-80">
          <p className="text-xs font-bold uppercase text-gold font-features-['case']">{t('FOOTER.INQUIRIES')}</p>
          <ul className="flex flex-col gap-3 text-sm text-white/90">
            {contacts.map((c) => (
              <li key={c.text} className="flex items-center gap-3">
                <FontAwesomeIcon icon={c.icon} className="w-4 text-gold" />
                {c.href ? <a href={c.href} className="hover:text-gold">{c.text}</a> : c.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex size-9 items-center justify-center rounded-full bg-navy-light text-gold transition hover:bg-gold hover:text-navy"
            >
              <FontAwesomeIcon icon={s.icon} />
            </a>
          ))}
        </div>
        <div className="h-px w-full bg-white/15" />
        <p className="text-center text-xs text-white/50">
          © {new Date().getFullYear()} {t('FOOTER.FAQ')}
        </p>
      </div>
     </div>
    </footer>
  )
}
