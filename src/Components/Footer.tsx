import {  Col, Container } from 'react-bootstrap'
// import { CiInstagram } from 'react-icons/ci'
// import { FaWhatsapp } from 'react-icons/fa'

export const Footer = () => {
  return (
    <div>
      <Container fluid className='w-100 p-0 py-3 align-items-center d-flex flex-column justify-content-center m-0 text-center' style={{background:'var( --dark-blue-color)', color:'white'}}>
        {/* <Row className='w-100 align-items-center justify-content-center m-0 text-center'> */}
          <Col  className='p-0 '><h3>Hockey Managament</h3>
          </Col>
          <Col className='p-0'><p>Se juega como se Entrena</p></Col>
          <Col className='p-0'>
             © {new Date().getFullYear()} Hockey Managament. Todos los derechos reservados.
          </Col>

      </Container>
    </div>
  )
}
