import React from 'react';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';

const VocabGardenTopper = (props) => {

  const handleLogout = () => {
    axios.get('/literacyHome/vb/auth/logout', { withCredentials: true })
      .then(response => {
        props.setAuthState({ isAuthenticated: false, user: null });
      })
      .catch(error => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="vocabGardenTopper">
      <h1 className="headingStyle">Welcome to Vocabulary Garden</h1>


      <div className="position-relative w-100 mt-3" style={{ height: "auto" }}>
        {/* Left Div: Start at 10%, Width 24% */}
        <div
          className="position-absolute greetingUser text-wrap"
          style={{
            left: "9%",
            width: "25%",
          }}
        >
          {props.authState.isAuthenticated && (
            <h5>Hi {props.authState.user.username}</h5>
          )}
        </div>

        {/* Middle Div: Centered, Width 20% */}
        <div
          className="position-absolute decorationStyle text-center"
          style={{
            left: "50%",
            width: "24%",
            transform: "translateX(-50%)",
          }}
        >
          <span role="img" aria-label="leaf sprout" className="emoji">🌱</span>
          <span role="img" aria-label="books" className="emoji">📚</span>
          <span role="img" aria-label="pencil for writing" className="emoji">✏️</span>
          <span role="img" aria-label="butterfly" className="emoji">🦋</span>
        </div>

        {/* Right Div: Ends at 10% from the Right */}
        <div
          className="position-absolute logOutButton text-end"
          style={{
            right: "3%",
          }}
        >
          {props.authState.isAuthenticated && (
            <button
              type="button"
              className="btn btn-success"
              onClick={handleLogout}
            >
              <LogoutIcon />Log Out
            </button>
          )}
        </div>
      </div>


    </div>
  );
};

export default VocabGardenTopper;
