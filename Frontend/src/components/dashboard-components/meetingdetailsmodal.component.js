import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AddUserModal from './addusermodal.component';
import AddEventModal from './addeventmodal.component';
import DeleteEventModal from './deleteeventmodal.component';
import MeetingService from '../../services/meeting.service';

const MeetingDetailsModal = ({ show, onClose, meeting, updateMeetingList }) => {
    const [attendees, setAttendees] = useState([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);

    useEffect(() => {
        if (meeting) {
            MeetingService.getAttendees(meeting.id)
                .then(data => setAttendees(data))
                .catch(error => console.error('Error fetching attendees:', error));
        }
    }, [meeting]);

    const handleEdit = () => {
        setShowAddEventModal(true);
    };

    const handleDelete = () => {
        setShowDeleteEventModal(true);
    };

    const handleAddUser = () => {
        setShowAddUserModal(true);
    };

    const handleDeleteAttendee = (attendeeEmail) => {
        MeetingService.deleteAttendee(meeting.id, attendeeEmail)
            .then(() => {
                setAttendees(attendees.filter(attendee => attendee.attendeeEmail !== attendeeEmail));
            })
            .catch(error => console.error('Error deleting attendee:', error));
    };

    const handleChildModalClose = () => {
        onClose();
    };

    return (
        <>
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
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', margin:'5px 0'}}>
                                {attendee.attendeeEmail}
                                <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    onClick={() => handleDeleteAttendee(attendee.attendeeEmail)}
                                >
                                    Usuń
                                </Button>
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleEdit}>
                        Edytuj
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Usuń
                    </Button>
                    <Button variant="success" onClick={handleAddUser}>
                        Dodaj uczestnika
                    </Button>
                </Modal.Footer>
            </Modal>

            <AddUserModal
                showModal={showAddUserModal}
                onClose={() => {
                    setShowAddUserModal(false);
                    handleChildModalClose();
                }}
                meeting={meeting}
            />

            <AddEventModal
                showModal={showAddEventModal}
                onClose={() => {
                    setShowAddEventModal(false);
                    handleChildModalClose();
                }}
                meeting={meeting}
            />

            <DeleteEventModal
                showModal={showDeleteEventModal}
                onClose={() => {
                    setShowDeleteEventModal(false);
                    handleChildModalClose();
                }}
                meeting={meeting}
                updateMeetingList={updateMeetingList}
            />
        </>
    );
};

export default MeetingDetailsModal;
