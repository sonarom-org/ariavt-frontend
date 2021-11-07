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
import ServiceForm from "./ServiceForm";



export default function AddServiceForm(props) {
  const classes = itemFormStyle();

  const [state, setState] = useState({
    name: '',
    url: '',
    resultType: '',
    fullName: '',
    description: ''
  });
  const [message, setMessage] = useState('')

  function allRequiredFilled() {
    return (
      !state.name
      || !state.fullName
      || !state.url
      || !state.resultType
      // || !state.description
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
    formData.append("name", state.name);
    formData.append("full_name", state.fullName);
    formData.append("url", state.url);
    formData.append("result_type", state.resultType);
    formData.append("description", state.description);

    // Request made to the backend api
    // Send formData object
    const token = getToken();
    if (!token) {
      return;
    }
    return axios.post(
      config.API_URL + "/services/",
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
        setMessage("Service correctly added");
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
      name: '',
      url: '',
      fullName: '',
      resultType: '',
      description: ''
    });
    setMessage('');
  }


  return (
    <div>
      <h2>
        Add service
      </h2>
      <div>

       <ServiceForm
          onInputChange={onInputChange}
          state={state}
          handleCancel={handleCancel}
          allRequiredFilled={allRequiredFilled}
          onFileUpload={onFileUpload}
          action="Upload"
       />

      </div>
      <div className={classes.textMessage}>
        <Box pt={4}>
          {message}
        </ Box>
      </div>

    </div>
  );

  return (
    <div>
      <h2>
        Add service
      </h2>
      <div>

        {/* Name */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="name"
          label="Name"
          name="name"
          required
          onChange={onInputChange('name')}
          value={state.name}
        />

        {/* URL */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="url"
          label="URL"
          name="url"
          required
          // autoFocus
          onChange={onInputChange('url')}
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
          // required
          onChange={onInputChange('fullName')}
          value={state.fullName}
        />

        {/* Description */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="description"
          label="Description"
          name="description"
          multiline
          rows={16}
          rowsMax={20}
          onChange={onInputChange("description")}
          value={state.description}
        />

        <FormControl
          variant="outlined"
          margin="normal"
          className={classes.formControl}
          style={{minWidth: 180}}
          required
        >
          <InputLabel id="demo-simple-select-outlined-label">Result type</InputLabel>
          <Select
            labelId="resultTypeLabel"
            id="resultType"
            value={state.resultType}
            onChange={onInputChange('resultType')}
            label="Result type"
            // autoWidth
            width={100}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value={"admin"}>Measurement</MenuItem>
            <MenuItem value={"user"}>Image</MenuItem>
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
