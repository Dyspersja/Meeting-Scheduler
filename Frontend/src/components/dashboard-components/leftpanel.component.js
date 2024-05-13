import React, {Component} from 'react';
import authService from "../../services/auth.service";
import {wait} from "@testing-library/user-event/dist/utils";


class LeftPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meetings: [],
            tokenLoaded: false,
            token: '' // Dodaj stan dla tokenu
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
            this.setState({meetings: data});
        });
    }


    render() {
        return (
            <div className='left-panel'>
                <div className='add-button'>
                    <button onClick={this.props.openModal}>Dodaj</button>
                </div>
                <div className='planner'>
                    {Array.isArray(this.state.meetings) && this.state.meetings.map((item, index) => (
                        <div key={index} className="meeting-item"
                             style={{backgroundColor: new Date(item.dateTime) < new Date() ? 'red' : 'green'}}>
                            <p>Data i czas: {new Date(item.dateTime).toLocaleString()}</p>
                            <p>Opis: {item.description}</p>
                            <p>Lokalizacja: {item.location}</p>
                            <p>Organizator: {item.organizerId.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}


export default LeftPanel;
