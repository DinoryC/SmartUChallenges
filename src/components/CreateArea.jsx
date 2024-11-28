import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';

function CreateArea(props) {
  const [inputContent, setInputContent] = useState({ word: "", sentence: "", createdDate: ""});
  const [isExpanded, setExpanded] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    updateInputDate()
    setInputContent((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function updateInputDate() {
    const today = new Date();
    const dateCreated = `${String(today.getDate()).padStart(2, '0')}/${
            String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`
    console.log("input date = " + dateCreated);
    setInputContent((prevValue) => {
        return { ...prevValue, createdDate: dateCreated };
    });
  }

  function addButtonClicked() {
    event.preventDefault();
    setInputContent(() => ({ word: "", sentence: "", createdDate: ""}));
    setExpanded(false);
  }

  function expand() {
    setExpanded(true);
  }

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
        <button
          onClick={() => {
            props.addItemClicked(inputContent);
            addButtonClicked();
          }}
        >
          <AddIcon />
        </button>
      </form>
    </div>
  );
}

export default CreateArea;