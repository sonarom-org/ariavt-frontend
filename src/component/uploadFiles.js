import axios from 'axios';
import React, {useState} from 'react';

import config from "../config.json";
import {getToken} from "../Utils/authentication";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';


export default function UploadFiles() {

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
  const onFileUpload = () => {
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

    // Request made to the backend api
    // Send formData object
    const token = getToken();
    if (!token) {
      return;
    }
    return axios.post(config.API_URL + "/images/", formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        "accept": "application/json"
      }
    }).then(response => {
      // setUserSession(response.data.token, response.data.user);
      // setAuthLoading(false);
      console.log(response);
    }).catch(error => {
      // removeUserSession();
      // setAuthLoading(false);
    });
  };

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    if (state.selectedFile) {
      return (
        <div>
          <br />
          <h3>File Details:</h3>
          <ul>
            <li>File Name: {state.selectedFile.name}</li>
            <li>File Type: {state.selectedFile.type}</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <h4>Select a color fundus image to upload.</h4>
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

        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="title"
          label="Title"
          name="title"
          // autoFocus
          onChange={onTitleChange}
        />
        <p>
          If no title is introduced, the filename of the image, without the
          extension, will be selected as such.
        </p>

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
        />

        {/* TODO: Button disabled if not file provided. */}
        <Box pt={2}>
          <Button
            color="primary"
            disabled={(!state.selectedFile)}
            variant="contained"
            component="label"
            onClick={onFileUpload}
          >
            Upload
          </Button>
        </ Box>

      </div>

    </div>
  );

}
