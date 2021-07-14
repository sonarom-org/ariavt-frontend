import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import EditUserForm from "./EditUserForm";
import {isAdminUser} from "../authentication/authentication";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogContent: {
    padding: 30,
    maxWidth: 600,
    margin: 'auto',
    width: '50%',
  },
}));

const Transition = React.forwardRef(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export default function EditUser(props) {
  const classes = useStyles();

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
              Administration
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