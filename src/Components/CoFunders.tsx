import { Card } from "./Card"


export const CoFunders = () => {
  return (
   <>
    <div style={{margin:'20px'}}>
        <h2 className='w-100  text-center fs-1'>Co-Fundadores</h2>
         <div className='d-flex w-100 justify-content-center align-items-center flex-wrap gap-5'>
            <Card name='Jose' lastName="Gonzalez"          
               img='./jose-sinfondo2.png' 
            text={['Primera división damas -UNCUYO','Head Coach Damas AMHSC','Director Regional CAH Centro-cuyo']}
            />
            <Card name='Cristian' lastName="Gonzalez" 
            img='./cristianfoto2.png'
            text={['Primera división Honor Club Hockey Sanse Complutense','Ex-asistente seleccionado mayor caballeros Chile','Ex-coordinador PWCC']}
            />
         </div>
   </div>
   </>
  )
}
