import axios from 'axios';
import React, {useState} from 'react';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import {itemFormStyle} from "../styles/panel";
import config from "../config.json";
import {getToken} from "../authentication/authentication";



export default function AddUserForm(props) {
  const classes = itemFormStyle();

  const [state, setState] = useState({
    // Initially, no file is selected
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: ''
  });
  const [message, setMessage] = useState('')

  function allRequiredFilled() {
    return (
      !state.username
      || !state.fullName
      || !state.email
      || !state.password
      || !state.role
    )
  }


  // General function to update the state of the different form input fields
  function onInputChange(field) {
    return function (event) {
      // Update the state
      setState({...state, [field]: event.target.value });
    }
  }


  // On file upload (click the upload button)
  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // -> Update the formData object
    formData.append("username", state.username);
    formData.append("full_name", state.fullName);
    formData.append("email", state.email);
    formData.append("password", state.password);
    formData.append("role", state.role);

    // Request made to the backend api
    // Send formData object
    const token = getToken();
    if (!token) {
      return;
    }
    return axios.post(
      config.API_URL + "/users/",
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "accept": "application/json"
        }
      }
    ).then(response => {
      // setUserSession(response.data.token, response.data.user);
      // setAuthLoading(false);
      console.log(response);
      if (response.status === 200) {
        setMessage("User correctly added");
      }
      props.handleActionFinished();
    }).catch(error => {
      // removeUserSession();
      // setAuthLoading(false);
    });
  };

  function handleCancel() {
    setState({
      // Initial state
      username: '',
      fullName: '',
      email: '',
      password: '',
      role: ''
    });
    setMessage('');
  }

  return (
    <div>
      <h2>
        Add user
      </h2>
      <div>

        {/* Email */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          required
          // autoFocus
          onChange={onInputChange('email')}
          value={state.title}
        />

        {/* Full name */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="fullName"
          label="Full name"
          name="fullName"
          required
          onChange={onInputChange('fullName')}
          value={state.fullName}
        />

        {/* Username */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          required
          onChange={onInputChange('username')}
          value={state.username}
        />

        {/* Password */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="password"
          label="Password"
          name="password"
          autoComplete="current-password"
          required
          type="password"
          onChange={onInputChange('password')}
          value={state.password}
        />

        <FormControl
          variant="outlined"
          margin="normal"
          className={classes.formControl}
          required
        >
          <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={state.role}
            onChange={onInputChange('role')}
            label="Age"
            autoWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"admin"}>Admin</MenuItem>
            <MenuItem value={"user"}>User</MenuItem>
          </Select>
        </FormControl>

        <Box pt={2}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center">
            <Button
              color="default"
              variant="contained"
              component="label"
              onClick={handleCancel}
            >
              Reset
            </Button>
            <Button
              color="primary"
              disabled={allRequiredFilled()}
              variant="contained"
              component="label"
              onClick={onFileUpload}
            >
              Upload
            </Button>
          </Grid>
        </ Box>

      </div>
      <div className={classes.textMessage}>
        <Box pt={4}>
          {message}
        </ Box>
      </div>

    </div>
  );

}
