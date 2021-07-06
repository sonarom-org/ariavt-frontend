import React, { Fragment } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Route, Link} from "react-router-dom";


export default function SimpleTabs() {
  const allTabs = ["/", "/login", "/dashboard", "/album"];

  return (

      <div className="App">
        <Route
          path="/"
          render={({ location }) => (
            <Fragment>
              <Tabs value={location.pathname}>
                <Tab
                  label="Home"
                  value={allTabs[0]}
                  component={Link}
                  to={allTabs[0]}
                />
                <Tab
                  label="Login"
                  value={allTabs[1]}
                  component={Link}
                  to={allTabs[1]}
                />
                <Tab
                  label="Dashboard"
                  value={allTabs[2]}
                  component={Link}
                  to={allTabs[2]}
                />
                <Tab
                  label="Album"
                  value={allTabs[3]}
                  component={Link}
                  to={allTabs[3]}
                />
              </Tabs>
            </Fragment>
          )}
        />
      </div>
  );
}

