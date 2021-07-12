import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home/Home';
import Album from "./component/Album";
import NavigationBar from "./common/NavigationBar";
import EmptyBar from "./common/EmptyBar";
import Administration from "./component/Administration";

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import {getToken, getUserRole, removeUserSession, setUserInfo, setUserSession} from './Utils/authentication';

import config from "./config.json";
import CssBaseline from "@material-ui/core/CssBaseline";
import {SimpleIDB} from "./common/SimpleIDB";


function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);

  console.log('App() isAdmin', isAdmin);

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
        <PrivateRoute path="/album" component={Album} />
        {/*https://jasonwatmore.com/post/2019/02/01/react-role-based-authorization-tutorial-with-example*/}
        {isAdmin && <PrivateRoute path="/administration" component={Administration} />}
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


  const isAdminUser = () => {
    const role = getUserRole();
    if (role) {
      return role === 'admin';
    } else {
      return null;
    }
  }

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
        setIsAdmin(isAdminUser());
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

    setIsAdmin(isAdminUser());

  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  // ------------------------------------------------------------------

  return (
    <div className="App">
      <CssBaseline />
      <BrowserRouter>
        <div className="content">
          <Switch>
            <Route exact path="/login" component={LoginContainer}/>
            <Route
              exact path={
                isAdmin ?
                ["/", "/dashboard", "/album", "/administration"] :
                ["/", "/dashboard", "/album"]
              }
              component={DefaultContainer}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}


export default App;
