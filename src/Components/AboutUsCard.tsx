import React from 'react'
import styles from "./AboutUsCard.module.css"
interface AboutsUsProps{
    title: string;
    logo:string;
    text:string
}
export const AboutUsCard : React.FC<AboutsUsProps> = ({logo,title,text}) => {
  return (
    
    <div className={styles.Container}>
        <div className="">
        <span class="material-symbols-outlined">
            {logo}
        </span>
        </div>
        <div className={styles.ContainerText}>
            <h2>{title}</h2>
            <p>{text}</p> 
        </div>
    </div>

  )
}
