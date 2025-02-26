import React, { useState } from 'react';
import styles from './Card.module.css'
import { Button } from 'react-bootstrap';
import 'animate.css';
interface CardProps {
    title: string;
    img: string;
    text:string[];
  }

export const Card: React.FC<CardProps> = ({title, img , text}) => {
  const [activeCard , setActiveCard] = useState(true)
  const [isRotating, setIsRotating] =useState(false);
  const handleChangeCard=()=>{
      setIsRotating(true)
    setTimeout(()=>{
      setActiveCard(!activeCard);
      setIsRotating(false);
    }, 300)
  }
  return (
    <div className={`${styles.card}`}>
       {activeCard ?  <div className={styles.cardContainer}>
            <div className={styles.cardImg}>
                <img src={img} alt="" />
            </div>
            <div className={styles.cardText}>
                <h2>{title}</h2>
                {/* <p>{text}</p> */}
                <Button onClick={handleChangeCard} variant='outline-dark'>Carrera</Button>
            </div>
        </div>
        : <div className={`${styles.cardContainer} bg-dark justify-content-center ` } style={{opacity:'.9'}}>
        <div className={`${styles.cardTextBack} animate__animated animate__backInLeft `}>
            <h2 className=''>{title}</h2>
            <ul>
              {text.map((item,index)=>(
                <li key={index}>{item}</li>
              ))}
            </ul>
            <Button onClick={handleChangeCard} variant='outline-primary'>{activeCard ? 'Carrera' : 'Volver'}</Button>
        </div>
    </div>
    }
    </div>
  )
}
