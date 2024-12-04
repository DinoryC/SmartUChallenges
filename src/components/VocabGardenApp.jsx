import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserVocabs from "./UserVocabs";
import LogOn from "./LogOn";
import VocabGardenTopper from "./VocabGardenTopper";

function VocabGardenApp() {
  return (
    <Router>
      <div className ="VocabGardenApp">
        <VocabGardenTopper />
        <div>
          <Switch>
            <Route exact path="/literacyHome/vocabGardenApp">
              <UserVocabs />
            </Route>
            <Route exact path="/logOn">
              <LogOn />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default VocabGardenApp;