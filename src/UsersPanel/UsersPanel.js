import React, {useEffect, useState} from 'react';
import axios from "axios";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import {Footer, SectionActionTitle} from "../common/CommonUI";
import AddUserForm from "./AddUserForm";
import config from "../config.json";
import { getToken, isAdminUser } from "../authentication/authentication";
import RemoveItemDialog from "../common/RemoveItemDialog";
import EditUser from "./EditUser";
import {itemsPanelStyle} from "../styles/panel";



function UsersPanel(props) {
  // -> Styles
  const classes = itemsPanelStyle();
  // -> States
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(true);
  const [showAddUserForm, setShowAddUserForm] = React.useState(false);
  // Refresh user list
  const [refresh, setRefresh] = useState(false);
  // Refresh user list
  const [users, setUsers] = useState({});
  // Remove user dialog
  const [removeUser, setRemoveUser] = React.useState({
    showDialog: false,
    showModal: false,
    username: null,
    userId: null,
  });
  // Selected user
  const [selectedUser, setSelectedUser] = useState(null);


  // ------------------------------------------------------------------
  // -> Requests

  function getAllUsers() {
    const token = getToken();
    if (!token) {
      return;
    }
    axios.get(config.API_URL+"/users/",
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).then(response => {
      console.log(response.data);

      for (const user of response.data) {
        setUsers(users => ({
          ...users,
          [user.id]: {
            id: user.id,
            fullName: user.full_name,
            username: user.username,
            email: user.email,
            role: user.role,
          }
        }));
      }
    }).catch(error => {
      if (error.response.status === 401) {
        // setError(error.response.data.message);
      } else {
        // setError("Something went wrong. Please try again later.");
      }
    });
  }

  // ------------------------------------------------------------------

  useEffect(() => {
    getAllUsers();
  }, [refresh]);


  // ------------------------------------------------------------------
  // -> routes

  function doRefresh() {
    setRefresh(!refresh);
    console.log('REFRESHED');
  }


  // ------------------------------------------------------------------
  // -> Handlers

  function handleUserAdded() {
    // setShowUploadForm(false);
    doRefresh();
  }

  const handleAddUser = () => {
    setShowAddUserForm(!showAddUserForm);
  };

  function handleRemoveUser(userId, username) {
    setRemoveUser({
      showModal: false,
      showDialog: true,
      userId: userId,
      username: username
    });
  }

  function handleCloseRemoveUserDialog() {
    setRemoveUser({
      ...removeUser,
      showDialog: false
    });
  }

  function handleEditFinished() {
    doRefresh();
  }

  function handleCloseEditUser() {
    setRemoveUser({
      ...removeUser,
      showModal: false
    });
  }

  function handleYesRemoveUserDialog() {
    const token = getToken();
    if (!token) {
      return;
    }
    axios.delete(
      config.API_URL + "/users/" + removeUser.userId,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(response => {
      console.log(response);
      // Build array with the ids of the images
      const removed = response.data['removed'];
      console.log(removed);

      setRemoveUser({
        ...removeUser,
        showDialog: false
      });

      delete users[removeUser.userId];

      doRefresh();
    }).catch(error => {
      // TODO: add error message
    });
  }


  // ------------------------------------------------------------------
  // -> Subcomponents

  function UserListItem(props) {
    const user = props.user;

    function handleRemove() {
      handleRemoveUser(user.id, user.username);
    }

    function handleEdit() {
      setSelectedUser(user);
      setRemoveUser({
        ...removeUser,
        showModal: true
      });
    }

    return (
      <ListItem className={classes.listItem}>
        <ListItemAvatar>
          <Avatar>
            <AccountCircle />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${user.fullName} (${user.username})`}
          secondary={secondary ? user.role : null}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            onClick={handleEdit}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            onClick={handleRemove}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  // ------------------------------------------------------------------

  if (!isAdminUser()) {
    props.history.push('/dashboard');
  }

  return (
    <div>
      <div className={classes.fullHeight}>
        <SectionActionTitle
          title={"Users panel"}
          subtitle={"Add/remove users"}
          actionLabel={"Add user"}
          showActionForm={showAddUserForm}
          handleAction={handleAddUser}
          FormComponent={<AddUserForm handleActionFinished={handleUserAdded} />}
        />
        <EditUser
          open={removeUser.showModal}
          user={selectedUser}
          handleClose={handleCloseEditUser}
          handleActionFinished={handleEditFinished}
        />
        <div className={classes.fullScreenCard}>
          <List dense={dense}>
            {
              Object.keys(users).map(userId => (
                <UserListItem
                  key={userId}
                  user={users[userId]}
                />
              ))
            }
          </List>
        </div>
      </div>
      <Footer />
      <RemoveItemDialog
        open={removeUser.showDialog}
        handleClose={handleCloseRemoveUserDialog}
        handleYes={handleYesRemoveUserDialog}
        itemName={removeUser.username}
        itemType="user"
      />
    </div>
  );
}

export default UsersPanel;
