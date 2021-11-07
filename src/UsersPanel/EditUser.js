import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import EditUserForm from "./EditUserForm";
import {isAdminUser} from "../authentication/authentication";
import {editItemStyle} from "../styles/panel";


const Transition = React.forwardRef(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export default function EditUser(props) {
  const classes = editItemStyle();

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Users panel
            </Typography>
            <IconButton edge="start" color="inherit" onClick={props.handleClose}>
              <CloseIcon />
            </IconButton>
            {/*<Button autoFocus color="inherit" onClick={props.handleClose}>*/}
            {/*  save*/}
            {/*</Button>*/}
          </Toolbar>
        </AppBar>
        <div className={classes.dialogContent}>
          <EditUserForm
            title={"Edit user data"}
            adminEditor={isAdminUser()}
            user={props.user}
            handleActionFinished={props.handleActionFinished}
          />
        </div>
      </Dialog>
    </div>
  );
}