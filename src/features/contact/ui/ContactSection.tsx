import { useRef } from 'react'
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { ContactForm } from './ContactForm'
import { SectionTitle } from '../../../shared/ui/SectionTitle'
import { revealUp, useGsap } from '../../../shared/motion'
import styles from './ContactSection.module.css'

const CHANNELS = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/542616683140?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Hockey%20Management.',
    Icon: FaWhatsapp,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/hockeymanagement?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    Icon: FaInstagram,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@hockeymanagement?is_from_webapp=1&sender_device=pc',
    Icon: FaTiktok,
  },
]

export const ContactSection = () => {
  const ref = useRef<HTMLElement>(null)

  useGsap(ref, (ctx) => {
    revealUp(ctx, ctx.scope.querySelectorAll('[data-reveal]'), ctx.scope)
  })

  return (
    <section ref={ref} id="contacts" className={`section ${styles.section}`} aria-labelledby="contact-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <SectionTitle id="contact-title" text="Viví la experiencia Hockey Management" className={styles.title} />
          <p className={styles.lead} data-reveal>
            Completá tus datos y seguimos la charla por WhatsApp para contarte cómo formar parte.
          </p>
          <ul className={styles.channels}>
            {CHANNELS.map(({ label, href, Icon }) => (
              <li key={label} data-reveal>
                <a href={href} target="_blank" rel="noreferrer" className={styles.channel}>
                  <Icon aria-hidden="true" size={18} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card} data-reveal>
          <h3 className={styles.cardTitle}>Quiero sumarme</h3>
          <ContactForm variant="inline" />
        </div>
      </div>
    </section>
  )
}
