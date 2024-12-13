import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import UserVocabs from "./UserVocabs";
import AuthCard from "./AuthCard";
import VocabGardenTopper from "./VocabGardenTopper";
import axios from 'axios';

function VocabGardenApp() {
  return (
    <Router>
      <div className="mt-3 mb-5">
        {/* <VocabGardenTopper authState={authState} setAuthState={setAuthState} /> */}
        <VocabGardenTopper />
        <div className="mt-3">
          <Switch>
            {/* <Route exact path="/literacyHome/vocabGardenApp/">
              <authCard />
            </Route> */}

            {/* <Route exact path="/literacyHome/vocabGardenApp/user_id/:userId"> */}
            <Route exact path="/literacyHome/vocabGardenApp/user">
              <UserVocabs />
            </Route>

            <Route exact path="/literacyHome/vocabGardenApp/auth">
              <AuthCard />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default VocabGardenApp;

            // {/* Optional: Redirect unknown routes */}
            // {/* <Route path="*">
            //   <Redirect to="/literacyHome/vocabGardenApp/" />
            // </Route> */}