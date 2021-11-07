import React, {useEffect, useState} from 'react';

import {Footer, SectionTitle} from "../common/CommonUI";
import {getUserInfo, isAdminUser} from "../authentication/authentication";
import EditUserForm from "./EditUserForm";
import {itemInfoStyle} from "../styles/panel";



export default function UserProfile(props) {
  // -> Styles
  const classes = itemInfoStyle();
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

