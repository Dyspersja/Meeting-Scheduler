import React, { useState } from 'react';
import authService from "../services/auth.service";

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [registrationError, setRegistrationError] = useState('');

    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        setEmailError('');
        checkButtonState(newEmail, password, confirmPassword);
        if (!validateEmail(newEmail)) {
            setEmailError('Podaj poprawny adres e-mail');
        }
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        setPasswordError('');
        setConfirmPasswordError('');
        checkButtonState(email, newPassword, confirmPassword);
        if (newPassword.length < 8) {
            setPasswordError('Hasło musi mieć co najmniej 8 znaków');
        }
        if (confirmPassword && confirmPassword !== newPassword) {
            setConfirmPasswordError('Hasła nie są takie same');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (event) => {
        const newPassword = event.target.value;
        setConfirmPassword(newPassword);
        setConfirmPasswordError('');
        checkButtonState(email, password, newPassword);
        if (password !== newPassword) {
            setConfirmPasswordError('Hasła nie są takie same');
        }
    };

    const checkButtonState = (email, password, confirmPassword) => {
        setIsButtonDisabled(!(email && password && confirmPassword && !emailError && !passwordError && !confirmPasswordError));
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleRegistration = async (event) => {
        event.preventDefault();
        try {
            const response = await authService.register(email, password);
            console.log(response.data);
        } catch (error) {
            console.error('Błąd rejestracji:', error);
            setRegistrationError('Błąd rejestracji: ' + error.message);
        }
    };

    return (
        <div className='login-container'>
            <form>
                <h2>Stwórz konto</h2>
                <div className='input-container'>
                    <input type='email' placeholder='Email' value={email} onChange={handleEmailChange} />
                    {emailError && <span className="error">{emailError}</span>}
                </div>
                <div className='input-container'>
                    <input type='password' placeholder='Hasło' value={password} onChange={handlePasswordChange} />
                    {passwordError && <span className="error">{passwordError}</span>}
                </div>
                <div className='input-container'>
                    <input type='password' placeholder='Potwierdź hasło' value={confirmPassword} onChange={handleConfirmPasswordChange} />
                    {confirmPasswordError && <span className="error">{confirmPasswordError}</span>}
                </div>
                <div className='input-container'>
                    <input className='btn-login' value='Zarejestruj się' type='submit' onClick={handleRegistration} disabled={isButtonDisabled} />
                </div>
                {registrationError && <span className="error">{registrationError}</span>}
                <div className='create-account'>
                    <p>
                        Masz konto? <a href='/login'>Zaloguj się</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Registration;
