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
            tokenLoaded: false,
            token: '',
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

    updateMeetingList() {
        meetingService.getTodayMeetings()
            .then(meetings => {
                this.setState(prevState => ({
                    meetings: meetings
                }));
                console.log("UpdateMeetingList");
                console.log(meetings);
            })
            .catch(error => {
                console.error('Error in updateMeetingList:', error);
            });
    }

    openEditModal = (meeting = null) => {
        this.setState({
            showEditModal: true,
            selectedMeeting: meeting,
        });
    }

    openAddUserModal = (meeting) => {
        this.setState({
            showUserModal: true,
            selectedMeeting: meeting,
        });
    }

    openDeleteModal = (meeting) => {
        this.setState({
            showDeleteModal: true,
            selectedMeeting: meeting,
        });
    }

    openMeetingDetailsModal = (meeting) => {
        this.setState({
            showMeetingDetailsModal: true,
            selectedMeeting: meeting,
        });
    }

    closeMeetingDetailsModal = () => {
        this.setState({
            showMeetingDetailsModal: false,
            selectedMeeting: null,
        });
    }

    closeModal = () => {
        this.setState({
            showEditModal: false,
            selectedMeeting: null,
        });
    }

    closeUserModal = () => {
        this.setState({
            selectedMeeting: null,
            showUserModal: false,
        });
    }

    closeDeleteModal = async (meetingId) => {
        this.setState({
            showDeleteModal: false,
            selectedMeeting: null,
            meetings: this.state.meetings.filter(meeting => meeting.id !== meetingId)
        });
    }

    createNewMeeting = (title, description, location, dateTime) => {
        meetingService.createMeeting(title, description, location, dateTime, this.updateMeetingList, () => {
            console.log('Meeting created and list updated');
        });
    }

    render() {
        return (
            <div className='left-panel'>
                <div className='add-button'>
                    <button onClick={() => this.openEditModal(null)}>
                        Dodaj
                    </button>
                </div>
                <div className='planner'>
                    <div className={`planner-title-text`}>Dzisiejsze spotkania</div>
                    {Array.isArray(this.state.meetings) && this.state.meetings.map((item, index) => (
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
                {this.state.showEditModal &&
                    <AddEventModal
                        showModal={this.state.showEditModal}
                        onClose={this.closeModal}
                        meeting={this.state.selectedMeeting}
                        updateMeetingList={this.updateMeetingList}
                    />
                }
                {this.state.showUserModal &&
                    <AddUserModal
                        showModal={this.state.showUserModal}
                        onClose={this.closeUserModal}
                        meeting={this.state.selectedMeeting}
                        updateMeetingList={this.updateMeetingList}
                    />
                }
                {this.state.showDeleteModal &&
                    <DeleteEventModal
                        showModal={this.state.showDeleteModal}
                        onClose={this.closeDeleteModal}
                        meeting={this.state.selectedMeeting}
                        updateMeetingList={this.updateMeetingList}
                    />
                }
                {this.state.showMeetingDetailsModal &&
                    <MeetingDetailsModal
                        show={this.state.showMeetingDetailsModal}
                        onClose={this.closeMeetingDetailsModal}
                        meeting={this.state.selectedMeeting}
                    />
                }
            </div>
        );
    }
}

export default LeftPanel;
