import axios from 'axios';

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import CssBaseline from "@material-ui/core/CssBaseline";

import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home/Home';
import Gallery from "./component/Gallery";
import NavigationBar from "./common/NavigationBar";
import EmptyBar from "./common/EmptyBar";
import Administration from "./component/Administration";
import UserProfile from "./component/UserProfile";

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import {
  getToken,
  removeUserSession,
  setUserInfo,
  setUserSession
} from './Utils/authentication';

import config from "./config.json";
import {SimpleIDB} from "./common/SimpleIDB";



export default function App() {
  // -> State
  const [authLoading, setAuthLoading] = useState(true);

  // ------------------------------------------------------------------
  // -> Subcomponents

  const LoginContainer = () => (
    <div className="container">
      <EmptyBar />
      <PublicRoute path="/login" component={Login} />
    </div>
  );

  const DefaultContainer = () => (
    <div>
      <div className="container">
        <NavigationBar />
        <PrivateRoute exact path="/" component={Home} />
        {/*<PublicRoute path="/login" component={Login} />*/}
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/gallery" component={Gallery} />
        <PrivateRoute path="/administration" component={Administration} />
        <PrivateRoute path="/profile" component={UserProfile} />
      </div>
      {/*<Footer />*/}
    </div>
  );


  const NotFound = () => (
    <div className="container">
      <EmptyBar />
      <PublicRoute component={Login} />
    </div>
  );


  // ------------------------------------------------------------------

  useEffect(() => {

    SimpleIDB.initialize().then();

    const token = getToken();
    if (!token)
      return;

    axios.get(
      config.API_URL+`/verify-token`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(response => {

      setUserSession(response.data.token, response.data.user);

      axios.get(config.API_URL+"/users/me",
        {
          headers: {
            'Authorization': `Bearer ${response.data.token}`,
            'Content-Type': 'application/json'
          }
        }
      ).then(response => {
        setUserInfo(response.data);
        setAuthLoading(false);
      }).catch(error => {
        if (error.response.status === 401) {
          // setError(error.response.data.message);
        } else {
          // setError("Something went wrong. Please try again later.");
        }
      });

    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });

  }, []);

  // ------------------------------------------------------------------

  if (authLoading && getToken()) {
    return <div className="content">Checking authentication...</div>
  }

  return (
    <div className="App">
      <CssBaseline />
      <BrowserRouter>
        <div className="content">
          <Switch>
            <Route exact path="/login" component={LoginContainer}/>
            <Route
              exact path={["/", "/dashboard", "/gallery", "/administration", "/profile"]}
              component={DefaultContainer}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}
