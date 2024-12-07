import React, { useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';

const AuthCard = () => {
  const [activeForm, setActiveForm] = useState(null);

  // Determine button text colors based on active form
  const getButtonColor = (buttonType) => {
    if (activeForm === null) {
      return '#50a3a2'; // default color
    }
    if (activeForm === buttonType) {
      return '#50a3a2'; // active button retains original color
    }
    return '#D7D3BF'; // inactive buttons turn dark grey
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
    <div className="greatingCardContainer">
      <div className="greatingCard">
        <button
          style={{ color: getButtonColor('logOn') }}
          onClick={() => handleButtonClick('logOn')}
        >
          <LoginIcon style={{ marginRight: '10px' }} />
          Log On
        </button>
        {activeForm === 'logOn' && (
          <div className="formContainer">
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="submitButton">Submit</button>
          </div>
        )}

        <button
          style={{ color: getButtonColor('signUpEmail') }}
          onClick={() => handleButtonClick('signUpEmail')}
        >
          <EmailIcon style={{ marginRight: '10px' }} />
          Sign Up with Email
        </button>
        {activeForm === 'signUpEmail' && (
          <div className="formContainer">
            <input type="text" placeholder="User Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button className="submitButton">Submit</button>
          </div>
        )}

        <button
          style={{ color: getButtonColor('signUpGoogle') }}
          onClick={() => handleButtonClick('signUpGoogle')}
        >
          <GoogleIcon style={{ marginRight: '10px' }} />
          Sign Up with Google
        </button>
        {/* No form for Google specified */}
      </div>
    </div>
  );
};

export default AuthCard;
