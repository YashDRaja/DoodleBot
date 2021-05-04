import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';

const App  = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/createAccount">
          <CreateAccount />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App;
