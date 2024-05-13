import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import AddEventModal from './addeventmodal.component';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            currentWeek: 0,
            showModal: false,
            clickedDate: null
        };
    }

    renderCalendar = () => {
        const weekdays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];
        const hours = [];
        const currentDate = new Date();
        const firstDayOfWeek = new Date(currentDate);
        firstDayOfWeek.setDate(currentDate.getDate() + (this.state.currentWeek * 7));

        for (let i = 0; i < 24; i++) {
            hours.push(
                <tr key={i}>
                    <td className="hour">{i}:00</td>
                    {weekdays.map((day, index) => (
                        <td key={index} className="weekday" onClick={() => this.openModal(firstDayOfWeek, index, i)}>
                            {/* tu spotkania boże */}
                        </td>
                    ))}
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
                                            {day} <br /> {
                                                date.getDate()}
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

    render() {
        return (
            <div>
                {this.renderCalendar()}
                <AddEventModal
                    showModal={this.state.showModal}
                    onClose={this.closeModal}
                    clickedDate={this.state.clickedDate}
                />
            </div>
        );
    }
}

export default Calendar;
