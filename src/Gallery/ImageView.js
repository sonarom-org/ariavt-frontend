import React, {useEffect, useState} from "react";
import axios from "axios";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import {TransitionAlert} from "../common/Alerts";
import {SimpleIDB} from "../common/SimpleIDB";
import {Footer} from "../common/CommonUI";
import {getToken} from "../authentication/authentication";
import config from "../config.json";



const useStyles = makeStyles((theme) => ({
  textMessage: {
    fontSize: "large",
    minHeight: '200px',
  },
  analysis: {
    maxWidth: '100%',
    borderRadius: 6,
  },
  // Create two equal columns that floats next to each other
  column: {
    float: "left",
    padding: 20,
    paddingLeft: 40,
    minWidth: 300,
    paddingRight: 40,
    fontSize: "large",
  },
  // Create two equal columns that floats next to each other
  columnImage: {
    float: "left",
    minWidth: 300,
    maxWidth: 600,
    padding: 20,
  },
  fullContent: {
    padding: 20,
  },
  imagePaper: {
    padding: 20,
    marginBottom: 40,
    borderRadius: 6,
  },
  code: {
    whiteSpace: "pre-wrap",
  },
}));



function ProcessingAlert(props) {
  const [open, setOpen] = React.useState(props.open);

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          severity="info"
          sx={{ mb: 2 }}
        >
          Loading service...
        </Alert>
      </Collapse>
    </Box>
  );
}



// TODO: mostrar los resultados en formato JSON de una forma más elaborada.
function ImageAnalysisCardMeasurement(props) {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState({
    severity: null,
    message: null
  });
  const [isBeingProcessed, setIsBeingProcessed] = useState(false);
  const [retrievedData, setRetrievedData] = useState(null);

  const service = props.service;

  useEffect(()=>{
    getData();
    // Disable incorrect linting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function getDataFromService(imageId, serviceId, getOnlyFinished) {
    const params = new URLSearchParams();
    params.append('image_id', imageId);
    if (getOnlyFinished) {
      params.append("get_only_finished", "true");
    } else {
      params.append("get_only_finished", "false");
    }

    setIsBeingProcessed(true);

    axios.get(
      config.API_URL + "/services/"+serviceId,
      {
        // Set authentication header
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        params: params,
      }
    ).then(response => {
      setIsBeingProcessed(false);

      console.log("RESPONSE DATA", response.data);
      let retrievedDataStr = JSON.stringify(response.data, null, 4);
      setRetrievedData(retrievedDataStr);
      console.log("RESPONSE DATA", retrievedDataStr);
      setMessage("Download results");

    }).catch(error => {
      setIsBeingProcessed(false);
      if (error.response.status === 503) {
        setAlert({
          'severity': 'error',
          'message': "Service " + service.name + " unavailable"
        });
      } else if (error.response.status === 422) {
        setAlert({
          'severity': 'error',
          'message': "Service could not process image" 
        });
      } else if (error.response.status === 404) {
        // Pass, expected behaviour when the image has not been processed. 
      } else {
        setAlert({
          'severity': 'error',
          'message': "Service " + service.name + " error"
        });
      }
      console.log("ERROR", error);
      setMessage("Generate results");
      setRetrievedData(null);
    });
  }

  function getData() {
    if (!props.image) {
      getDataFromService(
        props.originalImage.id, service.id, true
      );
    } else {
      setMessage("Open image");
      setRetrievedData();
    }
  }
  
  /**
   * Download retrieved data in a JSON file.
   */
  function downloadData () {
    if (retrievedData) {
      const blob = new Blob([retrievedData], {type: "application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${props.originalImage.id}_${service.name}_data.json`;
      a.click();
    }
  }

  function generateResult () {
    getDataFromService(
      props.originalImage.id, service.id, false
    );
  }

  function onCloseError () {
    setAlert({
      severity: null,
      message: null
    });
  }

  return (
    <Paper elevation={3} className={classes.imagePaper}>
      <Box textAlign='center'>
        <Box pt={1}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center">
            <Typography
              component="h5"
              variant="h6"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {props.title || service.fullName}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={retrievedData ? downloadData : generateResult}
            >
              {message}
            </Button>
          </Grid>
        </Box>
        <Box m={1} pt={1} textAlign='left'>
          <code className={classes.code}>
            {retrievedData}
          </code>
          {
            alert.message
            &&
            <TransitionAlert
              severity="error"
              alert={alert}
              setAlert={setAlert}
              open={true} />
          }
          {
            isBeingProcessed
            &&
            <ProcessingAlert open={isBeingProcessed}/>
          }
        </Box>
      </Box>
    </Paper>
  );
}



function ImageAnalysisCard(props) {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState({
    severity: null,
    message: null
  });
  const [isBeingProcessed, setIsBeingProcessed] = useState(false);
  const [image, setImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);


  const service = props.service;

  useEffect(()=>{
    getImage();
    // Disable incorrect linting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  function getImageFromService(imageId, serviceId, getOnlyFinished) {
    const params = new URLSearchParams();
    params.append('image_id', imageId);
    if (getOnlyFinished) {
      params.append("get_only_finished", "true");
    } else {
      params.append("get_only_finished", "false");
    }

    setIsBeingProcessed(true);

    axios.get(
      config.API_URL + "/services/"+serviceId,
      {
        // Set authentication header
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        params: params,
        // IMPORTANT: responseType 'blob' is necessary in order to correctly
        //  show the images.
        responseType: 'blob'
      }
    ).then(response => {
      setIsBeingProcessed(false);

      console.log("RESPONSE DATA", response.data);

      const blob = new Blob(
        [response.data],
        { type: response.headers["content-type"] }
      );
      console.log(blob);
      const resultImage = URL.createObjectURL(blob);
      console.log(resultImage);
      setMessage("Open image");
      setImage(<img
          alt='analysis'
          className={classes.analysis}
          src={resultImage}
      />);
      setImageBlob(resultImage);

    }).catch(error => {
      setIsBeingProcessed(false);
      if (error.response) {
        if (error.response.status === 503) {
          setAlert({
            'severity': 'error',
            'message': "Service " + service.name + " unavailable"
          });
        } else if (error.response.status === 422) {
          setAlert({
            'severity': 'error',
            'message': "Service could not process image" 
          });
        } else if (error.response.status === 404) {
          // Pass, expected behaviour when the image has not been processed. 
        } else {
          setAlert({
            'severity': 'error',
            'message': "Service " + service.name + " error"
          });
        }
      } else {
          setAlert({
            'severity': 'error',
            'message': "Service " + service.name + " error"
          });
      }
      setMessage("Generate results");
      setImage(<></>);
    });
  }

  function getImage() {
    if (!props.image) {
      getImageFromService(
        props.originalImage.id, service.id, true
      );
    } else {
      setMessage("Open image");
      setImage(<img
          alt='analysis'
          className={classes.analysis}
          src={props.image.image}
      />);
      setImageBlob(props.image.image);
    }
  }

  const openInNewTab = () => {
    window.open(imageBlob, "_blank");
  }

  const generateResult = () => {
    getImageFromService(
      props.originalImage.id, service.id, false
    );
  }

  function onCloseError () {
    setAlert({
      severity: null,
      message: null
    });
  }

  return (
    <Paper elevation={3} className={classes.imagePaper}>
      <Box textAlign='center'>
        {image}
        <Box pt={1}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center">
            <Typography
              component="h5"
              variant="h6"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {props.title || service.fullName}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={imageBlob ? openInNewTab : generateResult}
            >
              {message}
            </Button>
          </Grid>
        </Box>
        <Box m={1} pt={1} textAlign='left'>
          {
            alert.message
            &&
            <TransitionAlert
              alert={alert}
              setAlert={setAlert}
              open={true} />
          }
          {
            isBeingProcessed
            &&
            <ProcessingAlert open={isBeingProcessed}/>
          }
        </Box>
      </Box>
    </Paper>
  );
}


export default function ImageView (props) {
  // Styles
  const classes = useStyles();

  // State
  const [alert, setAlert] = useState({
    severity: null,
    message: null
  });
  const [state, setState] = useState({
    // Initial state
    title: props.image.info.title,
    text: props.image.info.text,
    patientNin: props.image.info.patientNin || '',
    imageDate: props.image.info.date,
  });
  const [title, setTitle] = useState(props.image.info.title);

  useEffect(()=>{
    // Force scroll to top
    window.scrollTo(0, 0);
    // Disable incorrect linting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function allRequiredFilled() {
    return (!state.title)
  }

  function handleCancel() {
    setState({
      // Initial state
      title: props.image.info.title,
      text: props.image.info.text,
      patientNin: props.image.info.patientNin,
      imageDate: props.image.info.date,
    });
  }

  const services = props.services;
  // console.log("SERVICES", services);

  function BasicDatePicker() {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Image date"
          value={state.imageDate}
          onChange={(newValue) => {
            setState({...state, imageDate: newValue });
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    );
  }

  // ------------------------------------------------------------------         
  // -> Database operations

  function setObject (id, image) {
    try {
      SimpleIDB.set(id, image).then();
    } catch(e) {
    }
  }

  function removeObject (id) {
    try {
      SimpleIDB.remove(id).then(response => {
        console.log('DELETED FROM DB');
      });
    } catch(e) {
    }
  }

  // On file upload (click the upload button)
  async function handleUpdate() {

    // Request made to the backend api
    // Send formData object
    const token = getToken();
    if (!token) {
      return;
    }

    // Create an object of formData
    const formData = new FormData();

    let title = state.title ? state.title : '';
    let text = state.text ? state.text : '';
    let imageDate = state.imageDate;
    if (imageDate == null) {
      imageDate = new Date();
    }
    let imageDateText = imageDate;
    try {
      imageDateText = imageDate.toISOString().substr(0, 10);
    } catch(err) {}
    let patientNin = (state.patientNin === '') ? null : state.patientNin;

    // -> Update the formData object
    formData.append("title", title);
    formData.append("text", text);
    formData.append("image_date", imageDateText);
    formData.append("patient_nin", patientNin);

    // const image = {
    //   format: "png",
    //   image: props.image.image,
    //   info: {
    //     title: state.title,
    //     text: state.text
    //   }
    // };
    //
    // insertObject(props.image.id, image);
    removeObject(props.image.id);

    return axios.put(
        config.API_URL + "/images/" + props.image.id,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "accept": "application/json"
          }
        }
    ).then(response => {
      console.log('Response', response);
      if (response.status === 200) {
        setAlert({
          severity: "success",
          message: "Image information correctly updated."
        });
        setTitle(state.title);
        // Refresh gallery
        delete props.images[props.image.id];
        props.doRefresh();
        //props.handleActionFinished();
      }
    }).catch(error => {
      //console.log('Error', error);
        setAlert({
          severity: "error",
          message: "Image information correctly updated."
        });
    });
  };



  // General function to update the state of the different form input fields
  function onInputChange(field) {
    return function (event) {
      // Update the state
      setState({...state, [field]: event.target.value });
    }
  }

  return (
    <React.Fragment>
      <div className={classes.fullContent}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <Button
              variant="contained"
              color="default"
              onClick={props.handleBack}
          >
            Back
          </Button>
          <Typography variant={'h5'}>
            Analysis of image <b>{title}</b>
          </Typography>
          <div />
        </div>

        <div className={"dashboardContent"}>
          <div className={classes.columnImage}>

            <ImageAnalysisCard
              image={props.image}
              title={"Original retinography"}
            />

            {Object.keys(services).map(key => (
              (services[key].resultType.toLowerCase() === "image") ?
              <ImageAnalysisCard
                key={key}
                originalImage={props.image}
                service={services[key]}
              />
                : <ImageAnalysisCardMeasurement
                  key={key}
                  originalImage={props.image}
                  service={services[key]}
                />
            ))}
          </div>

          <div className={classes.column}>
            <b>Image info</b>
            {/* Email */}
            <div>
              {/* TITLE */}
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="title"
                label="Title"
                name="title"
                onChange={onInputChange("title")}
                value={state.title}
              />
              {/* PATIENT NIN */}
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="patientNin"
                label="Patient NIN"
                name="patientNin"
                multiline
                rows={1}
                rowsMax={1}
                onChange={onInputChange("patientNin")}
                value={state.patientNin}
              />
              {/* IMAGE DATE */}
              <Box pt={2} pb={2}>
                <BasicDatePicker />
              </Box>
              {/* TEXT */}
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="text"
                label="Notes"
                name="text"
                multiline
                rows={16}
                rowsMax={20}
                onChange={onInputChange("text")}
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
                    disabled={allRequiredFilled()}
                    variant="contained"
                    component="label"
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>

                </Grid>

              </ Box>

              <div className={classes.textMessage}>
                <Box pt={4}>
                  {
                    alert.message
                    &&
                    <TransitionAlert
                      alert={alert}
                      setAlert={setAlert}
                      open={alert.message ? true : false} />
                  }
                </ Box>
              </div>

            </div>

          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
