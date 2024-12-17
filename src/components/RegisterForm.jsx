import React, { useState, useEffect } from "react";
import EmailIcon from '@mui/icons-material/Email';
import useMutation from "../hooks/useMutation";

const RegisterForm = (props) => {
    const [signUpContent, setSignUpContent] = useState({ userName: "", email: "", password: "" });
    const [passwordMatching, setPasswordMatching] = useState("");
    const { data: registeNewUserData, mutate: registeNewUserMutate }
        = useMutation('/literacyHome/vb/auth/register', 'POST');

    useEffect(() => {
        if (registeNewUserData) {
            if (registeNewUserData.success) {
                props.rigisterSuccess();
            }
        }
    }, [registeNewUserData]);

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpContent((prevValue) => ({ ...prevValue, [name]: value }));
    };

    const handleConfirmingPassword = ({ target: { value } }) => {
        if (!value) {
            setPasswordMatching("");
        } else if (value === signUpContent.password) {
            setPasswordMatching("Password match!");
        } else {
            setPasswordMatching("Password not match...");
        }
    };

    const submitRegister = async (e) => {
        e.preventDefault();
        try {
            await registeNewUserMutate(signUpContent);
        } catch (err) {
            console.error("Failed to registe the new user with email: " + signUpContent.email);
        }
    }

    return (
        <div>
            <button
                style={{ color: props.getButtonColor('signUpEmail') }}
                onClick={() => props.handleButtonClick('signUpEmail')}
            >
                <EmailIcon className="muiIconOnButton" />
                Sign Up with Email
            </button>
            {props.activeForm === 'signUpEmail' && (
                <div className="formContainer">
                    <form>
                        <input
                            type="text"
                            name="userName"
                            placeholder="User Name  Required*"
                            value={signUpContent.userName}
                            onChange={handleSignUpChange}
                            autoComplete="off"
                            required
                            autofocus
                        />
                        <input
                            type="text"
                            name="email"
                            placeholder="Email  Required*"
                            value={signUpContent.email}
                            onChange={handleSignUpChange}
                            autoComplete="off"
                            required
                            autofocus
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password  Required*"
                            value={signUpContent.password}
                            onChange={handleSignUpChange}
                            autoComplete="off"
                            required
                            autofocus
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password  Required*"
                            onChange={handleConfirmingPassword}
                            autoComplete="off"
                            required
                            autofocus
                        />
                        <p
                            style={{
                                color:
                                    passwordMatching === "Password match!"
                                        ? "darkgreen"
                                        : passwordMatching === "Password not match..."
                                            ? "darkred"
                                            : "black",
                            }}
                        >
                            {passwordMatching}
                        </p>
                        <button
                            className="submitButton"
                            disabled={passwordMatching !== "Password match!"}
                            onClick={(event) => submitRegister(event)}
                        >Submit
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default RegisterForm
