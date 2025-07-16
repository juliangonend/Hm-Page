import { Card } from "./Card"

import styles from './CoFunders.module.css'
export const CoFunders = () => {
  return (
   <>
    <div style={{margin:'20px'}} id="co-funders">
        <h2 className='w-100  text-center fs-1'>Co-Fundadores</h2>
         <div className={styles.conFundersContainer}>
            <Card name='Jose' lastName="Gonzalez"          
               img='./jose-sinfondo3.webp' 
            text={['Primera división damas -UNCUYO','Head Coach Damas AMHSC','Director Regional CAH Centro-cuyo']}
            />
            <Card name='Cristian' lastName="Gonzalez" 
            img='./cristianfoto3.webp'
            text={['Primera división Honor Club Hockey Sanse Complutense','Ex-asistente seleccionado mayor caballeros Chile','Ex-coordinador PWCC']}
            />
         </div>
   </div>
   </>
  )
}
