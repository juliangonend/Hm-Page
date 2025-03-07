import { Card } from "./Card"


export const CoFunders = () => {
  return (
   <>
    <div style={{marginTop:'20px' , marginRight:'10px', marginLeft:'10px'}}>
        <h2 className='w-100 d-flex justify-content-center'>Co-Fundadores</h2>
         <div className='d-flex w-100 justify-content-center align-items-center flex-wrap'>
            <Card title='Jose Gonzalez'
             img='./card/card-2.jpeg' 
            text={['entrenador platel superior UNCUYO','coordinar seleccionados menores Mendoza','Ex-entrenador leoncitas en JJOO']}
            />
            <Card title='Cristian Gonzalez ' 
            img='./card/card-1.jpeg' 
            text={['Entrenador plantel superior Club Hockey Sanse Complutense','Ex-asistente seleccionado mayor caballeros Chile','Ex-coordinador PWCC']}
            />
         </div>
   </div>
   </>
  )
}
