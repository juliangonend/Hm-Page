import { Button, Form } from 'react-bootstrap'
import styles from './Contacts.module.css'

import { FaInstagram, FaPhoneAlt, FaTiktok, FaWhatsapp } from 'react-icons/fa';
interface OnOpenInterface{
    onOpen:any
}
export const Contacts : React.FC<OnOpenInterface> = ({onOpen}) => {

  return (
    <div className={`${styles.contactsContainer}`} id="contacts" >
      <div className={`${styles.backgroundContainer}`}></div>
      <div className={`${styles.containerText} h-100 `}>
        <h2 className={styles.contactsTitle}>Vivi la Experiencia Hockey Management</h2>
        <p className={``}>Completá tu mail y te contaremos cómo formar parte</p>
        <Form className={styles.form}>
          {/* <Form.Control type="email" /> */}
          <Button className={styles.button} style={{backgroundColor: 'var(--primary-color)',}} onClick={onOpen}> Contactanos</Button>
        </Form>
        <div className={styles.socialMedia}>
            <a href="tel:+542616683140" 
              target="_blank" rel="noreferrer"><FaPhoneAlt   size={40} color="white" /></a>
            <a href="https://www.instagram.com/hockeymanagement?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" ><FaInstagram size={40} color="white" /></a>
            <a href="https://www.tiktok.com/@hockeymanagement?is_from_webapp=1&sender_device=pc" 
              target="_blank" ><FaTiktok size={40} color="white" /></a>
            <a   href="https://wa.me/542616683140?text=Hola%2C%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Hockey%20Management."
            target="_blank" rel="noreferrer"><FaWhatsapp size={40} color="white" /></a>
        </div>
      </div>
     </div>
  )
}
