import React, { useState, useEffect } from "react";
import EmailIcon from '@mui/icons-material/Email';
import useMutation from "../hooks/useMutation";

const RegisterForm = (props) => {
    const [signUpContent, setSignUpContent] = useState({ userName: "", email: "", password: "" });
    const [confirmPasswordValue, setconfirmPasswordValue] = useState("");
    const [displayingInfo, setDisplayingInfo] = useState("");
    const { data: registeNewUserData, mutate: registeNewUserMutate }
        = useMutation('/literacyHome/vb/auth/register', 'POST');

    useEffect(() => {
        if (registeNewUserData) {
            if (registeNewUserData.registerDeny != null) {
                setDisplayingInfo(registeNewUserData.registerDeny);
                setSignUpContent({ userName: "", email: "", password: "" });
                setconfirmPasswordValue("");
            }
            if (registeNewUserData.success) {
                props.rigisterSuccess();
            }
        }
    }, [registeNewUserData]);

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpContent((prevValue) => ({ ...prevValue, [name]: value }));
    };

    const handleConfirmingPassword = (e) => {
        const { value } = e.target
        setconfirmPasswordValue(value);
        if (value === "") {
            setDisplayingInfo("");
        } else if (value === signUpContent.password) {
            setDisplayingInfo("Password match!");
        } else {
            setDisplayingInfo("Password not match...");
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
                            value={confirmPasswordValue}
                            placeholder="Confirm Password  Required*"
                            onChange={handleConfirmingPassword}
                            autoComplete="off"
                            required
                            autofocus
                        />
                        <p
                            style={{
                                color:
                                    displayingInfo === "Password match!"
                                        ? "darkgreen"
                                        : displayingInfo === "Password not match..."
                                            ? "darkred"
                                            : "black",
                            }}
                        >
                            {displayingInfo}
                        </p>
                        <button
                            className="submitButton"
                            disabled={displayingInfo !== "Password match!"}
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
