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
      <div className="decorationStyle">
        <span role="img" aria-label="flower">🌸</span>
        <span role="img" aria-label="leaf sprout">🌱</span>
        <span role="img" aria-label="books">📚</span>
        <span role="img" aria-label="pencil for writing">✏️</span>
        <span role="img" aria-label="butterfly">🦋</span>
      </div>
      <div >
        {props.authState.isAuthenticated && (
          <button onClick={handleLogout}><LogoutIcon />Logout</button>
        )}
      </div>
    </div>
  );
};

export default VocabGardenTopper;
