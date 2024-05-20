import React, { Component } from 'react';
import AddEventModal from './dashboard-components/addeventmodal.component';
import Calendar from './dashboard-components/calendar.component';
import LeftPanel from './dashboard-components/leftpanel.component';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            clickedDate: null
        };
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
                <LeftPanel openModal={this.openModal} />
                <Calendar />
                <AddEventModal
                    showModal={this.state.showModal}
                    onClose={this.closeModal}
                    clickedDate={this.state.clickedDate}
                />
            </div>
        );
    }
}

export default Dashboard;

