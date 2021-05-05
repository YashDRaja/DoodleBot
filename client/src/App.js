import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Account from './pages/Account';
import Singleplayer from './pages/Singleplayer';
import { AuthContext } from './helpers/AuthContext';
import axios from 'axios';

const App = () => {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
      const response = await axios.get("http://localhost:3001/users/auth", { withCredentials: true })
      if (response.data.error) {
        setAuthState(false);
      } else {
        setAuthState(true);
      }
      } catch (e) {
        console.log(e);
      }
    }
    fetchAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/createAccount">
            <CreateAccount />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/vs-ai">
            <Singleplayer />
          </Route>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App;
