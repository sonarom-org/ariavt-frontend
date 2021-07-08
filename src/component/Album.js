import React from 'react';
import {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {getToken} from "../Utils/authentication";
import axios from "axios";
import config from "../config.json";
import {Footer} from "../common_ui";
import UploadFiles from "./uploadFiles";
import Box from "@material-ui/core/Box";


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '100%',
  },
  cardContent: {
    flexGrow: 1,
  },
  fullHeight: {
    // - <app bar height>
    minHeight: 'calc(100vh - 48px)'
  }
}));



export default function Album() {
  // In-memory images array
  const [images, setImages] = useState({});
  // Styles
  const classes = useStyles();
  // Access token
  const token = getToken();
  //
  const [showUploadForm, setShowUploadForm] = React.useState(false)


  function getImages(ids) {
    for (const id of ids){
      const requestFile = axios.get(
        config.API_URL + "/images/" + id,
        {
          // Set authentication header
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          // The response is a Blob object containing the binary data.
          responseType: 'blob'
        }
      )

      // Search params
      const params = new URLSearchParams();
      params.append('ids', id);

      const requestData = axios.get(
        config.API_URL + "/images/",
        {
          // Set authentication header
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params
        }
      )

      axios.all(
        [requestFile, requestData]
      ).then(axios.spread((...responses) => {
        const responseFile = responses[0]
        const responseData = responses[1]
        // use/access the results
        console.log(responseFile);
        // Create object URL for the image
        // https://stackoverflow.com/questions/39062595/
        const image_url = URL.createObjectURL(
          new Blob(
            [responseFile.data],
            { type: responseFile.headers["content-type"] }
          )
        );
        console.log(image_url);
        // Add image to the array of images
        setImages(images => ({
          ...images,
          [id]: {
            format: "png",
            image: image_url,
            info: {
              title: responseData.data[0].title,
              text: responseData.data[0].text
            }
          }
        }));
      })).catch(errors => {
        // react on errors.
        // TODO: add error messages
      });

    }
  }

  function onUploadImage(event) {
    setShowUploadForm(!showUploadForm);
  }

  function getId(image) {
    return image.id;
  }

  useEffect(()=>{
    // Get all the user images
    axios.get(
      config.API_URL + "/images/",
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(response => {
      console.log(response);
      // Build array with the ids of the images
      const ids = response.data.map(getId);
      console.log(ids);
      // Get image files for the given ids
      getImages(ids);
      console.log(images);
    }).catch(error => {
      // TODO: add error message
    });
    // Disable incorrect linting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      {/*<CssBaseline />*/}
      <main className={classes.fullHeight}>
        {/* Title */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Image gallery
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              All images uploaded to the application.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color={ showUploadForm ? "default" : "primary" }
                    onClick={onUploadImage}
                  >
                    { showUploadForm ? "Cancel" : "Upload image" }
                  </Button>
                </Grid>
                {/*<Grid item>*/}
                {/*  <Button variant="outlined" color="primary">*/}
                {/*    Secondary action*/}
                {/*  </Button>*/}
                {/*</Grid>*/}
                { showUploadForm ? <UploadFiles /> : null }
              </Grid>
            </div>
          </Container>
        </div>
        {/* End title */}
        {/* Images grid */}
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={4}>
            {Object.keys(images).map(key => (
              <Grid item key={key} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    // image={`data:image/${card.format};base64,${card.image}`}
                    image={images[key].image}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {images[key].info.title}
                    </Typography>
                    <Typography>
                      {images[key].info.text}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        {/* End images grid */}
      </main>
      <Footer />
    </React.Fragment>
  );
}
