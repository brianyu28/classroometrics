import { login } from "crmet/api/AuthenticationClient";
import { UserAuthentication } from "crmet/data/User";
import { useFocus, useInputFieldState } from "crmet/util/hooks";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";

interface LoginProps {
    onUpdateUserAuth: (userAuth: UserAuthentication) => void
}

function Login({
    onUpdateUserAuth: setUserAuth
}: LoginProps) {

    const [error, setError] = useState(null);
    const [classroom, setClassroom, updateClassroom] = useInputFieldState("");
    const [username, setUsername, updateUsername] = useInputFieldState("");
    const [password, setPassword, updatePassword] = useInputFieldState("");

    const [usernameField, focusUsernameField] = useFocus();
    const navigate = useNavigate();

    const submitLoginForm = (event: React.FormEvent) => {
        event.preventDefault();

        login(username, password)
        .then(res => res.json())
        .then((data: UserAuthentication) => {
            if (data.authenticated == false) {
                setError("Invalid credentials.")
                setUsername("");
                setPassword("");
                focusUsernameField();
            } else {
                setUserAuth(data);
                navigate("/app/rooms");
            }
        })

        return false;
    }

    const submitClassroomForm = (event: React.FormEvent) => {
        event.preventDefault();
        window.location.replace(`/app/view/${classroom}`);
        return false;
    }

    const canSubmitStudentForm = classroom !== "";
    const canSubmitLoginForm = username !== "" && password !== "";

    return (
        <div className="login-container">
            <h1>Classroometrics</h1>
            <p>Live classroom feedback for students and teachers.</p>
            <br />
            <h2>Join a Classroom</h2>
            <p>Enter the classroom identifier provided by your instructor</p>
            <form onSubmit={submitClassroomForm}>
                <input
                    autoFocus={true}
                    type="text"
                    value={classroom}
                    onChange={updateClassroom}
                    placeholder="Classroom Identifier"
                />
                <input
                    disabled={!canSubmitStudentForm}
                    type="submit"
                    value="Join"
                />
            </form>
            <h2>Instructor Login</h2>
            <p>Sign in to monitor classroom metrics</p>
            <form onSubmit={submitLoginForm}>
                { error !== null && <p className="error-text">Error: {error}</p> }
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={updateUsername}
                        placeholder="Username"
                        ref={usernameField}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={updatePassword}
                        placeholder="Password"
                    />
                </div>
                <div>
                    <input
                        disabled={!canSubmitLoginForm}
                        type="submit"
                        value="Log In"
                    />
                </div>
            </form>
            <br />
            <p>Questions? Contact <a href="mailto:brian@brianyu.me?subject=Classroometrics">Brian Yu</a>.</p>
        </div>
    );
}

export default Login;
