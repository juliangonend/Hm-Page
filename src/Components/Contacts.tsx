import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import styles from './Contacts.module.css'
import emailjs from "@emailjs/browser";
import { useRef } from 'react';
export const Contacts = () => {
  const form = useRef(null);
  const sendEmail = (e:any) => {
    e.preventDefault();
    if(typeof form.current === 'string'){
      emailjs
      .sendForm('service_7uu73vr', 'template_f3fn78p', form.current, {
        publicKey: 'IL-G6_SY4KHMiCCqM',
      })
      .then(
        () => {
          alert('Enviado Correctamente ');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
    }
 
  }
  return (
    <div className={`w-100 ${styles.contactsContainer}`} id="contacts" >
       <Container fluid className="w-100 px-0 py-5">
      <Row className="w-100">
        <Col md={6} className="d-flex flex-column justify-content-start  px-5   aling-items-center">
          <h3>Contactanos</h3>
          <ul className="d-flex flex-column h-100" style={{ listStyle: 'none', gap: '20px', paddingLeft: 0 }}>
            <li>
              <div className="d-flex align-items-center flex-wrap" style={{ gap: '10px' , padding:'10px' }}>
                <p className={styles.contactsTitle}>Email :</p>
                <p className={styles.contacts}>hockeymanagementhm@gmail.com</p>
              </div>
            </li>
            <li>
              <div className="d-flex align-items-center flex-wrap" style={{ gap: '10px' , padding:'10px' }}>
                <p className={styles.contactsTitle}>Teléfono :</p>
                <p>(+54) 2616565713</p>
              </div>
            </li>
            <li>
              <div className="d-flex align-items-center flex-wrap" style={{ gap: '10px' , padding:'10px' }}>
                <p className={styles.contactsTitle}>Instagram :</p>
                <a href="https://www.instagram.com/tu_usuario" target="_blank" rel="noopener noreferrer">@hockeymanagement</a>
              </div>
            </li>
          </ul>
        </Col>
        <Col md={6} className="d-flex justify-content-center align-items-center px-5">
          <Form style={{ width: '100%' }} onSubmit={sendEmail} ref={form}>
            <Row className="mb-3 g-3">
              <Col md={6}>
                <Form.Group controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control  required type="text" placeholder="Nombre" name='user_nombre'  />
                  <Form.Control.Feedback type="invalid">
                  ¡Este campo es obligatorio!
                </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="apellido">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control type="text" placeholder="Apellido" name='user_apellido' />
                  <Form.Control.Feedback type="invalid">
                  ¡Este campo es obligatorio!
                </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3 g-3">
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control required type="email" placeholder="name@example.com" name='user_email' />
                  <Form.Control.Feedback type="invalid">
                  ¡Este campo es obligatorio!
                </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="telefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control required type="number" placeholder="123-456-7890"  name='user_telefono'/>
                  <Form.Control.Feedback type="invalid">
                  ¡Este campo es obligatorio!
                </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3 g-3">
              <Col md={12}>
              <Form.Group controlId="motivo">
                  <Form.Label>Motivo</Form.Label>
                  <Form.Select required aria-label="Default select example" name='user_motivo'>
                  <option>Seleccionar motivo ...</option>
                  <option value="Asesoramiento de Entidades Deportivas">Asesoramiento de Entidades Deportivas</option>
                  <option value="Giras Deportivas">Giras Deportivas</option>
                  <option value="Entrenamientos Personalizados">Entrenamientos Personalizados</option>
                  <option value="Entrenamientos Mensuales ">Entrenamientos Mensuales </option>
                  <option value="Campus Verano ">Campus Verano </option>
                </Form.Select>

                </Form.Group>
              </Col>
             
            </Row>

            <Form.Group className="mb-3 g-3" controlId="textarea">
              <Form.Label>Mensaje</Form.Label>
              <Row className="d-flex justify-content-center align-items-center">
                <Col className='text-center '>
                    <Form.Control  as="textarea" rows={3} style={{resize: 'none'}} name='message'/>
                </Col>
              </Row>
            </Form.Group>
            <Button type="submit" className='mb-3'>Enviar</Button>
          </Form>
        </Col>
      </Row>
    </Container>
 </div>
  )
}
