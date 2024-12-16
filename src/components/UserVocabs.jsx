import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import VocabCard from "./VocabCard";
import CreateArea from "./CreateArea";
import useFetch from "../hooks/useFetch";
import useMutation from "../hooks/useMutation";

function UserVocabs(props) {
  const [appState, setAppState] = useState({ vocabArray: [], isLoading: true, error: null });

  // Fetch initial data
  const { data: fetchedData, isLoading, error }
    = useFetch('/literacyHome/vb/user/');

  // Set up mutations
  const { data: addData, isLoading: addLoading, error: addError, mutate: addVocabCardMutate }
    = useMutation('/literacyHome/vb/user/', 'POST');
  const { data: editData, isLoading: editLoading, error: editError, mutate: editVocabCardMutate }
    = useMutation('/literacyHome/vb/user/', 'PATCH');
  const { data: deleteData, isLoading: deleteLoading, error: deleteError, mutate: deleteVocabCardMutate }
    = useMutation('/literacyHome/vb/user/', 'DELETE');

  // Sync fetched data into appState once available
  useEffect(() => {
    if (fetchedData) {
      setAppState((prevState) => ({
        ...prevState,
        vocabArray: fetchedData,
        isLoading: isLoading,
        error: error,
      }));
      console.log(JSON.stringify(appState.vocabArray[3], null, 2))
    }
  }, [fetchedData, isLoading, error]);

  // Handle POST
  useEffect(() => {
    if (addData) {
      setAppState((prevState) => ({
        ...prevState,
        vocabArray: [...prevState.vocabArray, addData]

      }));
    }
  }, [addData]);

  // Handle PATCH
  useEffect(() => {
    if (editData) {
      setAppState((prevState) => {
        const updatedArray = prevState.vocabArray.map((card) =>
          card.vocab_id === editData.vocab_id ? editData : card
        );
        return { ...prevState, vocabArray: updatedArray };
      });
    }
  }, [editData]);

  async function AddNewVocabCard(cardContent) {
    try {
      await addVocabCardMutate(cardContent);
    } catch (err) {
      console.error("Failed to add card:", err);
    }
  }

  async function updateVocabCard(editedCardContent) {
    try {
      await editVocabCardMutate(editedCardContent);
    } catch (err) {
      console.error("Failed to edit card:", err);
    }
  }

  async function deleteVocabCard(toBeDeletedCardID) {
    try {
      await deleteVocabCardMutate({ vocabId: toBeDeletedCardID });
      setAppState((prevState) => {
        const updatedArray = prevState.vocabArray.filter((card) => card.vocab_id !== toBeDeletedCardID);
        return { ...prevState, vocabArray: updatedArray };
      });
    } catch (err) {
      console.error("Failed to delete card:", err);
    }
  }

  return (
    <div>
      {appState.error && <div>{appState.error}</div>}
      {appState.isLoading && <div>Loading...</div>}
      {appState.vocabArray && (
        <div className="container-fluid">
          <div className="custom-container">
            <CreateArea addItemClicked={AddNewVocabCard} />
            <div className="row justify-content-center">
              {appState.vocabArray.map((wordCard, index) => (
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
                    key={wordCard.vocab_id}
                    vocabId={wordCard.vocab_id}
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
