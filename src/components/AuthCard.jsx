import React, { useState } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import RegisterForm from "./RegisterForm";
import LogInForm from "./LogInForm";

const AuthCard = (props) => {
  const activeAndDefaultFormColor = '#50a3a2';
  const inactiveFormColor = '#D7D3BF';
  const [activeForm, setActiveForm] = useState(null);

  const updateAuthStatus = () => props.updateUser();

  const getButtonColor = (buttonType) => {
    if (activeForm === null) {
      return activeAndDefaultFormColor;
    }
    if (activeForm === buttonType) {
      return activeAndDefaultFormColor;
    }
    return inactiveFormColor;
  };

  const formChosen = (buttonType) => {
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

        <LogInForm
          activeForm={activeForm}
          handleButtonClick={formChosen}
          getButtonColor={getButtonColor}
          logInSuccess={updateAuthStatus}
          getButtonColor={getButtonColor}
        />

        <RegisterForm
          activeForm={activeForm}
          handleButtonClick={formChosen}
          getButtonColor={getButtonColor}
          rigisterSuccess={updateAuthStatus}
          getButtonColor={getButtonColor}
        />

        <a href="/literacyHome/vb/auth/google">
          <button
            style={{ color: getButtonColor('signUpGoogle') }}
            onClick={() => formChosen('signUpGoogle')}
          >
            <GoogleIcon className="muiIconOnButton" />
            Sign Up with Google
          </button>
        </a>

      </div>
    </div>
  );
};

export default AuthCard;
