import React from 'react';
import {useEffect, useState} from 'react';
import axios from "axios";

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import {getToken} from "../authentication/authentication";
import config from "../config.json";
import {Footer, TypographyTitle} from "../common/CommonUI";
import AddImageForm from "./AddImageForm";
import {SimpleIDB} from "../common/SimpleIDB";
import RemoveItemDialog from "../common/RemoveItemDialog";
import ImageView from "./ImageView";
import getAllServices from "../ServicesPanel/services";
import EditItem from "../Panel/EditItem";

import './ImageView.css';


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
  },
  dialogContent: {
    marginTop: theme.spacing(8),
  }
}));



export default function Gallery() {
  // -> Styles
  const classes = useStyles();
  let setValue = null;
  let value = null;

  // -> States
  // Services
  const [services, setServices] = useState({});


  // ------------------------------------------------------------------
  // -> Handlers


  function handleUploaded() {
    // setShowUploadForm(false);
    doRefresh();
  }


  // ------------------------------------------------------------------
  // -> routes

  function doRefresh() {
    //setRefresh(!refresh);
    setValue(value+1);
    console.log('REFRESHED');
  }


  useEffect(()=>{
    getAllServices(setServices);
    // Disable incorrect linting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onChildMount(dataFromChild) {
    value = dataFromChild[0];
    setValue = dataFromChild[1];
  }


  // ------------------------------------------------------------------
  // -> Subcomponents

  const GallerySC = () => (
    <React.Fragment>
      {/*<CssBaseline />*/}
      <main className={classes.fullHeight}>
        <Title
          handleUploaded={handleUploaded}
        />
        <GalleryCards
          services={services}
          onMount={onChildMount}
        />
      </main>
      <Footer />
    </React.Fragment>
  );


  // ------------------------------------------------------------------

  return (
    <div>
      <GallerySC />
      {/*!imageView.show && <GallerySC />*/}
      {/*imageView.show &&
       <ImageView
         image={imageView.image}
         handleBack={handleBack}
         doRefresh={doRefresh}
         services={services}
       />
       */}
    </div>
  );
}


function Title(props) {
  // -> Styles
  const classes = useStyles();
  // Upload image form visibility
  const [showUploadForm, setShowUploadForm] = React.useState(false)

  function handleUploadImage() {
    setShowUploadForm(!showUploadForm);
  }

  return (
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <TypographyTitle
              title={"Image gallery"}
              subtitle={"All images uploaded to the application."}
            />
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button
                    variant="contained"
                    color={ showUploadForm ? "default" : "primary" }
                    onClick={handleUploadImage}
                  >
                    { showUploadForm ? "Close" : "Add image" }
                  </Button>
                </Grid>
                {
                  showUploadForm ?
                    <AddImageForm
                      handleUploaded={props.handleUploaded}
                    />
                    : null
                }
              </Grid>
            </div>
          </Container>
        </div>
  );
}


function GalleryCards(props) {
  // -> Styles
  const classes = useStyles();
  // -> Access token
  const token = getToken();

  const [value, setValue] = useState(0);
  // Remove image dialog
  const [removeImage, setRemoveImage] = React.useState({
    showDialog: false,
    imageName: null,
    imageID: null,
  });
  // Selected image
  const [imageView, setImageView] = useState({
    show: false,
    image: null,
    id: null
  });

  // In-memory images array
  const [images, setImages] = useState({});

  function handleBack() {
    setImageView({
      ...imageView,
      show: false
    });
  }

  // ------------------------------------------------------------------
  // -> Image retrieval

  function getImages(ids) {
    let currentImages = {};
    for (const id of ids){
      console.log(id.toString(), Object.keys(images));
      if (Object.keys(images).includes(id.toString()))
        continue;
      console.log('>>>>>>> IMAGE ID', id);
      getObject(id).then(object => {
        if (object) {
          console.log('>>>>>>>>>>>>>>> LOCAL ' + id.toString());
          setImages(currentImages => ({
            ...currentImages,
            [id]: {
              id: id,
              image: URL.createObjectURL(object.image),
              info: {
                title: object.info.title,
                text: object.info.text,
                patientNin: object.info.patientNin,
                date: object.info.date,
              }
            }
          }));
        } else {
          console.log('>>>>>>>>>>>>>>> REMOTE '+id.toString());
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
            const blob =
              new Blob(
                [responseFile.data],
                { type: responseFile.headers["content-type"] }
              );
            const image_url = URL.createObjectURL(blob);
            console.log('IMAGE_URL', image_url);
            // Add image to the array of images
            console.log('RESPONSE DATA', responseData)
            setImages(currentImages => ({
              ...currentImages,
              [id]: {
                id: id,
                image: image_url,
                info: {
                  title: responseData.data[0].title,
                  text: responseData.data[0].text,
                  patientNin: responseData.data[0].patient_nin,
                  date: responseData.data[0].date,
                }
              }
            }));
            const image = {
              image: blob,
              info: {
                title: responseData.data[0].title,
                text: responseData.data[0].text,
                patientNin: responseData.data[0].patient_nin,
                date: responseData.data[0].date,
              }
            };

            insertObject(id, image);
          })).catch(errors => {
            // react on errors.
            // TODO: add error messages
          });
        }
      });

    }
  }

  function getId(image) {
    return image.id;
  }

  function getImagesIDs() {
    // Get all the user images
    axios.get(
      config.API_URL + "/images/",
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(response => {
      console.log('RESPONSE IMAGES IDS', response);
      // Build array with the ids of the images
      const ids = response.data.map(getId);
      console.log('IDENTIFIERS', ids);
      // Get image files for the given ids
      getImages(ids);
      console.log('IMAGENES', images);
    }).catch(error => {
      // TODO: add error message
    });
  }

  function empty() {}


  function handleRemoveImage(imageID, imageName) {
    setRemoveImage({
      showDialog: true,
      imageID: imageID,
      imageName: imageName
    });
  }

  function handleCloseRemoveImageDialog() {
    setRemoveImage({
      ...removeImage,
      showDialog: false
    });
  }

  function handleYesRemoveImageDialog() {
    console.log(removeImage.imageID);
    axios.post(
      config.API_URL + "/images/selection",
      [removeImage.imageID],
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).then(response => {
      console.log('RESPONSE', response);
      // Build array with the ids of the images
      const selection = response.data['selection'];

      console.log('SELECTION', selection);

      axios.delete(
        config.API_URL + "/images/selection/" + selection,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then(response => {
        console.log('RESPONSE', response);
        // Build array with the ids of the images
        const removed = response.data['removed'];
        console.log('REMOVED', removed);

        setRemoveImage({
          ...removeImage,
          showDialog: false
        });

        delete images[removeImage.imageID];

        removeObject(removeImage.imageID);

        setValue(value-1);
      }).catch(error => {
        // TODO: add error message
      });
    }).catch(error => {
      // TODO: add error message
    });
  }


  // ------------------------------------------------------------------

  useEffect(()=>{
    getImagesIDs();
    props.onMount([value, setValue]);
    // Disable incorrect linting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onMount, value])


  function doRefresh() {
    setValue(value-1);
  }


  return (
    <Container className={classes.cardGrid} maxWidth="lg">
      <Grid container spacing={4}>
        {Object.keys(images).map(key => (
          <Grid item key={key} xs={12} sm={6} md={4}>
            {console.log('PROPS IMAGES', images[key])}
            <ImageCard
              imageID={key}
              image={images[key]}
              styleClasses={classes}
              handleRemoveImage={handleRemoveImage}
              setImageView={setImageView}
            />
          </Grid>
        ))}
      </Grid>
      <RemoveItemDialog
        open={removeImage.showDialog}
        handleClose={handleCloseRemoveImageDialog}
        handleYes={handleYesRemoveImageDialog}
        itemName={removeImage.imageName}
        itemType="image"
      />
      <EditItem
        open={imageView.show}
        item={imageView.image}
        classDialogContent={classes.dialogContent}
        handleClose={handleBack}
        handleActionFinished={empty}
        itemsName={'Analysis'}
        // TODO: Warning: can't perform React state update on an unmounted...
        //  Probably, due to using the component 'as variable' for form.
        form=
        {<ImageView
         image={imageView.image}
         handleBack={handleBack}
         doRefresh={doRefresh}
         services={props.services}
         images={images}
       />}
      />
    </Container>
  );

}

function ImageCard(props) {
  // -> Styles
  const classes = useStyles();
  const imageID = props.imageID;
  const image = props.image;

  function handleRemove() {
    props.handleRemoveImage(imageID, image.info.title);
  }

  function handleView() {
    console.log(imageID);
    getObject(imageID).then(object => {
      if (object) {
        props.setImageView({
          show: true,
          id: imageID,
          image: image
        });
      } else {
        // Error: NO IMAGE
        console.log(`Image ${imageID} not found.`)
      }
    });
  }

  console.log('KEY AND IMAGES', imageID, image);

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.cardMedia}
        // image={`data:image/${card.format};base64,${card.image}`}
        image={image.image}
        title="Image title"
      />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {image.info.title}
        </Typography>
        <Typography>
          {image.info.text}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleView}>
          View
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={handleRemove}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
}



// ------------------------------------------------------------------
// -> Database operations

function insertObject (id, image) {
  try {
    SimpleIDB.set(id, image).then();
  } catch(e) {
  }
}

function getObject (id) {
  return SimpleIDB.get(parseInt(id));
}

function removeObject (id) {
  try {
    SimpleIDB.remove(id).then(response => {
        console.log('DELETED FROM DB');
    });
  } catch(e) {
  }
}
