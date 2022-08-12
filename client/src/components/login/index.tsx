import { login } from 'crmet/api/AuthenticationClient';
import { UserAuthentication } from 'crmet/data/User';
import { useFocus } from 'crmet/util/hooks';
import React, { useState } from 'react';
import './style.scss';

interface LoginProps {
    onUpdateUserAuth: (userAuth: UserAuthentication) => void
}

function Login({
    onUpdateUserAuth: setUserAuth
}: LoginProps) {

    const [error, setError] = useState(null);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [usernameField, focusUsernameField] = useFocus();

    const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const submitLoginForm = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(username);

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
