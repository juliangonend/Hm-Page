import React from 'react'
import styles from "./TrainingCard.module.css"
import { Button } from 'react-bootstrap';
import '././globalsStyles.module.css'
interface TrainingProps{
    title: string;
    text:string;
    active:boolean
}
export const TrainingCard : React.FC<TrainingProps> = ({title,text, active }) => {
  return (
    
    <div className={styles.Container} style={{display:active?'block':'none'}}>
            <h2>{title}</h2>
            <p>{text}</p> 
            <Button className='w-50' style={{backgroundColor:'var(--primary-color'}}>Contactanos</Button>
    </div>

  )
}
