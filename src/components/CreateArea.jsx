import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

function CreateArea(props) {
  const [inputContent, setInputContent] = useState({ word: "", sentence: ""});
  const [isExpanded, setExpanded] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputContent((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function addButtonClicked(e) {
    // e.preventDefault();
    setInputContent(() => ({ word: "", sentence: ""}));
    setExpanded(false);
  }

  function toggleExpand() {
    setExpanded(prevExpanded => !prevExpanded);
  }

  return (
    <div className="mb-5">
      <form className="create-newVocabCard">
        <input
            name="word"
            onClick={toggleExpand}
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

export default CreateArea;