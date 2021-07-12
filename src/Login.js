import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession, setUserInfo } from './Utils/authentication';
import config from "./config.json";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/core/styles";
import {Copyright} from "./CommonUI";


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


function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  const classes = useStyles();

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("username", username.value.toString())
    formData.append("password", password.value.toString())


    axios.post(config.API_URL+"/token", formData
    ).then(response => {
      console.log(response);
      setLoading(false);
      setUserSession(response.data["access_token"], username.value.toString());

      axios.get(config.API_URL+"/users/me",
        {
          headers: {
            'Authorization': `Bearer ${response.data["access_token"]}`,
            'Content-Type': 'application/json'
          }
        }
      ).then(response => {
        setUserInfo(response.data);
        // Push /dashboard after retrieving all the necessary user data
        props.history.push('/dashboard');
      }).catch(error => {
        if (error.response.status === 401) {
          setError(error.response.data.message);
        } else {
          setError("Something went wrong. Please try again later.");
        }
      });

    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    });
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          // type="username"
          {...username}
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          {...password}
          id="password"
          autoComplete="current-password"
          onKeyDown={handleKeyDown}
        />
        {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
        {/*<FormControlLabel*/}
        {/*  control={<Checkbox value="remember" color="primary"/>}*/}
        {/*  label="Remember me"*/}
        {/*/>*/}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          value={loading ? 'Loading...' : 'Login'}
          onClick={handleLogin}
          disabled={loading} >
          Sign In
        </Button>
      </div>
      <Box mt={8}>
        <Copyright/>
      </Box>
    </Container>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;