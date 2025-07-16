import { Container, Nav, Navbar } from 'react-bootstrap'
import styles from './NavBar.module.css'
export const NavBar = () => {
  return (
    <Navbar expand="lg" className={`start ${styles.nav}`} data-bs-theme="dark"  fixed='top'>
      <Container>
        <Navbar.Brand href="#" className={styles.navbarTitle}>
            <img src="./logo-hm.png" alt=""
            style={{width:"15%", marginRight:"5%"}} />
            Hockey Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="me-auto ">
            <Nav.Link href="#aboutUs">Sobre Nosotros</Nav.Link>
            <Nav.Link href="#campus">Campus</Nav.Link>
            <Nav.Link href="#ourServices">Nuestros Entrenamientos</Nav.Link>
            <Nav.Link href="#teams">Equipos</Nav.Link>
            <Nav.Link href="#contacts">Contactos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
