import axios from "axios";
import authService from "./auth.service";

const API_URL = "http://localhost:8080/api/";

class MeetingService {
    async getTodayMeetings() {
        return authService.refreshToken()
            .then(() => {
                console.log('Token refreshed successfully');
                return axios.get(API_URL + 'meeting/getTodayMeetings', {
                    headers: {
                        'Authorization': `Bearer ${authService.getLocalAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(response => {
                const data = response.data;
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error('Error fetching today\'s meetings:', error);
                throw error;
            });
    }

    async createMeeting(title, description, location, dateTime) {
        return authService.refreshToken()
            .then(() => {
                console.log('Token refreshed successfully');
                return axios.post(API_URL + "meeting", {
                    title: title,
                    description: description,
                    location: location,
                    dateTime: dateTime
                }, {
                    headers: {
                        'Authorization': `Bearer ${authService.getLocalAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(response => response.data)
            .catch(error => {
                console.error('Error creating meeting:', error);
                throw error;
            });
    }

    updateMeeting(id, title, description, location, dateTime) {
        return authService.refreshToken().then(() => {
            return axios.put(API_URL + 'meeting/' + id, {
                title: title,
                description: description,
                location: location,
                dateTime: dateTime
            }, {
                headers: {
                    'Authorization': `Bearer ${authService.getLocalAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });
        }).catch(error => {
            console.error('Error updating meeting:', error);
            throw error;
        });
    }

    addUserToMeeting(id, email) {
        return authService.refreshToken().then(() => {
            return axios.post(API_URL + 'meeting/' + id + '/attendee', {
                email: email
            }, {
                headers: {
                    'Authorization': `Bearer ${authService.getLocalAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });
        }).catch(error => {
            console.error('Error adding user to meeting:', error);
            throw error;
        });
    }

    deleteMeeting(id) {
        return authService.refreshToken()
            .then(() => {
                return axios.delete(API_URL + `meeting/` + id, {
                    headers: {
                        'Authorization': `Bearer ${authService.getLocalAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(response => {
                console.log("Meeting deleted successfully:", response);
                return response.data;
            })
            .catch(error => {
                console.error('Error deleting meeting:', error);
                throw error;
            });
    }

    async getAllMeetings() {
        return authService.refreshToken()
            .then(() => {
                return axios.get(API_URL + 'meeting', {
                    headers: {
                        'Authorization': `Bearer ${authService.getLocalAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(response => {
                const data = response.data;
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error('Error fetching all meetings:', error);
                throw error;
            });
    }

    async getAttendees(meetingId) {
        return authService.refreshToken()
            .then(() => {
                return axios.get(API_URL + `meeting/${meetingId}/attendee`, {
                    headers: {
                        'Authorization': `Bearer ${authService.getLocalAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(response => {
                const data = response.data;
                console.log(data);
                return data;
            })
            .catch(error => {
                console.error('Error fetching attendees for meeting:', error);
                throw error;
            });
    }

    async deleteAttendee(meetingId, attendeeEmail) {
        return authService.refreshToken()
            .then(() => {
                return axios.delete(API_URL + `meeting/${meetingId}/attendee`, {
                    data: { email: attendeeEmail },
                    headers: {
                        'Authorization': `Bearer ${authService.getLocalAccessToken()}`,
                        'Content-Type': 'application/json'
                    }
                });
            })
            .then(response => {
                console.log("Attendee deleted successfully:", response);
                return response.data;
            })
            .catch(error => {
                console.error('Error deleting attendee:', error);
                throw error;
            });
    }
}

export default new MeetingService();
