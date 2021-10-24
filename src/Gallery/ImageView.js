import React, {useState} from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import {Footer} from "../common/CommonUI";
import {getToken} from "../authentication/authentication";
import axios from "axios";
import config from "../config.json";
import {SimpleIDB} from "../common/SimpleIDB";
import {Label} from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
  textMessage: {
    fontSize: "large"
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
  }
}));


function ImageAnalysisCard(props) {
  const classes = useStyles();

  let message;
  let image;
  if (!props.image) {
    message = "Generate results";
    image = <></>
  } else {
    message = "Open image";
    image = <img
        alt='analysis'
        className={classes.analysis}
        src={props.image.image}
    />;
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
              {props.title}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={props.onClickButton}
            >
              {message}
            </Button>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
}

export default function ImageView (props) {
  // Styles
  const classes = useStyles();
  // State
  const [message, setMessage] = useState('');
  const [state, setState] = useState({
    // Initial state
    title: props.image.info.title,
    text: props.image.info.text
  });
  const [title, setTitle] = useState(props.image.info.title);

  function allRequiredFilled() {
    return (!state.title)
  }

  function handleCancel() {
    setState({
      // Initial state
      title: props.image.info.title,
      text: props.image.info.text
    });
  }

  // ------------------------------------------------------------------
  // -> Database operations

  function insertObject (id, image) {
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
  const handleUpdate = () => {

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

    // -> Update the formData object
    formData.append("title", title);
    formData.append("text", text);

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
      // setUserSession(response.data.token, response.data.user);
      // setAuthLoading(false);
      console.log(response);
      if (response.status === 200) {
        setMessage("Image information correctly updated!");
      }
      setTitle(state.title);
      // Refresh gallery
      props.doRefresh();
      props.handleActionFinished();
    }).catch(error => {
      // removeUserSession();
      // setAuthLoading(false);
    });
  };

  const openInNewTab = () => {
    // SimpleIDB.get(props.image.id).then(object => {
    //   if (object) {
    //     window.open(URL.createObjectURL(object.image), "_blank");
    //   } else {
    //     // Error: NO IMAGE
    //     console.log(`Image ${props.image.id} not found.`)
    //   }
    // });
    // console.log(state.imageFile);
    window.open(props.image.image, "_blank");
  }

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
            Image <b>{title}</b>
          </Typography>
          <div />
        </div>

        <div className={"dashboardContent"}>
          <div className={classes.columnImage}>

            <ImageAnalysisCard
                onClickButton={openInNewTab}
                image={props.image}
                title={"Original retinography"}
            />

            <ImageAnalysisCard
                onClickButton={openInNewTab}
                image={props.image}
                title={"Vascular segmentation"}
            />

            <ImageAnalysisCard
                onClickButton={openInNewTab}
                title={"Artery/Vein segmentation"}
            />

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

                <div className={classes.textMessage}>
                  <Box pt={4}>
                    {message}
                  </ Box>
                </div>

              </ Box>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}