import { Button, Form } from 'react-bootstrap'
import styles from './Contacts.module.css'

import { FaInstagram, FaPhoneAlt, FaTiktok, FaWhatsapp } from 'react-icons/fa';
export const Contacts = () => {

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
