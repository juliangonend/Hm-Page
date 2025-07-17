
import { Col, Container, Row } from 'react-bootstrap'
import style from './Team.module.css'
import { useState } from 'react';
import { TrainingCard } from './TrainingCard';
import './globalsStyles.css'
export const Team = ({onOpen}) => {
    const [cardActive, setCardActive] = useState([true,false,false,false]) 
  const changeActive = (id: number) => {
    const newCardActive = cardActive.map((_, index) => index === id);
    setCardActive(newCardActive);
  };
  return (
    <div className='w-100' id="teams">
 <Container fluid className={`w-100 py-5 px-4  mt-4 `}>
        <Row className='w-100 m-0 h-100'>
            <Col md={6} className={`p-0 d-flex justify-content-center align-items-center ${style.imgContainer}`}  style={{height:'100%', overflow:'hidden'}}>
            <img src="./campus2.webp" alt="" className={`img-fluid ${style.img}`}  />
          </Col>
            <Col md={6}  className={`${style.textContainer}`}  >
                <div className={`${style.title}    `}>
                     <h3><b>Potenciamos tu club </b></h3>
                     <p>
                      En Hockey Management acompañamos a tu club con propuestas flexibles, adaptadas a su presupuesto.
                       Ofrecemos servicios presenciales y online, que pueden ser contratados de manera integral o por separado: 
                       capacitación de personal, planificación estratégica, coordinación y organización de giras deportivas. 
                       Te ayudamos a mejorar el nivel, el sentido de pertenencia y el clima de trabajo en tu institución.
                      </p>

                    <div className={`${style.nav} `}>
                      <div className={`${style.cardNav} `}>
                        <button className={`${style.button} ${cardActive[0] ? `${style.active}` : ''}`}  onClick={()=>changeActive(0)}>Asesoramiento</button>
                      </div>
                      <div className={`${style.cardNav} `}>
                        <button className={`${style.button} ${cardActive[1] ? `${style.active}` : ''}`}  onClick={()=>changeActive(1)}>Giras Deportivas</button>
                      </div>
                    </div>
                   <div className={style.cardContainer}>
                      <TrainingCard onOpen={onOpen}
                      title="Asesoramiento" 
                      text="Brindamos las herramientas necesarias para tu club, federación o asociación.
                      Planificamos, organizamos y fortalecemos la institución, capacitando al personal 
                      para alcanzar los objetivos propuestos."
                      active={cardActive[0]}
                      />
                      <TrainingCard onOpen={onOpen}
                      title="Giras Deportivas" 
                      text="Nos encargamos de organizar giras deportivas integrales para tu institución,
                      con partidos, actividades, comidas, alojamiento y más. Diseñadas para que solo se 
                      dediquen a disfrutar, y adaptadas a cualquier presupuesto y necesidad."
                      active={cardActive[1]}
                      />
                    </div>
                </div>
             </Col>


        </Row>
      </Container>
 </div>
  )
}
