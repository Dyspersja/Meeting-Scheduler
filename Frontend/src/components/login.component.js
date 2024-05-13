import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import AuthService from "../services/auth.service";
import { withRouter } from '../common/with-router';
import authService from "../services/auth.service";


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isButtonDisabled: true,
            emailError: '',
            passwordError: '',
            loginError: ''
        };
    }

    handleEmailChange = (event) => {
        const newEmail = event.target.value;
        this.setState({ email: newEmail, emailError: '' });
        this.updateButtonState(newEmail, this.state.password);
    };

    handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        this.setState({ password: newPassword, passwordError: '' });
        this.updateButtonState(this.state.email, newPassword);
    };

    updateButtonState = (newEmail, newPassword) => {
        if (newEmail && newPassword) {
            this.setState({ isButtonDisabled: false });
        } else {
            this.setState({ isButtonDisabled: true });
        }
    };

    handleLogin = async (event) => {
        event.preventDefault();
        const { email, password } = this.state;
        try {
            await AuthService.login(email, password);
            window.location.replace("/index");
        } catch (error) {
            console.error('Błąd logowania:', error);
            if (error.response && error.response.status === 401) {
                this.setState({ loginError: 'Niepoprawny e-mail lub hasło' });
            } else {
                this.setState({ loginError: 'Wystąpił błąd podczas logowania' });
            }
        }
    };

    render() {
        const { email, password, isButtonDisabled, emailError, passwordError, loginError } = this.state;

        return (
            <div className="login-container">
                <Form>
                    <h2>Zaloguj się</h2>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="E-mail" value={email} onChange={this.handleEmailChange} />
                        {emailError && <span className="error">{emailError}</span>}
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Hasło" value={password} onChange={this.handlePasswordChange} />
                        {passwordError && <span className="error">{passwordError}</span>}
                    </Form.Group>

                    <Button className='btn-login' type="submit" onClick={this.handleLogin} disabled={isButtonDisabled}>
                        Zaloguj się
                    </Button>
                    {loginError && <span className="error">{loginError}</span>}

                    <div className="create-account">
                        <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
                    </div>
                </Form>
            </div>
        );
    }
}

export default withRouter(Login);