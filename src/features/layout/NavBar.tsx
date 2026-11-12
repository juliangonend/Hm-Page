import { useEffect, useState } from 'react'
import { NAV_LINKS } from './navLinks'
import { Wordmark } from './Wordmark'
import { Button } from '../../shared/ui/Button'
import { asset } from '../../shared/lib/asset'
import { cx } from '../../shared/lib/cx'
import { useContactModal } from '../contact/application/contactModalContext'
import { canAnimate, onIntroDone, prefersReducedMotion } from '../../shared/motion'
import styles from './NavBar.module.css'

const INTRO_FALLBACK_MS = 5000

export const NavBar = () => {
  const { openContact } = useContactModal()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(() => !canAnimate() || prefersReducedMotion())

  // Appear after the hero intro; fallback timer (or any scroll) so it never stays hidden
  useEffect(() => {
    if (visible) return
    const show = () => setVisible(true)
    const off = onIntroDone(show)
    const timer = window.setTimeout(show, INTRO_FALLBACK_MS)
    window.addEventListener('scroll', show, { once: true, passive: true })
    return () => {
      off()
      window.clearTimeout(timer)
      window.removeEventListener('scroll', show)
    }
  }, [visible])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <header className={cx(styles.nav, scrolled && styles.scrolled, visible && styles.visible)}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand} onClick={close} aria-label="Hockey Management, ir al inicio">
          <img src={asset('logo-hm.png')} alt="" width={44} height={44} className={styles.logo} />
          <Wordmark />
        </a>

        <button
          type="button"
          className={cx(styles.toggle, menuOpen && styles.toggleOpen)}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="primary-navigation" className={cx(styles.menu, menuOpen && styles.menuOpen)} aria-label="Principal">
          <ul className={styles.links}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.link} onClick={close}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            size="small"
            onClick={() => {
              close()
              openContact()
            }}
          >
            INSCRIBITE
          </Button>
        </nav>
      </div>
    </header>
  )
}
