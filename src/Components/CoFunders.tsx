import { Card } from "./Card"

import styles from './CoFunders.module.css'
export const CoFunders = () => {
  return (
   <>
    <div style={{margin:'20px'}} id="co-funders">
        <h2 className={`w-100  text-center fs-1 ${styles.title}`}>Co-Fundadores</h2>
         <div className={styles.conFundersContainer}>
            <Card name='Jose' lastName="Gonzalez"          
               img='./jose-sinfondo3.webp' 
            text={['Head Coach Damas AMHSC','Director Regional CAH Centro-cuyo' ,'Medalla de plata Juegos Olímpicos de la Juventud Singapur 2010 con Argentina',
               'Medalla de oro  Juegos Suramericanos de la Juventud 2022 sub 17 con Argentina ']}
            />
            <Card name='Cristian' lastName="Gonzalez" 
            img='./cristianfoto3.webp'
            text={['Primera división Honor Club Hockey Sanse Complutense','Medalla de Plata Panamericana 2023','Mundial Odisha 2023']}
            />
         </div>
   </div>
   </>
  )
}
