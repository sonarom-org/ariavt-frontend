import React, { Fragment } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Route, Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  // https://stackoverflow.com/questions/48928764
  fullHeight: {
    // ...theme.mixins.toolbar,
    minHeight: 48
  },
  bigIndicator: {
    height: 4
  },
  indicator: {
    backgroundColor: 'white',
  },
  colorfulTabs: {
    backgroundColor: "#515eb5",
  },
}));


export default function SimpleTabs() {
  const allTabs = ["/", "/login", "/dashboard", "/album"];
  const classes = useStyles();

  return (
      <div className="App">
        <Route
          path="/"
          render={({ location }) => (
            <Fragment>
              <Tabs
                classes={{
                  root: classes.fullHeight,
                  indicator: classes.bigIndicator
                }}
                value={location.pathname}
              >
                <Tab
                  classes={{
                    root: classes.fullHeight,
                    selected: classes.colorfulTabs,
                    // disabled: classes.colorfulTabs
                  }}
                  label="Home"
                  value={allTabs[0]}
                  component={Link}
                  to={allTabs[0]}
                />
                <Tab
                  classes={{
                    root: classes.fullHeight,
                    selected: classes.colorfulTabs,
                    // disabled: classes.colorfulTabs
                  }}
                  label="Login"
                  value={allTabs[1]}
                  component={Link}
                  to={allTabs[1]}
                />
                <Tab
                  classes={{
                    root: classes.fullHeight,
                    selected: classes.colorfulTabs,
                    // disabled: classes.colorfulTabs
                  }}
                  label="Dashboard"
                  value={allTabs[2]}
                  component={Link}
                  to={allTabs[2]}
                />
                <Tab
                  classes={{
                    root: classes.fullHeight,
                    selected: classes.colorfulTabs,
                    // disabled: classes.colorfulTabs
                  }}
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

