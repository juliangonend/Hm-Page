import React from 'react'
import styles from "./TrainingCard.module.css"
import { Button } from 'react-bootstrap';
import '././globalsStyles.css'
interface TrainingProps{
    title: string;
    text:string;
    active:boolean;
    onOpen:any;
}
export const TrainingCard : React.FC<TrainingProps> = ({title,text, active, onOpen }) => {
  //  const handleScrollToContact = () => {
  //   const section = document.getElementById('contacts');
  //   section?.scrollIntoView({ behavior: 'smooth' });
  // };
  return (
    
    <div className={styles.Container} style={{display:active?'block':'none'}}>
            <h2>{title}</h2>
            <p>{text}</p> 
            <Button className={styles.button}  onClick={onOpen}>Contactanos</Button>
    </div>

  )
}
