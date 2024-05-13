import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + "signin", {
                email,
                password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    register(email, password) {
        return axios.post(API_URL + "signup", {
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }

    logout() {
        localStorage.removeItem("user");
        window.location.replace("/login");
    }
}

export default new AuthService();
