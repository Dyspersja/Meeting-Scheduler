import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import MeetingService from '../../services/meeting.service';


const AddEventModal = ({ showModal, onClose, meeting, clickedDate, updateMeetingList }) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (showModal) {
            clearForm();
            if (meeting) {
                setTitle(meeting.title);
                setLocation(meeting.location);
                setDate(new Date(meeting.dateTime).toLocaleDateString('en-CA'));
                setTime(new Date(meeting.dateTime).toTimeString().substr(0, 5));
                setDescription(meeting.description);
            } else if (clickedDate) {
                setDate(clickedDate.toLocaleDateString('en-CA'));
                setTime(clickedDate.toTimeString().substr(0, 5));
            }
        }
    }, [showModal, meeting, clickedDate]);

    const clearForm = () => {
        setTitle('');
        setLocation('');
        setDate('');
        setTime('');
        setDescription('');
        setError(null);
    };

    const handleSave = async () => {
        const dateTime = `${date} ${time}`;
        const dateParts = dateTime.split(' ');
        const timeParts = dateParts[1].split(':');
        const datePartsArr = dateParts[0].split('-');
        const year = parseInt(datePartsArr[0]);
        const month = parseInt(datePartsArr[1]) - 1;
        const day = parseInt(datePartsArr[2]);
        const hour = parseInt(timeParts[0]);
        const minute = parseInt(timeParts[1]);

        const dateObject = new Date(year, month, day, hour, minute);

        try {
            if (meeting) {
                await MeetingService.updateMeeting(meeting.id, title, description, location, dateTime);
                console.log('Spotkanie zaktualizowane!');
            } else {
                await MeetingService.createMeeting(title, description, location, dateTime);
                console.log('Spotkanie dodane!');
            }

            if (typeof updateMeetingList === 'function') {
                await updateMeetingList();
            }

            onClose();
        } catch (error) {
            console.error('Error creating/editing meeting:', error);
            setError('Wystąpił błąd podczas zapisywania spotkania.');
        }
    }


        return (
        <Modal show={showModal} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{meeting ? 'Edytuj spotkanie' : 'Nowe spotkanie'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <Form>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Tytuł</Form.Label>
                        <Form.Control type="text" placeholder="Podaj tytuł" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formLocation">
                        <Form.Label>Lokalizacja</Form.Label>
                        <Form.Control type="text" placeholder="Podaj lokalizację" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formDate">
                        <Form.Label>Data</Form.Label>
                        <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formTime">
                        <Form.Label>Godzina</Form.Label>
                        <Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Opis</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Dodaj opis spotkania" value={description} onChange={(e) => setDescription(e.target.value)} />
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

export default AddEventModal;
