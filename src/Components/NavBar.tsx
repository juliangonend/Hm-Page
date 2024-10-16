import { Container, Nav, Navbar } from 'react-bootstrap'

export const NavBar = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary start" bg="dark" data-bs-theme="dark" style={{height:'8vh'}} sticky='top'>
      <Container>
        <Navbar.Brand href="#">
            <img src="./public/logo-hm.png" alt=""
            style={{width:"15%", marginRight:"5%"}} />
            Hockey Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" >
          <Nav className="me-auto">
            <Nav.Link href="#aboutUs">Sobre Nosotros</Nav.Link>
            <Nav.Link href="#campus">Campus</Nav.Link>
            <Nav.Link href="#ourServices">Nuestros Servicios</Nav.Link>
            <Nav.Link href="#contact">Contactos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
