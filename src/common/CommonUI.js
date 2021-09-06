import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
}));


export function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        ARIAVT
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Typography variant="h6" align="center" gutterBottom>
        ARIAVT
      </Typography>
      {/*<Typography variant="subtitle1" align="center" color="textSecondary" Gallery="p">*/}
      {/*  Something here to give the footer a purpose!*/}
      {/*</Typography>*/}
      <Copyright />
    </footer>
  );
}


export function TypographyTitle(props) {
  return (
    <div>
      <Typography component="h2" variant="h3" align="center" color="textPrimary" gutterBottom>
        {props.title}
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph>
        {props.subtitle}
      </Typography>
    </div>
  );
}

export function SectionTitle(props) {
  const classes = useStyles();
  return (
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <TypographyTitle {...props} />
      </Container>
    </div>
  );
}


export function SectionActionTitle(props) {
  const classes = useStyles();

  return (
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <TypographyTitle
          title={props.title}
          subtitle={props.subtitle}
        />
        <div className={classes.heroButtons}>
          <Grid container spacing={2} justify="center">
            <Grid item>
              <Button
                variant="contained"
                color={ props.showActionForm ? "default" : "primary" }
                onClick={props.handleAction}
              >
                { props.showActionForm ? "Close" : props.actionLabel }
              </Button>
            </Grid>
            { props.showActionForm ?
                <>{props.FormComponent}</> :
                null }
          </Grid>
        </div>
      </Container>
    </div>
  );
}


