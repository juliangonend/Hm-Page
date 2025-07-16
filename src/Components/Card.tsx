import React, { useState } from 'react';
import styles from './Card.module.css'
import { Button } from 'react-bootstrap';
import 'animate.css';
interface CardProps {
    name: string;
    lastName: string;
    img: string;
    text:string[];
  }

export const Card: React.FC<CardProps> = ({name,lastName, img , text}) => {

  return (
    <div className={`${styles.card}`}>
      <div className={styles.cardContainer}>

            <div className={styles.cardText}>
                <h2><span className={styles.name}>{name}</span> <span className={styles.lastName}>{lastName}</span></h2>
                <div className={styles.textContainer}> <p>Entrenador</p></div>
                 <ul>
              {text.map((item,index)=>(
                <li key={index}>{item}</li>
              ))}
            </ul>
            </div>
                        <div className={styles.cardImg}>
                <img src={img} alt="" />
            </div>
        </div>
       
    </div>
  )
}
