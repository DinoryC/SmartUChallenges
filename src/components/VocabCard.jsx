import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

function VocabCard(props) {
    function editCard() {
        // NEEd LOGIC HERE 
        // include the content of the form class="edit" and send a patch request
        props.editItem();
    }

    function deleteCard() {
        props.onDelete(props.vocabId);
    }

    function handleEditButtonClicked(vocabId) {
        document.getElementById("vocabCard" + vocabId).setAttribute("hidden", true)
        document.getElementById("editButton" + vocabId).setAttribute("hidden", true)
        document.getElementById("doneButton" + vocabId).removeAttribute("hidden")
        document.getElementById("editedSentenceInput" + vocabId).removeAttribute("hidden")
    }

    return (
        <div className="vocabCard">
            <h1 id={`vocabCard${props.vocabId}`}>{props.word}</h1>
            <form class="edit" action="/edit" method="post">
                <input type="hidden" name="editedWord" value={props.word} />
                <input id={`editedSentenceInput${props.vocabId}`} type="text" name="editedSentence" value={props.sentence} autocomplete="off" autofocus="true" hidden="true" />
                <button id={`doneButton${props.vocabId}`} class="edit" type="submit" hidden><DoneIcon /></button>
            </form>
            <h3>{props.sentence}</h3>
            <p>Created: {props.createdDate}</p>
            <button 
                onClick={() => {
                props.deleteItem(props.vocabId);
                }}>
                <DeleteForeverIcon />
            </button>
            <button id={`editButton${props.vocabId}`}
                onClick={() => {
                handleEditButtonClicked(props.vocabId);
                console.log("props.vocabId = " + props.vocabId);
                props.editItem(props.vocabId);
                }}>
                <EditIcon />
            </button>
        </div>
    );
}

export default VocabCard;