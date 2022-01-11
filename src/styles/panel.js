import { makeStyles } from '@material-ui/core/styles';


export const editItemStyle = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogContent: {
    marginTop: theme.spacing(10),
    padding: 30,
    maxWidth: 600,
    margin: 'auto',
    width: '50%',
  },
}));


export const itemFormStyle = makeStyles((theme) => ({
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
  textMessage: {
    fontSize: "large",
    minHeight: '100px',
  }
}));


export const itemInfoStyle = makeStyles((theme) => ({
  fullHeight: {
    // - <app bar height>
    minHeight: 'calc(100vh - 48px)',
  },
  userForm: {
    margin: 'auto',
    maxWidth: 600,
  }
}));


export const itemsPanelStyle = makeStyles((theme) => ({
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
  fullScreenCard: {
    /* Add shadows to create the "card" effect */
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    transition: "0.3s",
    margin: 20,
    paddingRight: 30,
    borderRadius: "10px"
  },
  listItem: {
    backgroundColor: theme.palette.background.paper,
    margin: 12,
    borderRadius: "10px",

  }
}));

