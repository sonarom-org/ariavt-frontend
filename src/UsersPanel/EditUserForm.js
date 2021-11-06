import axios from 'axios';
import React, {useState} from 'react';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import {itemFormStyle} from "../styles/panel";
import config from "../config.json";
import {getToken} from "../authentication/authentication";


export default function EditUserForm(props) {
  const classes = itemFormStyle();
  const user = props.user;
  const adminEditor = props.adminEditor;

  const [state, setState] = useState({
    // Initial state
    fullName: user.fullName,
    email: user.email,
    oldPassword: '',
    newPassword: '',
    username: user.username,
    role: user.role,
  });
  const [message, setMessage] = useState('')

  function allRequiredFilled() {
    return (
      !state.fullName
      || !state.email
      || !state.username
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

    // Request made to the backend api
    // Send formData object
    const token = getToken();
    if (!token) {
      return;
    }

    // Create an object of formData
    const formData = new FormData();

    // -> Update the formData object
    formData.append("full_name", state.fullName);
    formData.append("email", state.email);
    formData.append("password", state.newPassword);
    if (!adminEditor)
      formData.append("old_password", state.oldPassword);
    formData.append("role", state.role);

    return axios.put(
      config.API_URL + "/users/" + user.id,
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
        setMessage("User correctly updated!");
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
      fullName: user.fullName,
      email: user.email,
      oldPassword: '',
      newPassword: '',
      username: user.username,
      role: user.role,
    });
    setMessage('');
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <h2>
          {props.title}
        </h2>
        {/*<Button*/}
        {/*  color="default"*/}
        {/*  // disabled={allRequiredFilled()}*/}
        {/*  variant="contained"*/}
        {/*  Gallery="label"*/}
        {/*  onClick={onFileUpload}*/}
        {/*>*/}
        {/*  Close*/}
        {/*</Button>*/}
      </Grid>
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
          // required
          onChange={onInputChange('email')}
          value={state.email}
        />

        {/* Full name */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="fullName"
          label="Full name"
          name="fullName"
          // required
          onChange={onInputChange('fullName')}
          value={state.fullName}
        />

        {/* Old password */}
        {!adminEditor &&
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="old-password"
          label="Old password"
          name="old-password"
          autoComplete="current-password"
          // required
          type="password"
          onChange={onInputChange('oldPassword')}
          value={state.oldPassword}
        />}

        {/* Password */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="new-password"
          label="New password"
          name="newPassword"
          autoComplete="current-password"
          // required
          type="password"
          onChange={onInputChange('newPassword')}
          value={state.newPassword}
        />

        {/* USERNAME */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          disabled={!adminEditor}
          value={state.username}
        />

        <FormControl
          variant="outlined"
          margin="normal"
          className={classes.formControl}
          disabled
        >
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            native
            labelId="role-label"
            id="role"
            value={state.role}
            label="Role"
            disabled={!adminEditor}
            autoWidth
          >
            <option value={"admin"}>{state.role}</option>
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
              Update
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
