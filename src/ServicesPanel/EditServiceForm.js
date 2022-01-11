import axios from 'axios';
import React, {useState} from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import {itemFormStyle} from "../styles/panel";
import config from "../config.json";
import {getToken} from "../authentication/authentication";
import ServiceForm from "./ServiceForm";



function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}


export default function EditServiceForm(props) {
  const classes = itemFormStyle();
  const service = props.item;

  // Avoid null values in optional fields
  if (!service.description) {
    service.description = "";
  }

  const [state, setState] = useState({
    name: service.name,
    url: service.url,
    resultType: service.resultType,
    fullName: service.fullName,
    description: service.description,
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
  async function onFileUpload() {

    // Request made to the backend api
    // Send formData object
    const token = getToken();
    if (!token) {
      return;
    }

    // Create an object of formData
    const formData = new FormData();

    // Only update the fields that change
    // console.log(state, service);
    // -> Update the formData object
    if (state.name !== service.name) {
      formData.append("name", state.name);
    }
    if (state.fullName !== service.fullName) {
      formData.append("full_name", state.fullName);
    }
    if (state.url !== service.url) {
      if (isValidHttpUrl(state.url)) {
        formData.append("url", state.url);
      } else {
        setMessage("Invalid URL!");
        return;
      }
    }
    if (state.resultType !== service.resultType) {
      formData.append("result_type", state.resultType);
    }
    if (state.description !== service.description) {
      formData.append("description", state.description);
    }

    // Check if any field has been altered
    let i = 0;
    for (let key of formData.keys()) {
      console.log(key);
      i++;
    }

    if (i === 0) {
      setMessage("No field has been altered!");
      return;
    }

    return axios.put(
      config.API_URL + "/services/" + service.id,
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
        setMessage("Service correctly updated!");
      }
      props.handleActionFinished();
    }).catch(error => {
      // removeUserSession();
      // setAuthLoading(false);
    });
  };

  function handleCancel() {
    setState({
      // Initial stat
      name: service.name,
      url: service.url,
      resultType: service.resultType,
      fullName: service.fullName,
      description: service.description,
    });
    setMessage('');
  }


  return (
    <Box>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <h2>
          {props.title}
        </h2>
      </Grid>
      <div>

       <ServiceForm
          onInputChange={onInputChange}
          state={state}
          handleCancel={handleCancel}
          allRequiredFilled={allRequiredFilled}
          onFileUpload={onFileUpload}
          action="Update"
       />

      </div>
    </Box>
  );

}
