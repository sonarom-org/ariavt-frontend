import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Footer, SectionTitle} from "../CommonUI";
import {getUserInfo, isAdminUser} from "../Utils/authentication";
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
  // Refresh user list
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(getUserInfo());


  // ------------------------------------------------------------------

  useEffect(() => {
    setUserInfo(getUserInfo());
  }, [refresh]);


  // ------------------------------------------------------------------
  // -> Utils

  function doRefresh() {
    setRefresh(!refresh);
    console.log('REFRESHED');
  }


  // ------------------------------------------------------------------
  // -> Handlers

  function handleEditFinished() {
    doRefresh();
  }

  function handleCloseEditUser() {
    setShowModal(false);
  }

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

