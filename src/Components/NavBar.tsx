import { Container, Nav, Navbar } from 'react-bootstrap'
import styles from './NavBar.module.css'
export const NavBar = () => {
  return (
    <Navbar expand="lg" className={`start ${styles.nav}`} data-bs-theme="dark"  fixed='top'>
      <Container>
        <Navbar.Brand href="#" className={styles.navbarTitle}>
            <img src="./logo-hm.png" alt=""
            style={{width:"15%", marginRight:"5%"}} />
            Hockey Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className='w-25' />
        <Navbar.Collapse id="basic-navbar-nav" className={styles.navCollapseMobile}>
          <Nav className="me-auto ">
            <Nav.Link className={styles.navLinks} href="#aboutUs">Sobre Nosotros</Nav.Link>
            <Nav.Link className={styles.navLinks} href="#ourServices">Nuestros Entrenamientos</Nav.Link>
            <Nav.Link className={styles.navLinks} href="#teams">Equipos</Nav.Link>
            <Nav.Link className={styles.navLinks} href="#co-funders">Entrenadores</Nav.Link>
            <Nav.Link className={styles.navLinks} href="#contacts">Contactos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
