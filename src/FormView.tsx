import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Components/globalsStyles.css';
import styles from './FormView.module.css';
import { FaTimes  } from 'react-icons/fa';
import emailjs from '@emailjs/browser'
import { useRef, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
export const FormView =({onClose})=>{
  const[showSpinner, setShowSpinner]= useState(false);
    const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const[alertMessage,setAlertMessage]= useState(true)
  const form =  useRef<HTMLFormElement | null>(null)
  const enviarCorreo = (e) => {
    setShowSpinner(true)
    e.preventDefault();
     if (!form.current) return; 
    emailjs.sendForm('service_7uu73vr', 'template_f3fn78p', form.current, 'IL-G6_SY4KHMiCCqM')
      .then((result) => {
        setAlertMessage(true)
        setShowAlert(true)
        setShowSpinner(false)
      }, (error) => {
        setAlertMessage(false)
        setShowAlert(true)
        setShowSpinner(false)
      }).finally(()=>{
        setTimeout(()=>{
            setShowAlert(false)
            onClose()
        }, 3000)
      });
  };

    return (

       <div className={styles.container}>
        {showAlert ? ( <Alert variant="primary" className={styles.alerts}>
            {alertMessage? ' ¡Formulario enviado correctamente!' : '¡Error al Enviar el formulario !'}
        </Alert>): <></>}
         <Form className={styles.form} ref={form}  onSubmit={enviarCorreo}>
            <Form.Group className="my-3" controlId="formEmail">
        <div className={styles.controlContainer}>
          <Form.Label className={styles.label}>Correo</Form.Label>
          <Form.Control
            required
            type="email"
            name="user_email"
            placeholder="email@email.com"
            className={styles.control}
            style={{ maxWidth: '100%', paddingLeft: '25px' }}
          />
          <Form.Control.Feedback type="invalid">
            Ingresá un correo válido.
          </Form.Control.Feedback>
        </div>
      </Form.Group>

      {/* Nombre */}
      <Form.Group className="mb-3" controlId="formNombre">
        <div className={styles.controlContainer}>
          <Form.Label className={styles.label}>Nombre</Form.Label>
          <Form.Control
            required
            type="text"
            name="user_nombre"
            placeholder="Tu nombre"
            className={styles.control}
            style={{ maxWidth: '100%', paddingLeft: '25px' }}
          />
          <Form.Control.Feedback type="invalid">
            El nombre es obligatorio.
          </Form.Control.Feedback>
        </div>
      </Form.Group>

      {/* Motivo */}
      <Form.Group className="mb-3" controlId="formMotivo">
        <div className={styles.controlContainer}>
          <Form.Label className={styles.label}>Motivo de Consulta</Form.Label>
          <Form.Select
            required
            name="user_motivo"
            className={styles.control}
            defaultValue=""
          >
            <option value="" disabled>Seleccioná un motivo</option>
            <option> CAMPUS</option>
            <option> PERSONALIZADOS</option>
            <option> ARQUEROS</option>
            <option> JUGADORES</option>
            <option> PSICOMOTRICIDAD</option>
            <option> ASESORAMIENTO</option>
            <option> GIRAS</option>
            <option> OTRO</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Seleccioná un motivo de consulta.
          </Form.Control.Feedback>
        </div>
      </Form.Group>

      {/* Mensaje */}
      <Form.Group className="mb-3" controlId="formMensaje">
        <div className={styles.controlContainer}>
          <Form.Label className={styles.label}>Mensaje</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={3}
            name="message"
            className={styles.control}
            style={{ maxWidth: '100%', paddingLeft: '25px' }}
          />
          <Form.Control.Feedback type="invalid">
            El mensaje no puede estar vacío.
          </Form.Control.Feedback>
        </div>
      </Form.Group>

             <div className={styles.buttonContainer}>
                <Button className={styles.buttonReverse} onClick={onClose}>
                    <FaTimes    size={20} color="white" />
                </Button>
                {!showSpinner ?(

                    <Button className={styles.button} type="submit">
                    Enviar
                </Button>
                ):(

                    <Button className={styles.button}  disabled>
                    <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    />
                    Enviando ...
                </Button>
                )
                }
             </div>
        </Form>
       </div>
    )
}