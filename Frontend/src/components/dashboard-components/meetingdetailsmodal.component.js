import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import meetingService from '../../services/meeting.service';

const MeetingDetailsModal = ({ show, onClose, meeting }) => {
    const [attendees, setAttendees] = useState([]);

    useEffect(() => {
        if (meeting) {
            meetingService.getAttendees(meeting.id)
                .then(data => setAttendees(data))
                .catch(error => console.error('Error fetching attendees:', error));
        }
    }, [meeting]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Szczegóły spotkania</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Tytuł:</strong> {meeting.title}</p>
                <p><strong>Data i czas:</strong> {new Date(meeting.dateTime).toLocaleString()}</p>
                <p><strong>Opis:</strong> {meeting.description}</p>
                <p><strong>Lokalizacja:</strong> {meeting.location}</p>
                <p><strong>Organizator:</strong> {meeting.organizerEmail}</p>
                <p><strong>Uczestnicy:</strong></p>
                <ul>
                    {attendees.map((attendee, index) => (
                        <li key={index}>{attendee.attendeeEmail}</li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Zamknij
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MeetingDetailsModal;
