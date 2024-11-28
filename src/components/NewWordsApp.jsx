import React, { useState } from "react";
import VocabularyCard from "./VocabularyCard";
import CreateArea from "./CreateArea";

function NewWordsApp() {
    const [vocabArray, setVocabArray] = useState([]);
  
    function AddNewWordCard(item) {
        console.log(item);
      setVocabArray((prevArray) => {
        return [...prevArray, item];
      });
    }

    function updateVocabCard(newCardContent) {
        // update content
        // setVocabArray((prevValue) => {
        //     return prevValue.filter((vocabCard, id) => {
        //         return id !== index;
        //     });
        // });
    }
  
    function deleteVocabCard(index) {
      setVocabArray((prevValue) => {
        return prevValue.filter((vocabCard, id) => {
          return id !== index;
        });
      });
    }

  
    return (

        <div class="container-fluid d-flex justify-content-center align-items-center mt-4 mb-0">
            <div>
                <CreateArea addItemClicked={AddNewWordCard} />
                {vocabArray.map((wordCard, index) => (
                <VocabularyCard
                    key={index}
                    id={index}
                    word={wordCard.word}
                    sentence={wordCard.sentence}
                    createdDate={wordCard.createdDate}
                    editItem={updateVocabCard}
                    deleteItem={deleteVocabCard}
                />
                ))}
            </div>
        </div>
    );
  }

export default NewWordsApp;