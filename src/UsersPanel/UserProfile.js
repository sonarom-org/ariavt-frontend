import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Footer, SectionTitle} from "../common/CommonUI";
import {getUserInfo, isAdminUser} from "../authentication/authentication";
import EditUser from "./EditUser";
import EditUserForm from "./EditUserForm";


const useStyles = makeStyles((theme) => ({
  fullHeight: {
    // - <app bar height>
    minHeight: 'calc(100vh - 48px)',
  },
  userForm: {
    margin: 'auto',
    maxWidth: 600,
  }
}));


export default function UserProfile(props) {
  // -> Styles
  const classes = useStyles();
  // -> States
  const [userInfo, setUserInfo] = useState(getUserInfo());


  // ------------------------------------------------------------------

  useEffect(() => {
    setUserInfo(getUserInfo());
  }, []);



  // ------------------------------------------------------------------

  return (
    <div>
      <div className={classes.fullHeight}>
        <SectionTitle
          title={"User profile"}
          subtitle={""}
        />
        <div className={classes.userForm}>
          <EditUserForm
            title={""}
            adminEditor={isAdminUser()}
            user={userInfo}
            handleActionFinished={() => {}}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

