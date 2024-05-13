import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthService from "../services/auth.service";
import { withRouter } from '../common/with-router';


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
            this.props.router.navigate("/");
            window.location.reload();
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
                        <Form.Control
                            required
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={this.handleEmailChange}
                            isInvalid={emailError !== ''}
                        />
                        <Form.Control.Feedback type="invalid">
                            {emailError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control
                            required
                            type="password"
                            placeholder="Hasło"
                            value={password}
                            onChange={this.handlePasswordChange}
                            isInvalid={passwordError !== ''}
                        />
                        <Form.Control.Feedback type="invalid">
                            {passwordError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                        className='btn-login'
                        type="submit"
                        onClick={this.handleLogin}
                        disabled={isButtonDisabled}
                    >
                        Zaloguj się
                    </Button>
                    {loginError && <Alert variant="danger">{loginError}</Alert>}

                    <div className="create-account">
                        <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
                    </div>
                </Form>
            </div>
        );
    }
}

export default withRouter(Login);
