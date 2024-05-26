import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import MeetingService from '../../services/meeting.service';

const DeleteEventModal = ({ showModal, onClose, meeting }) => {
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        try {
            if (meeting) {
                await MeetingService.deleteMeeting(meeting.id);
            }
            onClose();
        } catch (error) {
            console.error('Wystąpił błąd:', error);
            setError('Wystąpił błąd podczas usuwania spotkania.');
        }
    };

    return (
        <Modal show={showModal} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Usuń spotkanie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <p>Czy na pewno chcesz usunąć to spotkanie?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Anuluj
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Usuń
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteEventModal;