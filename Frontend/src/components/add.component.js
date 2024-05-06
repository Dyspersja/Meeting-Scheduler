import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';

const AddEventModal = ({ showModal, onClose, clickedDate }) => {
    const [title, setTitle] = useState('');
    const [users, setUsers] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (clickedDate) {
            var isoDate = new Date(clickedDate.getTime() - clickedDate.getTimezoneOffset() * 60000);
            setDate(isoDate.toISOString().substr(0, 10));
            setTime(clickedDate.toTimeString().substr(0, 5));
        }
    }, [showModal, clickedDate]);

    const handleSave = () => {
        console.log('Zapisano spotkanie:', { title, users, date, time, description });
        onClose();
    };

    return (
        <Modal show={showModal} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nowe spotkanie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Tytuł</Form.Label>
                        <Form.Control type="text" placeholder="Podaj tytuł" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formUsers">
                        <Form.Label>Użytkownicy (wielu, oddzielonych przecinkami)</Form.Label>
                        <Form.Control type="text" placeholder="Wprowadź adresy email użytkowników" value={users} onChange={(e) => setUsers(e.target.value)} />
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
                    Dodaj
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddEventModal;
