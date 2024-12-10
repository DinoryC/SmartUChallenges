import React, { useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';


const AuthCard = () => {
  const activeAndDefaultButtonColor = '#50a3a2';
  const inactiveButtonColor = '#D7D3BF';
  const [activeForm, setActiveForm] = useState(null);

  const [logInContent, setLogInContent] = useState({ email: "", password: "" });
  const [signUpContent, setSignUpContent] = useState({ userName: "", email: "", password: "" });
  const [passwordMatching, setPasswordMatching] = useState("");

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
      return activeAndDefaultButtonColor; 
    }
    if (activeForm === buttonType) {
      return activeAndDefaultButtonColor;
    }
    return inactiveButtonColor;
  };

  const handleButtonClick = (buttonType) => {
    // If the same button is clicked again, hide the form
    if (activeForm === buttonType) {
      setActiveForm(null);
    } else {
      setActiveForm(buttonType);
    }
  };

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
                placeholder="Email  -required"
                value={logInContent.email} 
                onChange={handleLogInChange}
                autoComplete="off" 
                required
                autofocus
              />
              <input
                type="text"
                name="password"
                placeholder="Password  -required"
                value={logInContent.password} 
                onChange={handleLogInChange}
                autoComplete="off" 
                required
                autofocus
              />
              <button className="submitButton">Submit</button>
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
                placeholder="User Name  -required"
                value={signUpContent.userName} 
                onChange={handleSingUpChange}
                autoComplete="off" 
                required
                autofocus
              />
              <input
                type="text"
                name="email"
                placeholder="Email  -required"
                value={signUpContent.email} 
                onChange={handleSingUpChange}
                autoComplete="off" 
                required
                autofocus
              />
              <input
                type="password"
                name="password"
                placeholder="Password  -required"
                value={signUpContent.password} 
                onChange={handleSingUpChange}
                autoComplete="off" 
                required
                autofocus
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password  -required"
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
              <button className="submitButton" disabled={passwordMatching !== "Password match!"}>Submit</button>
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
