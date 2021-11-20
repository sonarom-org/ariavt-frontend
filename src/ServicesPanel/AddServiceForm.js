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

}
