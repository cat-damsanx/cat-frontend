import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Exam from './Exam';
import Main from './Main';

const Navbar = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/main">
            <Main />
          </Route>
          <Route path="/exam">
            <Exam />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default Navbar;
