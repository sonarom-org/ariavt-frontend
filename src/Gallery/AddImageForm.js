import axios from 'axios';
import React, {useState} from 'react';

import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import config from "../config.json";
import {getToken} from "../authentication/authentication";
import {itemFormStyle} from "../styles/panel";
import {TransitionAlert} from "../common/Alerts";



export default function AddImageForm(props) {
  const classes = itemFormStyle();
  
  const [state, setState] = useState({
    // Initially, no file is selected
    selectedFile: null,
    title: '',
    text: ''
  });

  // On file select (from the pop up for selecting the file to upload)
  const onFileChange = event => {
    // Update the state
    setState({...state, selectedFile: event.target.files[0] });
  };

  const onTitleChange = event => {
    // Update the state
    setState({...state, title: event.target.value });
  };

  const onTextChange = event => {
    // Update the state
    setState({...state, text: event.target.value });
  };

  // On file upload (click the upload button)
  async function onFileUpload () {
    // Send formData object
    const token = getToken();
    if (!token) {
      return;
    }
    // Create an object of formData
    const formData = new FormData();

    console.log(state.title, state.text);

    // -> Update the formData object
    // File
    formData.append(
      "file",
      state.selectedFile,
      // state.selectedFile.name
    );

    // -> If title is empty, select the image filename (without the extension)
    // as such
    let title;
    if (!state.title) {
      title = state.selectedFile.name.split('.').slice(0, -1).join('.');
    } else {
      title = state.title;
    }
      // Title
    formData.append(
      "title",
      title
    );
    // Text
    formData.append(
      "text",
      state.text
    );

    // Details of the uploaded file
    console.log(state.selectedFile);

    // Request made to the backend API
    return axios.post(config.API_URL + "/images/", formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        "accept": "application/json"
      }
    }).then(response => {
      console.log(response);
      props.setAlert({
        severity: "success",
        message: "Image correctly uploaded."
      });
      // Update the gallery using props handleUploaded
      props.handleUploaded();
    }).catch(error => {
      props.setAlert({
        severity: "error",
        message: "Image could not be uploaded."
      });
    });
  };

  function handleCancel() {
   setState({
      // Initially, no file is selected
      selectedFile: null,
      title: '',
      text: ''
    });
  }

  // File content to be displayed after
  // file upload is complete
  function fileData() {
    if (state.selectedFile) {
      return (
        <div>
          <h3>{state.selectedFile.name}</h3>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Select a color fundus image to upload.</h3>
        </div>
      );
    }
  };

  return (
    <div>
      <h2>
        Upload image
      </h2>
      <div>

        {/* FILE */}
        <div>
          <Box pt={2}>
            <Button
              variant="contained"
              component="label"
            >
              Select file
              <input
                type="file"
                hidden
                required
                onChange={onFileChange}
              />
            </Button>
          </ Box>
          {fileData()}
        </div>

        {/* TITLE */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="title"
          label="Title"
          name="title"
          // autoFocus
          onChange={onTitleChange}
          value={state.title}
        />
        <p>
          If no title is introduced, the filename of the image, without the
          extension, will be selected as such.
        </p>

        {/* TEXT */}
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="text"
          label="Notes"
          name="text"
          // autoFocus
          multiline
          rows={4}
          rowsMax={8}
          onChange={onTextChange}
          value={state.text}
        />

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
              disabled={(!state.selectedFile)}
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
          {
            props.alert.message
            &&
            <TransitionAlert
              severity="success"
              alert={props.alert}
              setAlert={props.setAlert}
              open={true} />
          }
        </ Box>
      </div>

    </div>
  );

}
