import React, {useState} from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import {Footer} from "../common/CommonUI";

const useStyles = makeStyles((theme) => ({
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


export default function ImageView (props) {
  // TODO: back button, update button

  const classes = useStyles();
  const [state, setState] = useState({
    // Initial state
    title: props.image.info.title,
    text: props.image.info.text
  });

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
        <Button
          variant="contained"
          color="default"
          onClick={props.handleBack}
        >
          Back
        </Button>
        <div className={"dashboardContent"}>
          <div className={classes.columnImage}>
            <Paper elevation={3} className={classes.imagePaper}>
              <Box textAlign='center'>
                <img
                  alt='analysis'
                  className={classes.analysis}
                  src={props.image.image}
                />
                <Box pt={1}>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center">
                    <Typography component="h5" variant="h6" align="center" color="textPrimary" gutterBottom>
                      Original retinography
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={openInNewTab}
                    >
                      Open image
                    </Button>
                  </Grid>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={3} className={classes.imagePaper}>
              <Box textAlign='center'>
                <img
                  alt='analysis'
                  className={classes.analysis}
                  src={props.image.image}
                />
                <Box pt={1}>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center">
                    <Typography component="h5" variant="h6" align="center" color="textPrimary" gutterBottom>
                      Vascular segmentation
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={openInNewTab}
                    >
                      Open image
                    </Button>
                  </Grid>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={3} className={classes.imagePaper}>
              <Box textAlign='center'>
                <Box pt={1}>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center">
                    <Typography component="h5" variant="h6" align="center" color="textPrimary" gutterBottom>
                      Artery/Vein segmentation
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={openInNewTab}
                    >
                      Generate results
                    </Button>
                  </Grid>
                </Box>
              </Box>
            </Paper>
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
                rows={8}
                rowsMax={12}
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
                    // TODO: file update
                    onClick={() => {}}
                  >
                    Update
                  </Button>
                </Grid>
              </ Box>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}