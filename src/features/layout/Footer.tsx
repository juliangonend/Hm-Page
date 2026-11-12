import { NAV_LINKS } from './navLinks'
import styles from './Footer.module.css'

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div>
        <p className={styles.brand}>HOCKEY MANAGEMENT</p>
        <p className={styles.tagline}>SE JUEGA COMO SE ENTRENA</p>
      </div>
      <nav aria-label="Pie de página">
        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
    <p className={styles.copy}>© {new Date().getFullYear()} Hockey Management. Todos los derechos reservados.</p>
  </footer>
)
