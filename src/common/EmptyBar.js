import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    marginRight: theme.spacing(4),
    // Padding top to align text vertically
    paddingTop: theme.spacing(0.7),
  },
  toolbarHeight: {
    minHeight: 48
  },
}));

export default function NavigationBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar className={classes.toolbarHeight}>
          {/* variant="dense" */}
          <Typography className={classes.title} variant="h6" noWrap>
            ARIAVT
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
