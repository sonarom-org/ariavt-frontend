import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import {itemFormStyle} from "../styles/panel";


export default function ServiceForm(props) {
  const classes = itemFormStyle();

  return (
    <div>
      {/* Name */}
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="name"
        label="Name"
        name="name"
        required
        onChange={props.onInputChange('name')}
        value={props.state.name}
      />

      {/* URL */}
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="url"
        label="URL"
        name="url"
        required
        // autoFocus
        onChange={props.onInputChange('url')}
        value={props.state.url}
      />

      {/* Full name */}
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="fullName"
        label="Full name"
        name="fullName"
        required
        onChange={props.onInputChange('fullName')}
        value={props.state.fullName}
      />

      {/* Description */}
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        id="description"
        label="Description"
        name="description"
        multiline
        rows={16}
        rowsMax={20}
        onChange={props.onInputChange("description")}
        value={props.state.description}
      />

      <FormControl
        variant="outlined"
        margin="normal"
        className={classes.formControl}
        style={{minWidth: 180}}
        required
      >
        <InputLabel id="demo-simple-select-outlined-label">
          Result type
        </InputLabel>
        <Select
          labelId="resultTypeLabel"
          id="resultType"
          value={props.state.resultType}
          onChange={props.onInputChange('resultType')}
          label="Result type"
          // autoWidth
          width={100}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value={"admin"}>Measurement</MenuItem>
          <MenuItem value={"user"}>Image</MenuItem>
        </Select>
      </FormControl>

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
            onClick={props.handleCancel}
          >
            Reset
          </Button>
          <Button
            color="primary"
            disabled={props.allRequiredFilled()}
            variant="contained"
            component="label"
            onClick={props.onFileUpload}
          >
            {props.action}
          </Button>
        </Grid>
      </ Box>
    </div>
  );

}