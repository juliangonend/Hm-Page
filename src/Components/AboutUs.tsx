
import styles from "./AboutUs.module.css"
import { AboutUsCard } from './AboutUsCard'
export const AboutUs = () => {
  return (
    <>
    <div id="aboutUs" style={{margin:'2% 0',gap:'3vh'}} className='d-flex flex-column justify-content-center w-100 align-items-center'>
        <h2 className='d-flex justify-content-center w-100'>Sobre Nosotros</h2>
        <div className= {styles.containerText}>
            <p >Somos un equipo de entrenadores dedicados a mejorar el rendimiento tanto de los jugadores como de los equipos y clubes. Nuestro enfoque se basa en optimizar cada aspecto del deporte, asegurándonos de que el progreso individual y colectivo se refleje en el desempeño en el campo. Por eso, nuestro lema es: Se juega como se entrena.</p>
        </div>
        <div className="w-100 d-flex align-items-center justify-content-center flex-wrap gap-5">
            <AboutUsCard logo='person' title='Jugador' text='entrenamientos personalizados para todos los jugadores y edades '/>
            <AboutUsCard logo='groups' title='Equipos' text='dirección , asesoramiento y coordinacion de clubes , seleccionados ,etc'/>
            <AboutUsCard logo='map' title='Giras Deportivas' text='organizamos y coordinamos girar deportivas personalizadas'/>
        </div>
    </div>

    </>
  )
}
