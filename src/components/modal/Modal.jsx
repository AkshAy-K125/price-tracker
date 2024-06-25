import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Modaldialogue({ setModalShow }) {
    return (
        <div
            className="modal show"
            style={{
                display: 'flex',
                position: 'initial',
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Error Message</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Insufficient Creds, please purchase more to set triggers</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={() => setModalShow(false)}>close</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

export default Modaldialogue;