import React, { useState } from 'react';

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);


    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        checkButtonState(event.target.value, password, confirmPassword);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        checkButtonState(email, event.target.value, confirmPassword);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        checkButtonState(email, password, event.target.value);
    };

    const checkButtonState = (email, password, confirmPassword) => {
        setIsButtonDisabled(!(email && password && confirmPassword));
    };

    const handleRegistration = async (event) => {
        //TODO: API  for registration 
    };

    return (
        <div className='login-container'>
            <form>
                <h2>Stwórz konto</h2>
                <div className='input-container'>
                    <input type='email' placeholder='E-mail' value={email} onChange={handleEmailChange} />
                </div>
                <div className='input-container'>
                    <input type='password' placeholder='Hasło' value={password} onChange={handlePasswordChange} />
                </div>
                <div className='input-container'>
                    <input type='password' placeholder='Potwierdź hasło' value={confirmPassword} onChange={handleConfirmPasswordChange} />
                </div>
                <div className='input-container'>
                    <input className='btn-login' value='Zarejestruj się' type='submit' onClick={handleRegistration} disabled={isButtonDisabled} />
                </div>
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
