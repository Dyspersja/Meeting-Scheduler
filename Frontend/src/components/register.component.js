import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import AuthService from "../services/auth.service";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            isButtonDisabled: true,
            emailError: '',
            passwordError: '',
            confirmPasswordError: '',
            registrationError: ''
        };
    }

    componentDidMount() {
        this.updateButtonState();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.email !== this.state.email || prevState.password !== this.state.password || prevState.confirmPassword !== this.state.confirmPassword) {
            this.updateButtonState();
        }
    }

    handleEmailChange = (event) => {
        const newEmail = event.target.value;
        this.setState({ email: newEmail, emailError: '' });
        if (!this.validateEmail(newEmail)) {
            this.setState({ emailError: 'Podaj poprawny adres e-mail' });
        }
    };

    handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        this.setState({ password: newPassword, passwordError: '', confirmPasswordError: '' });
        if (newPassword.length < 8) {
            this.setState({ passwordError: 'Hasło musi mieć co najmniej 8 znaków' });
        }
        if (this.state.confirmPassword !== newPassword) {
            this.setState({ confirmPasswordError: 'Hasła nie są takie same' });
        }
    };

    handleConfirmPasswordChange = (event) => {
        const newPassword = event.target.value;
        this.setState({ confirmPassword: newPassword, confirmPasswordError: '' });
        if (this.state.password !== newPassword) {
            this.setState({ confirmPasswordError: 'Hasła nie są takie same' });
        }
    };

    validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    updateButtonState = () => {
        const { email, password, confirmPassword, emailError, passwordError, confirmPasswordError } = this.state;
        if (email && password && confirmPassword && !emailError && !passwordError && !confirmPasswordError) {
            this.setState({ isButtonDisabled: false });
        } else {
            this.setState({ isButtonDisabled: true });
        }
    };

    handleRegistration = async (event) => {
        event.preventDefault();
        const { email, password } = this.state;
        try {
            const response = await AuthService.register(email, password);
            console.log(response.data);
            this.setState({ registrationError: 'Rejestracja powiodła się!' });
        } catch (error) {
            console.error('Błąd rejestracji:', error);
            this.setState({ registrationError: 'Błąd rejestracji: ' + error.message });
        }
    };

    render() {
        const { email, password, confirmPassword, isButtonDisabled, emailError, passwordError, confirmPasswordError, registrationError } = this.state;

        return (
            <div className='login-container'>
                <Form>
                    <h2>Stwórz konto</h2>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="E-mail" value={email} onChange={this.handleEmailChange} />
                        {emailError && <span className="error">{emailError}</span>}
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Hasło" value={password} onChange={this.handlePasswordChange} />
                        {passwordError && <span className="error">{passwordError}</span>}
                    </Form.Group>

                    <Form.Group controlId="formBasicConfirmPassword">
                        <Form.Control type="password" placeholder="Potwierdź hasło" value={confirmPassword} onChange={this.handleConfirmPasswordChange} />
                        {confirmPasswordError && <span className="error">{confirmPasswordError}</span>}
                    </Form.Group>

                    <Button className='btn-login' type="submit" onClick={this.handleRegistration} disabled={isButtonDisabled}>
                        Zarejestruj się
                    </Button>
                    {registrationError && <span className="success">{registrationError}</span>}

                    <div className="create-account">
                        <p>
                            Masz konto? <a href='/login'>Zaloguj się</a>
                        </p>
                    </div>
                </Form>
            </div>
        );
    }
}

export default Registration;
