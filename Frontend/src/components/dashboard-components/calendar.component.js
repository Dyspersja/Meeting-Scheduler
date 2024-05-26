import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import AddEventModal from './addeventmodal.component';
import MeetingDetailsModal from './meetingdetailsmodal.component';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            currentWeek: 0,
            showModal: false,
            clickedDate: null,
            meetingsByCell: {},
            selectedMeeting: null,
            meetings: []
        };
    }

    componentDidMount() {
        this.setState({ meetings: this.props.meetings });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.meetings !== this.props.meetings) {
            this.setState({ meetings: this.props.meetings });
        }
    }

    renderCalendar = () => {
        const { meetings } = this.state;
        const weekdays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];
        const hours = [];
        const currentDate = new Date();
        const firstDayOfWeek = new Date(currentDate);
        firstDayOfWeek.setDate(currentDate.getDate() + (this.state.currentWeek * 7));

        while (firstDayOfWeek.getDay() !== 1) {
            firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 1);
        }

        for (let i = 0; i < 24; i++) {
            hours.push(
                <tr key={i}>
                    <td className="hour">{i}:00</td>
                    {weekdays.map((day, index) => {
                        const date = new Date(firstDayOfWeek);
                        date.setDate(firstDayOfWeek.getDate() + index);

                        const cellKey = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-${i}`;

                        const meetingsForCell = meetings.filter(meeting => {
                            const meetingDate = new Date(meeting.dateTime);
                            return (
                                meetingDate.getDate() === date.getDate() &&
                                meetingDate.getMonth() === date.getMonth() &&
                                meetingDate.getFullYear() === date.getFullYear() &&
                                meetingDate.getHours() === i
                            );
                        });

                        return (
                            <td key={index} className="weekday" onClick={() => this.openModal(firstDayOfWeek, index, i)}>
                                {meetingsForCell.map((meeting, idx) => (
                                    <div key={idx} className="meeting" onClick={(e) => this.selectMeeting(e, meeting)}>
                                        {meeting.title}
                                    </div>
                                ))}
                                {meetingsForCell.length === 0 && (
                                    <div className="add-event" onClick={() => this.openModal(firstDayOfWeek, index, i)}></div>
                                )}
                            </td>
                        );
                    })}
                </tr>
            );
        }

        const monthName = firstDayOfWeek.toLocaleString('default', { month: 'long' });
        const yearName = firstDayOfWeek.toLocaleString('default', { year: 'numeric' });

        return (
            <div className='calendar'>
                <div className='week-buttons'>
                    <button className='arrow-button' onClick={this.prevWeek}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button className='arrow-button' onClick={this.nextWeek}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <div className='month'>
                    {yearName}
                    <br />
                    {monthName}
                </div>
                <div className='table-container'>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th></th>
                                {weekdays.map((day, index) => {
                                    const date = new Date(firstDayOfWeek);
                                    date.setDate(firstDayOfWeek.getDate() + index);
                                    return (
                                        <th key={index} className="weekday-header">
                                            {day} <br /> {date.getDate()}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {hours}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    };

    nextWeek = () => {
        this.setState(prevState => ({
            currentWeek: prevState.currentWeek + 1,
        }));
    };

    prevWeek = () => {
        this.setState(prevState => ({
            currentWeek: prevState.currentWeek - 1,
        }));
    };

    openModal = (firstDayOfWeek, dayIndex, hourIndex) => {
        const clickedDate = new Date(firstDayOfWeek);
        clickedDate.setDate(firstDayOfWeek.getDate() + dayIndex);
        clickedDate.setHours(hourIndex, 0, 0, 0);
        this.setState({ showModal: true, clickedDate: clickedDate });
    };

    closeModal = () => {
        this.setState({ showModal: false, clickedDate: null });
    };

    selectMeeting = (e, meeting) => {
        e.stopPropagation();
        this.setState({ selectedMeeting: meeting });
    };

    render() {
        return (
            <div>
                {this.renderCalendar()}
                {this.state.selectedMeeting && (
                    <MeetingDetailsModal
                        show={true}
                        onClose={() => this.setState({ selectedMeeting: null })}
                        meeting={this.state.selectedMeeting}
                        updateMeetingList={this.props.updateMeetingList}
                    />
                )}
                <AddEventModal
                    showModal={this.state.showModal}
                    onClose={this.closeModal}
                    clickedDate={this.state.clickedDate}
                    updateMeetingList={this.props.updateMeetingList}
                />
            </div>
        );
    }
}

export default Calendar;
