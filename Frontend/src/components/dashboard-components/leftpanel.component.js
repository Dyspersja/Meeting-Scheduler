import React, { Component } from 'react';
import authService from "../../services/auth.service";
import AddEventModal from './addeventmodal.component';
import AddUserModal from './addusermodal.component'; 
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; 
import MeetingService from '../../services/meeting.service';

class LeftPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meetings: [],
            tokenLoaded: false,
            token: '',
            showEditModal: false,
            showUserModal: false, 
            selectedMeeting: null,
        };
    }

    componentDidMount() {
        authService.refreshToken().then(async token => {
            this.setState({
                tokenLoaded: true,
                token: token
            });
            const response = await fetch('http://localhost:8080/api/meeting/getTodayMeetings', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authService.getLocalAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            this.setState({ meetings: data });
        });
    }

    openEditModal = (meeting) => {
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

    deleteMeeting = async (meetingId) => {
        try {
            await MeetingService.deleteMeeting(meetingId);
            this.setState({ meetings: this.state.meetings.filter(meeting => meeting.id !== meetingId) });
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    }

    render() {
        return (
            <div className='left-panel'>
                <div className='add-button'>
                    <button onClick={this.openEditModal}>
                        Dodaj
                    </button>
                </div>
                <div className='planner'>
                    {Array.isArray(this.state.meetings) && this.state.meetings.map((item, index) => (
                        <div key={index} className={`meeting-item ${new Date(item.dateTime) < new Date() ? 'red' : 'green'}`}>
                            <p>Data i czas: {new Date(item.dateTime).toLocaleString()}</p>
                            <p>Opis: {item.description}</p>
                            <p>Lokalizacja: {item.location}</p>
                            <p>Organizator: {item.organizerId.email}</p>
                            <button onClick={this.openAddUserModal} className="action-button add-user-button">
                                <FaPlus />
                            </button>
                            <button onClick={() => this.openEditModal(item)} className="action-button edit-button">
                                <FaEdit />
                            </button>
                            <button onClick={() => this.deleteMeeting(item.id)} className="action-button delete-button">
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
                    />
                }
                {this.state.showUserModal &&  
                    <AddUserModal 
                        showModal={this.state.showUserModal} 
                        onClose={this.closeUserModal} 
                        meeting={this.state.selectedMeeting} 
                    />
                }
            </div>
        );
    }
}

export default LeftPanel;
