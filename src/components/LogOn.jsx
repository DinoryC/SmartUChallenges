import { useHistory } from 'react-router-dom';
import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

function LogOn() {
    const [inputContent, setInputContent] = useState({ word: "", sentence: "", createdDate: ""});
    const [isExpanded, setExpanded] = useState(false);

    const history = useHistory();

    const handleLogin = async () => {
    // Perform login logic, get userId and token
    const userId = '...'; // Retrieved after login
    const token = '...'; // Retrieved after login

    // Store the token (e.g., in localStorage or context)
    localStorage.setItem('token', token);

    // Redirect to the user's vocabulary page
    history.push(`/user/${userId}`);
  };

  return (
    <div>
      <form className="create-newVocabCard">
        <input
            name="word"
            onClick={expand}
            placeholder="Add a new word"
            onChange={handleChange}
            value={inputContent.word}
          />
        {isExpanded && (<textarea
          name="sentence"
          placeholder="Make a sentence out of it"
          rows="3"
          onChange={handleChange}
          value={inputContent.sentence}
        />)}
        <Fab
          onClick={() => {
            props.addItemClicked(inputContent);
            addButtonClicked();
          }}
        >
          <AddIcon />
        </Fab>
      </form>
    </div>
  );
}

export default LogOn;