import React, { useState, useEffect } from "react";
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import useMutation from "../hooks/useMutation";

const AuthCard = (props) => {
  const activeAndDefaultFormColor = '#50a3a2';
  const inactiveFormColor = '#D7D3BF';
  const [activeForm, setActiveForm] = useState(null);

  const [logInContent, setLogInContent] = useState({ email: "", password: "" });
  const [signUpContent, setSignUpContent] = useState({ userName: "", email: "", password: "" });
  const [passwordMatching, setPasswordMatching] = useState("");

  const { data: loginData, mutate: loginMutate }
    = useMutation('/literacyHome/vb/auth/login', 'POST');

  const { data: registeNewUserData, mutate: registeNewUserMutate }
    = useMutation('/literacyHome/vb/auth/register', 'POST');

  useEffect(() => {
    if (loginData) {
      if (loginData.success) {
        props.updateUser();
      }
    }
  }, [loginData]);

  useEffect(() => {
    if (registeNewUserData) {
      if (registeNewUserData.success) {
        props.updateUser();
      }
    }
  }, [registeNewUserData]);

  function handleLogInChange(e) {
    const { name, value } = e.target;
    setLogInContent((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleSingUpChange(e) {
    const { name, value } = e.target;
    setSignUpContent((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleConfirmingPassword(e) {
    const { value } = e.target;

    if (!value) {
      setPasswordMatching("");
    } else if (value === signUpContent.password) {
      setPasswordMatching("Password match!");
    } else {
      setPasswordMatching("Password not match...");
    }
  }

  const getButtonColor = (buttonType) => {
    if (activeForm === null) {
      return activeAndDefaultFormColor;
    }
    if (activeForm === buttonType) {
      return activeAndDefaultFormColor;
    }
    return inactiveFormColor;
  };

  const handleButtonClick = (buttonType) => {
    // If the same button is clicked again, hide the form
    if (activeForm === buttonType) {
      setActiveForm(null);
    } else {
      setActiveForm(buttonType);
    }
  };

  const submitLogIn = async (e) => {
    e.preventDefault();
    try {
      await loginMutate(logInContent);
    } catch (err) {
      console.error("Failed to log in with email: " + logInContent.email);
    }
  }

  const submitRegister = async (e) => {
    e.preventDefault();
    try {
      await registeNewUserMutate(signUpContent);
    } catch (err) {
      console.error("Failed to registe the new user with email: " + signUpContent.email);
    }
  }

  return (
    <div className="authCardContainer">
      <div className="authCard">
        <button
          style={{ color: getButtonColor('logIn') }}
          onClick={() => handleButtonClick('logIn')}
        >
          <LoginIcon className="muiIconOnButton" />
          Log In
        </button>
        {activeForm === 'logIn' && (
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

        <button
          style={{ color: getButtonColor('signUpEmail') }}
          onClick={() => handleButtonClick('signUpEmail')}
        >
          <EmailIcon className="muiIconOnButton" />
          Sign Up with Email
        </button>
        {activeForm === 'signUpEmail' && (
          <div className="formContainer">
            <form>
              <input
                type="text"
                name="userName"
                placeholder="User Name  Required*"
                value={signUpContent.userName}
                onChange={handleSingUpChange}
                autoComplete="off"
                required
                autofocus
              />
              <input
                type="text"
                name="email"
                placeholder="Email  Required*"
                value={signUpContent.email}
                onChange={handleSingUpChange}
                autoComplete="off"
                required
                autofocus
              />
              <input
                type="password"
                name="password"
                placeholder="Password  Required*"
                value={signUpContent.password}
                onChange={handleSingUpChange}
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

        <button
          style={{ color: getButtonColor('signUpGoogle') }}
          onClick={() => handleButtonClick('signUpGoogle')}
        >
          <GoogleIcon className="muiIconOnButton" />
          Sign Up with Google
        </button>
        {/* No form for Google specified */}
      </div>
    </div>
  );
};

export default AuthCard;
