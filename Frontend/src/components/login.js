import React, { useState } from 'react';

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

    const checkButtonState = (username, password) => {
        setIsButtonDisabled(!(username && password));
    };

    const handleLogin = async (event) => {
        //TODO: API for login
    };

    return (
        <div className="login-container">
            <form>
                <h2>Zaloguj się</h2>
                <div className="input-container">
                    <input type="text" placeholder='E-mail' value={email} onChange={handleEmailChange} />
                </div>
                <div className="input-container">
                    <input type="password" placeholder='Hasło' value={password} onChange={handlePasswordChange} />
                </div>
                <div className="input-container">
                    <input className="btn-login" value='Zaloguj się' type="submit" onClick={handleLogin} disabled={isButtonDisabled} />
                </div>
                <div className="create-account">
                    <p>Nie masz konta? <a href="/register">Zarejestruj się</a></p>
                </div>
            </form>
        </div>
    )
}
export default Login;
