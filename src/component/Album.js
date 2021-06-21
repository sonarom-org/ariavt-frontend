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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));


// const cards = [1, 2, 3]//, 4, 5, 6, 7, 8, 9];

export default function Album() {
  const [images, setImages] = useState([]);
  const classes = useStyles();
  const token = getToken();


  async function getImages(ids) {
    for (const id of ids){
      axios.get(
        config.API_URL + "/images/base64/" + id,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      ).then(response => {
        console.log(response);
        setImages(images => [...images, {id: id, image: response.data}]);
      }).catch(error => {
        // TODO: add error message
      });
    }
  }


  function getId(image) {
    return image.id;
  }

  useEffect(()=>{
    axios.get(
      config.API_URL + "/images/",
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(response => {
      console.log(response);
      const ids = response.data.map(getId);
      console.log(ids);
      getImages(ids).then(
        // -
      ).catch(error => {
        // TODO: add error message
      });
      console.log(images);
    }).catch(error => {
      // TODO: add error message
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      {/*<CssBaseline />*/}
      {/*<NavigationBar />*/}
      <main>
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
                  <Button variant="contained" color="primary">
                    Upload image
                  </Button>
                </Grid>
                {/*<Grid item>*/}
                {/*  <Button variant="outlined" color="primary">*/}
                {/*    Secondary action*/}
                {/*  </Button>*/}
                {/*</Grid>*/}
              </Grid>
            </div>
          </Container>
        </div>
        {/* End title */}
        {/* Images grid */}
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {images.map(card => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    /* TODO: esto no tiene por qué ser image/png; variar según
                        la imagen que venga. Se puede guardar en los objetos
                        esa información. */
                    image={`data:image/png;base64,${card.image}`}
                    // component='img' src={`data:image/png;base64,${images}`}
                    title="Image title"
                  />
                  {/*<p>{images}</p>*/}
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the content.
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
      {/*<Footer />*/}
    </React.Fragment>
  );
}
