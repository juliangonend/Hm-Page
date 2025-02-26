import { Carousel } from 'react-bootstrap'
import style from "./Header.module.css"

export const Header = () => {
  return (
    <>
    <Carousel  className={style.carrusel} >
      <Carousel.Item className="d-block w-100 h-100">
         <div  className={style.carruselImage}>
         <img src="../public/header/img-1.jpeg" alt="" />
         </div>
      {/* <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption> */}
      </Carousel.Item>
      <Carousel.Item>
         <div className={style.carruselImage}>
            <img src="../public/header/img-4.jpeg" alt="" />
         </div>
      {/* <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption> */}
      </Carousel.Item>
      <Carousel.Item>
      <div className={style.carruselImage}>
        <img src="../public/header/img-3.jpeg" alt="" className={style.carruselImage}/>
      </div>
        {/* <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption> */}
      </Carousel.Item>
    </Carousel>
    </>
  )
}
