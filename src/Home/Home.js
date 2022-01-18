import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Footer, SectionTitle} from "../common/CommonUI";
import Box from "@material-ui/core/Box";
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';

import Typography from "@material-ui/core/Typography";

import './Home.css';

import getAllServices from "../ServicesPanel/services";

const useStyles = makeStyles((theme) => ({
  serviceCard: {
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(14),
    marginRight: theme.spacing(14),
    marginBottom: theme.spacing(10),
  },
  title: {
    marginBottom: theme.spacing(2),
  }
}));

function Home () {
  const classes = useStyles();

  const [services, setServices] = useState({});

  useEffect(() => {
    getAllServices(setServices);
  }, []);

  return (
    <div>
      <SectionTitle
        title={"Documentation"}
      />
      <div className={classes.serviceCard}>
        <Typography variant="h4" className={classes.title}>
          Analysis services
        </Typography>
        <Typography variant="h6" className={classes.title}>
          Below is the list and detail of all the analysis services currently available in the application. 
        </Typography>
        {
          Object.keys(services).map(identifier => (
            <Box p={2}>
              <Paper className="serviceCard">
                <Box p={2}>
                  <Typography variant="h5">{services[identifier].name}</Typography>
                  <Typography paragraph={true}>
                    <Link
                      href={services[identifier].url}
                    >
                      {services[identifier].url}
                    </Link>
                  </Typography>
                  <Typography paragraph={true}>
                    <b>Result type:</b> {services[identifier].resultType}
                  </Typography>
                  <Typography paragraph={true}>
                    <b>Full name:</b> {services[identifier].fullName}
                  </Typography>
                  <Typography paragraph={true}>
                    <b>Description:</b> {services[identifier].description}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          ))
        }
      </div>
      <Footer />
    </div>
  );
}

export default Home;
