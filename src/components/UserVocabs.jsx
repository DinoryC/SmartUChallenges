import React, { useState, useEffect } from "react";
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
  const { data: vocabArray, isPending, error } = useFetch(`/literacyHome/vocabGardenApp/user/test`);
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
  
  return (
    <div>
      <p>Test is working</p>
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {vocabArray && (
        <div className="container-fluid">
          <div className="custom-container">
            <CreateArea addItemClicked={AddNewVocabCard} />
            <div className="row justify-content-center">
              {vocabArray.map((wordCard, index) => (
                <div
                  key={index}
                  className="
                    col-12
                    col-sm-6
                    col-md-6
                    col-lg-4
                    col-xl-3
                    d-flex
                    justify-content-center
                    mb-4
                  "
                >
                  <VocabCard
                    id={index}
                    word={wordCard.word}
                    sentence={wordCard.sentence}
                    createdDate={wordCard.created_at.substring(0, 10)}
                    editItem={updateVocabCard}
                    deleteItem={deleteVocabCard}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserVocabs;

  // Fetch all words on component mount
  // useEffect(() => {
  //   fetch(`/literacyHome/vocabGardenApp/user/${userId}`)
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