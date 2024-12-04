import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from '@mui/icons-material/Edit';

function VocabCard(props) {
    function editCard() {
        props.onDelete(props.id);
    }

    function deleteCard() {
        props.onDelete(props.id);
    }

    return (
        <div className="vocabCard">
            <h1>{props.word}</h1>
            <h3>{props.sentence}</h3>
            <p>Created: {props.createdDate}</p>
            <button 
                onClick={() => {
                props.deleteItem(props.id);
                }}>
                <DeleteForeverIcon />
            </button>
            <button 
                onClick={() => {
                props.editItem(props.id);
                }}>
                <EditIcon />
            </button>
        </div>
    );
}

export default VocabCard;