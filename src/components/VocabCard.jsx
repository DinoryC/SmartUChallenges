import React, { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function VocabCard(props) {
    const [editedInput, setEditedInput] = useState({
        vocabId: props.vocabId, 
        editedWord: props.word, 
        editedSentence: props.sentence
    });
    const [isExpandForEdit, setIsExpandForEdit] = useState(false);
  
    function handleChange(e) {
      const { name, value } = e.target;
      setEditedInput((prevValue) => {
        return { ...prevValue, [name]: value };
      });
    }

    function handleEditSubmit() {
        props.editItem(editedInput);
        setIsExpandForEdit(false);
    }

    return (
        <div className="vocabCard">
            { !isExpandForEdit && <h1>{props.word}</h1> }
            { isExpandForEdit && (
                <input 
                    type="text"
                    name="editedWord"
                    value={editedInput.editedWord} 
                    onChange={handleChange}
                    autoComplete="off" 
                    autofocus
                />
            )}
            { isExpandForEdit && (
                <input 
                    rows="3"
                    onChange={handleChange} 
                    type="text" 
                    name="editedSentence"
                    value={editedInput.editedSentence} 
                    autoComplete="off" 
                />
            )}
            { isExpandForEdit && (
                <button 
                    onClick={() => {
                        handleEditSubmit();
                    }}>
                    <DoneIcon />
                </button> 
            )}
            { !isExpandForEdit && <h3>{props.sentence}</h3> }
            <p>Created: {props.createdDate}</p>
            <button 
                onClick={() => {
                    props.deleteItem(props.vocabId);
                }}>
                <DeleteForeverIcon />
            </button>
            { !isExpandForEdit && (
                <button 
                    onClick={() => {
                        setIsExpandForEdit(true);
                    }}>
                    <EditIcon />
                </button> 
            )}
        </div>
    );
}

export default VocabCard;