import axios from 'axios';
import React, {useState} from 'react';

import {itemFormStyle} from "../styles/panel";
import config from "../config.json";
import {getToken} from "../authentication/authentication";
import ServiceForm from "./ServiceForm";



export default function AddServiceForm(props) {

  const [state, setState] = useState({
    name: '',
    url: '',
    resultType: '',
    fullName: '',
    description: ''
  });
  const [alert, setAlert] = useState({
    severity: null,
    message: null
  });

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
        setAlert({
          severity: "success",
          message: "Service correctly added"
        });
      }
      props.handleActionFinished();
    }).catch(error => {
      setAlert({
        severity: "error",
        message: "Service could not be added"
      });
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
    setAlert({
      severity: null,
      message: null
    });
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
          alert={alert}
          setAlert={setAlert}
       />

      </div>

    </div>
  );

}
