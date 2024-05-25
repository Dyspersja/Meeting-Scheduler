import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './../../styles/navbar-informations.css'

const InfoModal = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <li>
                <NavLink to="#" onClick={handleShow}>Informacje</NavLink>
            </li>

            <Modal show={show} onHide={handleClose} dialogClassName="modal-dialog-custom">
                <Modal.Header closeButton className="modal-header-custom">
                    <Modal.Title className="modal-title-custom">Informacje</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}>Członkowie zespołu</p>

                    <hr/>
                    <p><b>Piotr Pecuch</b></p>
                    <p>Role:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;Product owner, zespół deweloperski.</p>
                    <p>Odpowiedzialny za:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;Współpracę z klientem/zleceniodawcą, zbieranie wymagań, analizę wymagań użytkownika,
                        projekt,
                        implementację i realizację programową,
                        ustalenie wymagań funkcjonalnych i niefunkcjonalnych.</p>
                    <hr/>
                    <p>Radosław Staniów</p>
                    <p>Role:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;Scrum master, zespół deweloperski.</p>
                    <p>Odpowiedzialny za:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;Analiza i dobór nardzędzi oraz środowiska, projekt, implementację i realizację
                        programową.</p>
                    <hr/>
                    <p>Jagoda Straszewska</p>
                    <p>Role:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;Zespół deweloperski.</p>
                    <p>Odpowiedzialna za:</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;Projekt, implementacja i realizacja programowa, weryfikacja i testowanie.</p>

                </Modal.Body>
                <Modal.Footer className="modal-footer-custom">
                    <Button className="custom-button" onClick={handleClose}>
                        Zamknij
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default InfoModal;
