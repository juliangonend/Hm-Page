import { Button, Form, Row } from 'react-bootstrap'
import styles from './Contacts.module.css'
import emailjs from "@emailjs/browser";
import { useRef } from 'react';
import { FaInstagram, FaMobileAlt, FaPhoneAlt, FaTiktok, FaWhatsapp } from 'react-icons/fa';
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
    <div className={`${styles.contactsContainer}`} id="contacts" >
      <div className={`${styles.backgroundContainer}`}></div>
      <div className={`${styles.containerText} h-100 `}>
        <h2 className={styles.contactsTitle}>Vivi la Experiencia Hockey Management</h2>
        <p className={``}>Completá tu mail y te contaremos cómo formar parte</p>
        <Form className={styles.form}>
          <Form.Control type="email" placeholder="email@email.com" style={{ maxWidth: '400px' , paddingLeft:'25px'}} />
          <Button className={styles.button} style={{backgroundColor: 'var(--primary-color)',}} type="submit">Enviar</Button>
        </Form>
        <div className={styles.socialMedia}>
            <FaPhoneAlt   size={40} color="white" />
            <FaInstagram size={40} color="white" />
            <FaTiktok size={40} color="white" />
            <FaWhatsapp size={40} color="white" />
        </div>
      </div>
     </div>
  )
}
