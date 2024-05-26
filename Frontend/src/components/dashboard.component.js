import React, { Component } from 'react';
import AddEventModal from './dashboard-components/addeventmodal.component';
import Calendar from './dashboard-components/calendar.component';
import LeftPanel from './dashboard-components/leftpanel.component';
import meetingService from "../services/meeting.service";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            clickedDate: null,
            meetings: [],
            todayMeetings: []
        };
    }

    componentDidMount() {
        this.updateMeetingList();
        this.updateTodayMeetingList();
    }

    updateMeetingList = () => {
        meetingService.getAllMeetings()
            .then(meetings => {
                this.setState({ meetings });
            })
            .catch(error => {
                console.error('Error in updateMeetingList:', error);
            });
    }

    updateTodayMeetingList = () => {
        meetingService.getTodayMeetings()
            .then(todayMeetings => {
                this.setState({ todayMeetings });
            })
            .catch(error => {
                console.error('Error in updateTodayMeetingList:', error);
            });
    }

    openModal = () => {
        this.setState({ showModal: true });
    };

    closeModal = () => {
        this.setState({ showModal: false, clickedDate: null });
    };

    render() {
        return (
            <div className='dashboard'>
                <LeftPanel openModal={this.openModal} updateMeetingList={this.updateMeetingList} />
                <Calendar meetings={this.state.meetings} updateMeetingList={this.updateMeetingList} />
                <AddEventModal
                    showModal={this.state.showModal}
                    onClose={this.closeModal}
                    clickedDate={this.state.clickedDate}
                    updateMeetingList={this.updateMeetingList}
                />
            </div>
        );
    }
}

export default Dashboard;
