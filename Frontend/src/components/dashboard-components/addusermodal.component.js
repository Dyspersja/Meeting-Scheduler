import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MeetingService from '../../services/meeting.service';

const AddUserModal = ({ showModal, onClose, meeting }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (showModal) {
            //tu coś ogarnąć
        }
    }, [showModal, meeting]);

    const clearForm = () => {
        setEmail('');
        setError(null);
    };



    const handleSave = async () => {
        try {
            console.log('Meeting:', meeting); // Dodaj ten log
            if (meeting) {
                console.log('Meeting ID:', meeting.id); // Dodaj ten log
                await MeetingService.addUserToMeeting(meeting.id, email);
            }
            onClose();
        } catch (error) {
            console.error('Wystąpił błąd:', error);
            setError('Wystąpił błąd podczas zapisywania użytkownika.');
        }
    };


    return (
        <Modal show={showModal} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Dodaj użytkownika do spotkania</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <Form>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Podaj email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Anuluj
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Zapisz
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddUserModal;
