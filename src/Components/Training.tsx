import {  Card } from 'react-bootstrap'
import styles from './Training.module.css'
export const Training = () => {
  return (
    <div className='d-flex flex-column w-100 align-items-center my-5 gap-3 '>
        <h2>Nuestros Entrenamientos</h2>
        <div className='d-flex gap-4 flex-wrap align-items-center justify-content-center'>
            <div>
                <Card className={styles.card} style={{ width: '14rem' }}>
                <Card.Img variant="top" src="../public/training-card/card-1.jpeg" />
                <Card.Body>
                    <Card.Title>Arqueros</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                    </Card.Text>
                </Card.Body>
                </Card>
            </div>
            <div>
                <Card className={styles.card}  style={{ width: '14rem' }}>
                <Card.Img variant="top" src="../public/training-card/card-2.jpeg" />
                <Card.Body>
                    <Card.Title>Jugadores</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                    </Card.Text>
                </Card.Body>
                </Card>
            </div>
            <div>
                <Card className={styles.card}  style={{ width: '14rem' }}>
                <Card.Img variant="top" src="../public/training-card/card-4.jpeg" />
                <Card.Body>
                    <Card.Title>Arrastre</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                    </Card.Text>
                </Card.Body>
                </Card>
            </div>
            <div>
                <Card className={styles.card}  style={{ width: '14rem' }}>
                <Card.Img variant="top" src="../public/training-card/card-3.jpeg" />
                <Card.Body>
                    <Card.Title>Psicomotricidad</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                    </Card.Text>
                </Card.Body>
                </Card>
            </div>
        </div>


    </div>
  )
}
