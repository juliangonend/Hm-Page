import { Carousel } from 'react-bootstrap'
import style from "./Header.module.css"

export const Header = () => {
  return (
    <>
    <Carousel  className={style.carrusel} >
      <Carousel.Item className="d-block w-100 h-100">
         <div  className={style.carruselImage}>
         <img src="./header/header-1.webp" alt="" />
         <h3 className={style.title}>SE JUEGA COMO<br/> SE ENTRENA</h3>
         </div> 
      </Carousel.Item>
      <Carousel.Item>
         <div className={style.carruselImage}>
            <img src="./header/header-2.webp" alt="" />
         <h3  className={style.title}>SE JUEGA COMO<br/> SE ENTRENA</h3>
         </div>
      </Carousel.Item>
      {/* <Carousel.Item>
      <div className={style.carruselImage}>
        <img src="./header/header-3.jpg" alt="" className={style.carruselImage}/>
      </div>
        <Carousel.Caption>
         <h3  className={style.title}>SE JUEGA COMO<br/> SE ENTRENA</h3>
        </Carousel.Caption> 
      </Carousel.Item> */}
    </Carousel>
    </>
  )
}
