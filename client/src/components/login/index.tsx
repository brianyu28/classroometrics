import { login } from 'crmet/api/AuthenticationClient';
import { UserAuthentication } from 'crmet/data/User';
import { useFocus, useInputFieldState } from 'crmet/util/hooks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';

interface LoginProps {
    onUpdateUserAuth: (userAuth: UserAuthentication) => void
}

function Login({
    onUpdateUserAuth: setUserAuth
}: LoginProps) {

    const [error, setError] = useState(null);
    const [username, setUsername, updateUsername] = useInputFieldState('');
    const [password, setPassword, updatePassword] = useInputFieldState('');

    const [usernameField, focusUsernameField] = useFocus();
    const navigate = useNavigate();

    const submitLoginForm = (event: React.FormEvent) => {
        event.preventDefault();

        login(username, password)
        .then(res => res.json())
        .then((data: UserAuthentication) => {
            if (data.authenticated == false) {
                setError('Invalid credentials.')
                setUsername('');
                setPassword('');
                focusUsernameField();
            } else {
                setUserAuth(data);
                navigate('/app/dashboards');
            }
        })

        return false;
    }

    const canSubmitLoginForm = username !== '' && password !== '';

    return (
        <div className='login-container'>
            <form onSubmit={submitLoginForm}>
                <h2>Login</h2>
                { error !== null && <div>Error: {error}</div> }
                <div>
                    <input
                        autoFocus={true}
                        type='text'
                        value={username}
                        onChange={updateUsername}
                        placeholder='Username'
                        ref={usernameField}
                    />
                </div>
                <div>
                    <input
                        type='password'
                        value={password}
                        onChange={updatePassword}
                        placeholder='Password'
                    />
                </div>
                <div>
                    <input
                        disabled={!canSubmitLoginForm}
                        type='submit'
                        value='Log In'
                    />
                </div>
            </form>
        </div>
    );
}

export default Login;
