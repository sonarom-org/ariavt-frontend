import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CloudCircleIcon from '@material-ui/icons/CloudCircle';



export default function ServiceItem(props) {
  const service = props.item;
  return (
    <ListItem className={props.className}>
      <ListItemAvatar>
        <Avatar>
          <CloudCircleIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${service.fullName} (${service.name})`}
        secondary={props.showSecondary ? service.url : null}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={props.handleEdit}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          edge="end"
          onClick={props.handleRemove}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}