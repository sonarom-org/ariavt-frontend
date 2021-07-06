import axios from 'axios';
import React,{Component} from 'react';

import config from "../config.json";
import {getToken} from "../Utils/authentication";


class UploadFiles extends Component {

  // Initial state
  state = {
    // Initially, no file is selected
    selectedFile: null,
    title: '',
    text: ''
  };

  // On file select (from the pop up for selecting the file to upload)
  onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  onTitleChange = event => {
    // Update the state
    this.setState({ title: event.target.value });
  };

  onTextChange = event => {
    // Update the state
    this.setState({ text: event.target.value });
  };

  // On file upload (click the upload button)
  onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // -> Update the formData object
    // File
    formData.append(
      "file",
      this.state.selectedFile,
      // this.state.selectedFile.name
    );
    // Title
    formData.append(
      "title",
      this.state.title
    );
    // Text
    formData.append(
      "text",
      this.state.text
    );

    // Details of the uploaded file
    console.log(this.state.selectedFile);

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
  fileData = () => {
    if (this.state.selectedFile) {

      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <h2>
          Upload image
        </h2>
        <div>
          <input type="file" onChange={this.onFileChange} />
          <br />
          <label>Title</label>
          <input type="text" onChange={this.onTitleChange} />
          <br />
          <label>Text</label>
          <input type="text" onChange={this.onTextChange} />
          <br />
          <button onClick={this.onFileUpload}>
            Upload!
          </button>
        </div>
        {this.fileData()}
      </div>
    );
  }
}

export default UploadFiles;