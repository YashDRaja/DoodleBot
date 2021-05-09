import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import ForgotPass from "./pages/ForgotPass";
import ResetPass from "./pages/ResetPass";
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import GamesPlayed from './pages/GamesPlayed';
import Singleplayer from './pages/Singleplayer';
import { AuthContext } from './helpers/AuthContext';
import axios from 'axios';

const App = () => {
  const [authState, setAuthState] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const fetchAuth = async () => {
    try {
    const response = await axios.get("http://localhost:3001/users/auth", { withCredentials: true })
    if (response.data.error) {
      setAuthState(false);
    } else {
      setAuthState(true);
    }
    setAuthLoading(true);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState, authLoading }}>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/createAccount">
            <CreateAccount />
          </Route>
          <Route path="/games-played">
            <GamesPlayed />
          </Route>
          <Route path="/vs-ai">
            <Singleplayer />
          </Route>
          <Route path="/forgotPass">
            <ForgotPass />
          </Route>
          <Route path="/password/:id">
            <ResetPass />
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
