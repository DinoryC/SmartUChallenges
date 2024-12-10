import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import UserVocabs from "./UserVocabs";
import AuthCard from "./AuthCard";
import VocabGardenTopper from "./VocabGardenTopper";

function VocabGardenApp() {
  const isAuthenticated = false; // hard code for now

  return (
    <Router>
      <div className="mt-3 mb-5">
        <VocabGardenTopper />
        <div className="mt-3">
          <Switch>
            <Route exact path="/literacyHome/vocabGardenApp/">
              {isAuthenticated ? <UserVocabs /> : <Redirect to="/literacyHome/vocabGardenApp/auth" />}
            </Route>
            <Route exact path="/literacyHome/vocabGardenApp/auth">
              {isAuthenticated ? <Redirect to="/literacyHome/vocabGardenApp/" /> : <AuthCard />}
            </Route>
            {/* Optional: Redirect unknown routes */}
            <Route path="*">
              <Redirect to="/literacyHome/vocabGardenApp/" />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default VocabGardenApp;
