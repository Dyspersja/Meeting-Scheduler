import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://localhost:8080/api/";

class MeetingService {
    createMeeting(title, description, location, dateTime) {
        return axios.post(API_URL + "meeting", {
            title: title,
            description: description,
            location: location,
            dateTime: dateTime
        }, { headers: authHeader() });
    }

//to trzeba ogarnąć

    updateMeeting(id, title, description, location, dateTime) {
        return axios.put(API_URL +  'tu endpoint dać trzeba', {
            title: title,
            description: description,
            location: location,
            dateTime: dateTime
        }, { headers: authHeader() });
    }

    addUserToMeeting(id, email) {
        return axios.put(API_URL + 'tu endpoint dać trzeba', {
            email: email,
        }, { headers: authHeader() });
    }

    deleteMeeting(id) {
        return axios.delete(API_URL + `tu endpoint dać trzeba`, { headers: authHeader() });
    }
}

export default new MeetingService();
