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
}

export default new MeetingService();
