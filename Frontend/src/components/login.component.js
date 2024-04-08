import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import authService from "../services/auth.service";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        checkButtonState(newEmail, password);
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        checkButtonState(email, newPassword);
    };

    const checkButtonState = (email, password) => {
        setIsButtonDisabled(!(email && password));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await authService.login(email, password);
            console.log(response);
        } catch (error) {
            console.error('Błąd logowania:', error);
        }
    };

    return (
        <div className="login-container">
            <Form>
                <h2>Zaloguj się</h2>
                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="E-mail" value={email} onChange={handleEmailChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Hasło" value={password} onChange={handlePasswordChange} />
                </Form.Group>

                <Button className='btn-login' variant="primary" type="submit" onClick={handleLogin} disabled={isButtonDisabled}>
                    Zaloguj się
                </Button>

                <div className="create-account">
                    <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
                </div>
            </Form>
        </div>
    );
};

export default Login;
