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
                    window.location.replace("/index")
                }

                return response.data;
            });
    }


    getLocalRefreshToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        return user.refreshToken;
    }

    getLocalAccessToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.accessToken;
    }

    updateLocalAccessToken(token) {
        let user = JSON.parse(localStorage.getItem("user"));
        user.accessToken = token;
        localStorage.setItem("user", JSON.stringify(user));
    }
    updateRefreshToken(token) {
        let user = JSON.parse(localStorage.getItem("user"));
        user.refreshToken = token;
        localStorage.setItem("user", JSON.stringify(user));
    }

    refreshToken() {
        console.log()
        return new Promise((resolve, reject) => {
            axios.post('http://localhost:8080/api/auth/refreshtoken', {refreshToken: this.getLocalRefreshToken()})
                .then((response) => {

                    this.updateLocalAccessToken(response.data.accessToken);
                    this.updateRefreshToken(response.data.refreshToken);

                    resolve(response.data.accessToken);
                })
                .catch((error) => {
                    this.logout();
                    reject(error);
                });
        });
    }


    register(email, password) {
        return axios.post(API_URL + "signup", {
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    logout() {
        localStorage.removeItem("user");
        window.location.replace("/login");
    }

}

export default new AuthService();
