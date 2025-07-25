import { Button, Col, Container, Row } from "react-bootstrap"
import style from "./AboutUs.module.css";
import './globalsStyles.css';
interface OnOpenInterface{
    onOpen:any
}
export const AboutUs : React.FC<OnOpenInterface>  = ({onOpen}) => {

  return (
    <>
    <Container fluid id="aboutUs" style={{margin:'2% 0',gap:'3vh', height:'50' }} className='d-flex flex-column  w-100 align-items-center'>
      <Row className="w-100 m-0">
            <Row className="top">
        <Col className={style.imgContainer} md={6}>
          <img src="./judarora-sinfondo.webp" alt=""  className={style.img}/>
        </Col>
        <Col md={6}>
           <Container className="text d-grid w-100 h-100 p-5">
              <h2>Sobre Hockey Management</h2>
              <p>
              Vivimos el hockey con pasión y compromiso. Nos dedicamos a acompañar a jugadores, jugadoras y clubes en su crecimiento, ofreciendo servicios diseñados para impulsar una mejora constante y sostenida a lo largo del tiempo.
            </p>
            <Button  className={style.button}  onClick={onOpen}>Contactanos</Button>
            </Container>
           </Col>
        </Row>
          <Row className={`${style.bottom} text-white text-center py-4 `}>
            <Col md={6}>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={3} sm={6} className="mb-3">
                  <span className="fs-1 d-block">3</span>
                  <p>Sedes en Argentina, Chile y España</p>
                  {/* <p className={style.border}></p> */}
                </Col>
                <Col md={3} sm={6} className="mb-3">
                  <span className="fs-1 d-block">2000+</span>
                  <p>Jugadores</p>
                </Col>
                <Col md={3} sm={6} className="mb-3">
                  <span className="fs-1 d-block">10+</span>
                  <p>Giras deportivas realizadas</p>
                </Col>
                <Col md={3} sm={6} className="mb-3">
                  <span className="fs-1 d-block">13+</span>
                  <p>Años de trayectoria</p>
                </Col>
              </Row>
            </Col>
            </Row>


      </Row>
    </Container>

    </>
  )
}
