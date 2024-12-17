import React, { useState, useEffect } from "react";
import LoginIcon from '@mui/icons-material/Login';
import useMutation from "../hooks/useMutation";

const LogInForm = (props) => {
    const [logInContent, setLogInContent] = useState({ email: "", password: "" });
    const { data: loginData, mutate: loginMutate }
        = useMutation('/literacyHome/vb/auth/login', 'POST');

    useEffect(() => {
        if (loginData) {
            if (loginData.success) {
                props.logInSuccess();
            }
        }
    }, [loginData]);

    function handleLogInChange(e) {
        const { name, value } = e.target;
        setLogInContent((prevValue) => {
            return { ...prevValue, [name]: value };
        });
    }

    const submitLogIn = async (e) => {
        e.preventDefault();
        try {
            await loginMutate(logInContent);
        } catch (err) {
            console.error("Failed to log in with email: " + logInContent.email);
        }
    }

    return (
        <div>
            <button
                style={{ color: props.getButtonColor('logIn') }}
                onClick={() => props.handleButtonClick('logIn')}
            >
                <LoginIcon className="muiIconOnButton" />
                Log In
            </button>
            {props.activeForm === 'logIn' && (
                <div className="formContainer">
                    <form>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email  Required*"
                            value={logInContent.email}
                            onChange={handleLogInChange}
                            autoComplete="off"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password  Required*"
                            value={logInContent.password}
                            onChange={handleLogInChange}
                            autoComplete="off"
                            required
                            autofocus
                        />
                        <button
                            className="submitButton"
                            type="submit"
                            onClick={(event) => submitLogIn(event)}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default LogInForm
