import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, route, Switch } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import VocabCard from "./VocabCard";
import CreateArea from "./CreateArea";
import useFetch from "../hooks/useFetch";
// import useFetch from "../../routes/api/";

function UserVocabs() {
  // const [vocabArray, setVocabArray] = useState(null);
  // const [isPending, setIsPending] = useState(true);
  // const [error, setError] = useState(null);
  // const { userId } = useParams();
  const userId = 1;
  // console.log("UserVocabs.jsx   useParams, userId = " + userId);
  const { data: vocabArray, isPending, error } = useFetch(`/literacyHome/vocabGarden/${userId}`);
  function AddNewVocabCard(item) {
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
  
  // Fetch all words on component mount
  // useEffect(() => {
  //   fetch('/api/words')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setError(null);
  //       setVocabArray(data);
  //       setIsPending(false);
  //     })
  //     .catch((err) => {
  //       setIsPending(false);
  //       setError(err.message);
  //       console.error('Error fetching words:', err);
  //     });
  // }, []);

  // // Function to add a new word
  // const addWord = (newWord) => {
  //   setIsPending(true);

  //   fetch('/api/words', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(newWord),
  //   })
  //     .then((response) => response.json())
  //     .then((addedWord) => setWords((prevWords) => [addedWord, ...prevWords]))
  //     .catch((err) => console.error('Error adding word:', err));
  //     setIsPending(false);
  // };

  // // Function to delete a word
  // const deleteWord = (id) => {
  //   fetch(`/api/words/${id}`, { method: 'DELETE' })
  //     .then(() => setWords((prevWords) => prevWords.filter((word) => word.id !== id)))
  //     .catch((err) => console.error('Error deleting word:', err));
  // };

console.log("error : " + error);
console.log("isPending : " + isPending);
console.log("vocabArray : " + vocabArray);

    return (
        <div>
        <p> test is working</p>
            { error && <div>{ error }</div> }
            { isPending &&  <div>Loading...</div> }
            { vocabArray && 
            <div class="container-fluid d-flex justify-content-center align-items-center mt-4 mb-0">
                <div>
                    <CreateArea addItemClicked={AddNewVocabCard} />
                    {vocabArray.map((wordCard, index) => (
                    <VocabCard
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
            }
        </div>
    );
}

export default UserVocabs;