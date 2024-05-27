import React, { Component } from 'react';
import AddEventModal from './addeventmodal.component';
import AddUserModal from './addusermodal.component';
import DeleteEventModal from './deleteeventmodal.component';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import meetingService from "../../services/meeting.service";
import MeetingDetailsModal from './meetingdetailsmodal.component';

class LeftPanel extends Component {
    constructor(props) {
        super(props);
        this.updateMeetingList = this.updateMeetingList.bind(this);
        this.state = {
            meetings: [],
            showEditModal: false,
            showUserModal: false,
            showDeleteModal: false,
            showMeetingDetailsModal: false,
            selectedMeeting: null,
        };
    }

    async componentDidMount() {
        await this.updateMeetingList();
    }

    async updateMeetingList() {
        try {
            const meetings = await meetingService.getTodayMeetings();
            this.setState({ meetings });
            console.log("Updated Meeting List:", meetings);
        } catch (error) {
            console.error('Error in updateMeetingList:', error);
        }
    }

    openEditModal = (meeting = null) => {
        this.setState({ showEditModal: true, selectedMeeting: meeting });
    }

    openAddUserModal = (meeting) => {
        this.setState({ showUserModal: true, selectedMeeting: meeting });
    }

    openDeleteModal = (meeting) => {
        this.setState({ showDeleteModal: true, selectedMeeting: meeting });
    }

    openMeetingDetailsModal = (meeting) => {
        this.setState({ showMeetingDetailsModal: true, selectedMeeting: meeting });
    }

    closeMeetingDetailsModal = () => {
        this.setState({ showMeetingDetailsModal: false, selectedMeeting: null });
    }

    closeModal = () => {
        this.setState({ showEditModal: false, selectedMeeting: null });
    }

    closeUserModal = () => {
        this.setState({ showUserModal: false, selectedMeeting: null });
    }

    closeDeleteModal = async () => {
        this.setState({ showDeleteModal: false, selectedMeeting: null });
        await this.updateMeetingList();
    }

    render() {
        const { meetings, showEditModal, showUserModal, showDeleteModal, showMeetingDetailsModal, selectedMeeting } = this.state;

        return (
            <div className='left-panel'>
                <div className='add-button'>
                    <button onClick={() => this.openEditModal(null)}>Dodaj</button>
                </div>
                <div className='planner'>
                    <div className='planner-title-text'>Dzisiejsze spotkania</div>
                    {Array.isArray(meetings) && meetings.map((item, index) => (
                        <div key={index} className={`meeting-item ${new Date(item.dateTime) < new Date() ? 'red' : 'green'}`}>
                            <p className='title' onClick={() => this.openMeetingDetailsModal(item)}>Tytuł: {item.title}</p>
                            <p>Data i czas: {new Date(item.dateTime).toLocaleString()}</p>
                            <p>Opis: {item.description}</p>
                            <p>Lokalizacja: {item.location}</p>
                            <p>Organizator: {item.organizerEmail}</p>
                            <button onClick={() => this.openAddUserModal(item)} className="action-button add-user-button">
                                <FaPlus />
                            </button>
                            <button onClick={() => this.openEditModal(item)} className="action-button edit-button">
                                <FaEdit />
                            </button>
                            <button onClick={() => this.openDeleteModal(item)} className="action-button delete-button">
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
                {showEditModal &&
                    <AddEventModal
                        showModal={showEditModal}
                        onClose={this.closeModal}
                        meeting={selectedMeeting}
                        updateMeetingList={this.updateMeetingList}
                    />
                }
                {showUserModal &&
                    <AddUserModal
                        showModal={showUserModal}
                        onClose={this.closeUserModal}
                        meeting={selectedMeeting}
                        updateMeetingList={this.updateMeetingList}
                    />
                }
                {showDeleteModal &&
                    <DeleteEventModal
                        showModal={showDeleteModal}
                        onClose={this.closeDeleteModal}
                        meeting={selectedMeeting}
                        updateMeetingList={this.updateMeetingList}
                    />
                }
                {showMeetingDetailsModal &&
                    <MeetingDetailsModal
                        show={showMeetingDetailsModal}
                        onClose={this.closeMeetingDetailsModal}
                        meeting={selectedMeeting}
                    />
                }
            </div>
        );
    }
}

export default LeftPanel;
