import React, {Fragment, useEffect, useState} from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Route, Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import { isAdminUser } from "../Utils/authentication";


const useStyles = makeStyles((theme) => ({
  // https://stackoverflow.com/questions/48928764
  fullHeight: {
    // ...theme.mixins.toolbar,
    minHeight: 52
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


export default function SimpleTabs(props) {
  const allTabs = ["/", "/login", "/dashboard", "/album", "/administration"];
  const classes = useStyles();
  const [isAdmin, setIsAdmin] = useState(null);


  // https://jasonwatmore.com/post/2019/02/01/
  //   react-role-based-authorization-tutorial-with-example

  useEffect(() => {

    setIsAdmin(isAdminUser());
    console.log('isAdmin', isAdmin);

  }, [isAdmin]);

  console.log(isAdmin);

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
                {/* HOME */}
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
                {/* LOGIN */}
                {/*<Tab*/}
                {/*  classes={{*/}
                {/*    root: classes.fullHeight,*/}
                {/*    selected: classes.colorfulTabs,*/}
                {/*    // disabled: classes.colorfulTabs*/}
                {/*  }}*/}
                {/*  label="Login"*/}
                {/*  value={allTabs[1]}*/}
                {/*  component={Link}*/}
                {/*  to={allTabs[1]}*/}
                {/*/>*/}
                {/* DASHBOARD */}
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
                {/* ALBUM */}
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
                {/* ADMINISTRATION */}
                {isAdmin && <Tab
                  classes={{
                    root: classes.fullHeight,
                    selected: classes.colorfulTabs,
                    // disabled: classes.colorfulTabs
                  }}
                  label="Administration"
                  value={allTabs[4]}
                  component={Link}
                  to={allTabs[4]}
                />}
              </Tabs>
            </Fragment>
          )}
        />
      </div>
  );
}

