import React from "react";

import Box from "@material-ui/core/Box";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';


export function TransitionAlert(props) {
  const [open, setOpen] = React.useState(props.open);

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          severity={props.alert.severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
                props.setAlert({
                  severity: null,
                  message: null
                });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {props.alert.message}
        </Alert>
      </Collapse>
    </Box>
  );
}
