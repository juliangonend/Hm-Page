import {  Col, Container, Row } from 'react-bootstrap';
import style from './Campus.module.css'
import './Components/globalsStyles.css';
import { TrainingCard } from './Components/TrainingCard';
import { useState } from 'react';
export const Campus = () => {
  const [cardActive, setCardActive] = useState([true,false,false,false]) 
const changeActive = (id: number) => {
  const newCardActive = cardActive.map((_, index) => index === id);
  setCardActive(newCardActive);
};

  return (
    <div className={`w-100 align-items-center ${style.campusContainer}`} id="ourServices">
      <Container fluid className='w-100 py-5 px-4  mt-4 '>
        <Row className='w-100 m-0 h-100'>
            <Col md={6}  className={`${style.textContainer} `}  >
                <div className={`${style.title}  d-flex flex-column py-1  justify-content-between  `}>
                     <h3>Mucho mas que <br/><b>Entrenamientos de Hockey </b></h3>
                    <p>En Hockey Management nos enfocamos en el perfeccionamiento integral de cada jugador y jugadora, adaptando los entrenamientos a su nivel. Contamos con prácticas específicas de psicomotricidad, arrastre, técnicas para jugadores de campo, arqueros y mucho más.</p>
                    <div className={`${style.nav} `}>
                      <div className={`${style.cardNav} `}>
                        <button className={`${style.button} ${cardActive[0] ? `${style.active}` : ''}`}  onClick={()=>changeActive(0)}>Jugadores</button>
                      </div>
                      <div className={`${style.cardNav} `}>
                        <button className={`${style.button} ${cardActive[1] ? `${style.active}` : ''}`}  onClick={()=>changeActive(1)}>Arqueros</button>
                      </div>
                      <div className={`${style.cardNav} `}>
                        <button className={`${style.button} ${cardActive[2] ? `${style.active}` : ''}`}  onClick={()=>changeActive(2)}>Psicomotricidad</button>
                      </div>
                      <div className={`${style.cardNav} `}>
                        <button className={`${style.button} ${cardActive[3] ? `${style.active}` : ''}`}  onClick={()=>changeActive(3)}>Arrastradores</button>
                      </div>
                    </div>
                </div>

                <div className={style.cardContainer}>
                     <TrainingCard 
                    title="Arqueros" 
                    text="Desarrollá todo tu potencial como arquero con entrenamientos 
                    técnicos, tácticos y coordinativos, guiados por un especialista. 
                    Con grupos reducidos, adaptados a todas las edades y niveles, vas 
                    a llegar al nivel que buscás."
                    active={cardActive[0]}
                    />
                     <TrainingCard 
                    title="Jugadores" 
                    text="Llevá tu juego al siguiente nivel con entrenamientos enfocados 
                    en cada aspecto individual: defensa, definición, habilidades aéreas, 
                    técnicas 3D, posturas y mucho más. Formate como un jugador Hockey Management.
                    Para todos los niveles, desde los 11 años en adelante."
                    active={cardActive[1]}
                    />
                     <TrainingCard 
                      title="Psicomotricidad" 
                      text="A través del juego y el movimiento, trabajamos la coordinación,
                       el equilibrio, la postura y el control corporal. Nuestros entrenamientos
                        de psicomotricidad están pensados para que los niños y niñas de hasta 10 
                        años desarrollen habilidades fundamentales para crecer 
                        con una buena base para el hockey."
                        active={cardActive[2]}
                    />

                     <TrainingCard 
                    title="Arrastradores"               
                    text="Entrenamientos especializados en arrastre, perfeccioná tu técnica para marcar 
                    la diferencia en cada partido."
                    active={cardActive[3]}
                    />
                </div>
             </Col>
          <Col md={6} className={`p-0 d-flex justify-content-center align-items-center ${style.imgContainer}`}  style={{height:'100%'}}>
            <img src="./campus2.jpg" alt="" className={`img-fluid ${style.img}`}  />
          </Col>

        </Row>
      </Container>
</div>
  );
}
