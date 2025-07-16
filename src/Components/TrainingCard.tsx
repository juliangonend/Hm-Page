import React from 'react'
import styles from "./TrainingCard.module.css"
import { Button } from 'react-bootstrap';
import '././globalsStyles.css'
interface TrainingProps{
    title: string;
    text:string;
    active:boolean
}
export const TrainingCard : React.FC<TrainingProps> = ({title,text, active }) => {
   const handleScrollToContact = () => {
    const section = document.getElementById('contacts');
    section?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    
    <div className={styles.Container} style={{display:active?'block':'none'}}>
            <h2>{title}</h2>
            <p>{text}</p> 
            <Button className='w-50' style={{backgroundColor:'var(--primary-color'}} onClick={handleScrollToContact}>Contactanos</Button>
    </div>

  )
}
