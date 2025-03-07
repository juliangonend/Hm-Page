
import { Col, Container, Row } from 'react-bootstrap'
import styles from './Team.module.css'
export const Team = () => {
  return (
    <div className='w-100' id="teams">
    <Container fluid className='w-100 px-0   bg-dark' >
      <Row className='w-100'>
        <Col md={6} style={{color:'white'}} className='d-flex flex-column justify-content-start mt-5 px-5 gap-3'>
          <h3>Equipos</h3>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga minus vitae ut nemo dolorem perferendis a obcaecati quidem magnam, eius aperiam et, cupiditate pariatur itaque consequatur atque repellendus veritatis officia?</p>
          <ul className='d-flex flex-column  h-90' style={{listStyle:'none', gap: '20px', paddingLeft: 0}}>
            <li>
              <div className='d-flex align-items-center' style={{gap: '10px'}}>
                <span className="material-symbols-outlined">done_outline</span>
                <h4>Coordinacion
                </h4>
              </div>
            </li>
            <li>
              <div className='d-flex align-items-center' style={{gap: '10px'}}>
                <span className="material-symbols-outlined">done_outline</span>
                <h4>Asesoramientos</h4>
              </div>
            </li>
            <li>
              <div className='d-flex align-items-center' style={{gap: '10px'}}>
                <span className="material-symbols-outlined">done_outline</span>
                <h4>Capacitaciones</h4>
              </div>
            </li>
            <li>
              <div className='d-flex align-items-center' style={{gap: '10px'}}>
                <span className="material-symbols-outlined">done_outline</span>
                <h4>Giras Deportivas</h4>
              </div>
            </li>
          </ul>
        </Col>
        <Col  md={6}  className="d-grid justify-content-center" style={{ placeItems: 'center' }}>
         <div className="" style={{color:'white', fontFamily:'20px'}}>Algunos Equipos que confiaron en nosotros</div>
         <Row className={`justify-content-center `}>
            <Col xs={4}>
              <img src="./logos/pwcc.jpeg" className={`img-fluid ${styles.teamImg}`} alt="" />
            </Col>
            <Col xs={4}>
              <img src="./logos/regatas.png" className={`img-fluid ${styles.teamImg}`} alt=""  />
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col xs={4}>
              <img src="./logos/regatas.png" className={`img-fluid ${styles.teamImg}`} alt="" />
            </Col>
            <Col xs={4}>
              <img src="./logos/pwcc.jpeg" className={`img-fluid ${styles.teamImg}`} alt="" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
 </div>
  )
}
