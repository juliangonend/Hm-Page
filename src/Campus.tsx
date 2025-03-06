import { Col, Container, Row } from 'react-bootstrap';

export const Campus = () => {
  return (
   <div className='w-100 align-items-center' id="campus">
      <Container fluid className='w-100 px-0 ' style={{backgroundColor:'black'}}>
        <Row className='w-100 m-0'>
          <Col md={6} className="p-0 d-flex justify-content-center align-items-center" style={{height:'100%'}}>
            <img src="/canpus.jpeg" alt="" className="img-fluid"  />
          </Col>
          <Col md={6} style={{color:'white'}} className='d-flex flex-column justify-content-start mt-4 gap-5'>
            <h3 className='text-center'>Campus Mensuales</h3>
            <div className='h-90'>
            <ul className='d-flex flex-column justify-content-around h-100 align-item-center' style={{listStyle:'none', gap: '20px', paddingLeft: '5%'}}>
              <li>
                <div className='d-flex align-items-center' style={{gap: '10px'}}>
                  <span className="material-symbols-outlined">done_outline</span>
                  <h4>Mejoramos tus Habilidades</h4>
                </div>
              </li>
              <li>
                <div className='d-flex align-items-center' style={{gap: '10px'}}>
                  <span className="material-symbols-outlined">done_outline</span>
                  <h4>Grupos Reducidos</h4>
                </div>
              </li>
              <li>
                <div className='d-flex align-items-center' style={{gap: '10px'}}>
                  <span className="material-symbols-outlined">done_outline</span>
                  <h4>Para todas las edades y jugadores/as</h4>
                </div>
              </li>
              <li>
                <div className='d-flex align-items-center' style={{gap: '10px'}}>
                  <span className="material-symbols-outlined">done_outline</span>
                  <h4>Sede en Santiago, Chile y Mendoza, Argentina</h4>
                </div>
              </li>
            </ul>
            </div>
          </Col>
        </Row>
      </Container>
</div>
  );
}
