import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';
import UploadFiles from "./component/uploadFiles";
import Album from "./component/Album";
import {Footer, NavigationBar} from "./common_ui";

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './Utils/authentication';

import config from "./config.json";
import CssBaseline from "@material-ui/core/CssBaseline";


function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    axios.get(
      config.API_URL+`/verify-token`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(response => {
      setUserSession(response.data.token, response.data.user);
      setAuthLoading(false);
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <CssBaseline />
      {/*<NavigationBar />*/}
      <BrowserRouter>
        <div>
          <div className="header">
            <NavLink exact activeClassName="active" to="/">
              Home
            </NavLink>
            <NavLink activeClassName="active" to="/login">
              Login
            </NavLink>
            <small>(Access without token only)</small>
            <NavLink activeClassName="active" to="/dashboard">
              Dashboard
            </NavLink>
            <small>(Access with token only)</small>
            <NavLink activeClassName="active" to="/image-upload">
              Image upload
            </NavLink>
            <small>(Access with token only)</small>
            <NavLink activeClassName="active" to="/album">
              Image gallery
            </NavLink>
            <small>(Access with token only)</small>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/image-upload" component={UploadFiles} />
              <PrivateRoute path="/album" component={Album} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
      {/*<Footer />*/}
    </div>
  );
}

export default App;
