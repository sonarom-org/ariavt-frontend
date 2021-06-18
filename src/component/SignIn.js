import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import Profile from "../profile/Profile";
import PropTypes from 'prop-types';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        ARIAVT
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function SignIn({ setToken }) {
  const [password, setPassword] = useState();
  const [username, setUserName] = useState();
  const [signedIn, setSignedIn] = useState();
  const classes = useStyles();

  function handleUsernameChange(event) {
    setUserName(event.target.value)
    // this.setState({username: event.target.value});
  }

  function handlePasswordChange(event) {
    // this.setState({password: event.target.value});
    setPassword(event.target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(username)
    console.log(password)

    // Build form data
    const formData = new FormData();
    formData.append("username", username)
    formData.append("password", password)

    // Post form data to API
    try {
      const response = await axios.post("http://localhost:8000/token", formData);
      setToken(response.data[`access_token`]);
      setSignedIn(true);
    } catch (e) {
      // Nothing
      console.log("ERROR");
    }
  }

  if (signedIn) {
    // Do good things
    return <Profile />
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={handleUsernameChange}
          />
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handlePasswordChange}
          />
          <FormControlLabel
              control={<Checkbox value="remember" color="primary"/>}
              label="Remember me"
          />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onSubmit={handleSubmit}
              onClick={handleSubmit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            {/*<Grid item>*/}
            {/*  <Link href="#" variant="body2">*/}
            {/*    {"Don't have an account? Sign Up"}*/}
            {/*  </Link>*/}
            {/*</Grid>*/}
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright/>
      </Box>
    </Container>
  );

}

SignIn.propTypes = {
  setToken: PropTypes.func.isRequired
}