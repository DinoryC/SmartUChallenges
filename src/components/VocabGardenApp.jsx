import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserVocabs from "./UserVocabs";
import AuthCard from "./AuthCard";
import VocabGardenTopper from "./VocabGardenTopper";

function VocabGardenApp() {
  return (
    <Router>
      <div className ="mt-3 mb-5">
        <VocabGardenTopper />
        <AuthCard />
        <div className ="mt-3">
          <Switch>
            <Route exact path="/literacyHome/vocabGardenApp/user/:userId">
              <UserVocabs />
            </Route>
            <Route exact path="/literacyHome/vocabGardenApp/">
              <UserVocabs />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default VocabGardenApp;