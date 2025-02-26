import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { CiInstagram } from 'react-icons/ci'
import { FaWhatsapp } from 'react-icons/fa'

export const Footer = () => {
  return (
    <div>
      <Container fluid className='w-100 p-0 py-3 align-items-center d-flex flex-column justify-content-center m-0 text-center' style={{background:'black', color:'white'}}>
        {/* <Row className='w-100 align-items-center justify-content-center m-0 text-center'> */}
          <Row  className='p-0 '><h3>Hockey Managament</h3>
          </Row>
          <Row className='p-0'><p>Se juega como se Entrena</p></Row>
          {/* <Row  className='p-0 w-50 '>
            <Col md={8} className='text-center fs-5'>Contactanos</Col>
            <Col md={2} className='text-end'><Button variant="outline-light" className='fs-4'><CiInstagram/></Button></Col>
            <Col md={2} className='text-start'><Button variant="outline-light" className='fs-4'><FaWhatsapp/></Button></Col>
          </Row> */}
        {/* </Row> */}
      </Container>
    </div>
  )
}
