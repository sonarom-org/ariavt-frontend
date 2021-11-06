import React, {Fragment, useEffect, useState} from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Route, Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import { isAdminUser } from "../authentication/authentication";


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
  // const allTabs = ["/", "/login", "/dashboard", "/docs", "/administration"];
  const validTabs = ["/", "/login", "/docs", "/users"];
  const classes = useStyles();
  const [isAdmin, setIsAdmin] = useState(isAdminUser());


  function checkPathname(pathname) {
    if (validTabs.includes(pathname)) {
      return pathname;
    } else {
      return false;
    }
  }

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
                value={checkPathname(location.pathname)}
              >
                {/* HOME */}
                <Tab
                  classes={{
                    root: classes.fullHeight,
                    selected: classes.colorfulTabs,
                    // disabled: classes.colorfulTabs
                  }}
                  label="Gallery"
                  value={"/"}
                  component={Link}
                  to={"/"}
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
                {/*  Gallery={Link}*/}
                {/*  to={allTabs[1]}*/}
                {/*/>*/}
                {/* DASHBOARD */}
                {/*<Tab*/}
                {/*  classes={{*/}
                {/*    root: classes.fullHeight,*/}
                {/*    selected: classes.colorfulTabs,*/}
                {/*    // disabled: classes.colorfulTabs*/}
                {/*  }}*/}
                {/*  label="Dashboard"*/}
                {/*  value={allTabs[2]}*/}
                {/*  Gallery={Link}*/}
                {/*  to={allTabs[2]}*/}
                {/*/>*/}
                {/* GALLERY */}
                {/* USERS */}
                {isAdmin && <Tab
                    classes={{
                        root: classes.fullHeight,
                        selected: classes.colorfulTabs,
                        // disabled: classes.colorfulTabs
                    }}
                    label="Users"
                    value={"/users"}
                    component={Link}
                    to={"/users"}
                />}
                <Tab
                  classes={{
                    root: classes.fullHeight,
                    selected: classes.colorfulTabs,
                    // disabled: classes.colorfulTabs
                  }}
                  label="Docs"
                  value={"/docs"}
                  component={Link}
                  to={"/docs"}
                />
              </Tabs>
            </Fragment>
          )}
        />
      </div>
  );
}

