import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';



export default function UserItem(props) {
  const user = props.item;
  return (
    <ListItem className={props.className}>
      <ListItemAvatar>
        <Avatar>
          <AccountCircle />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${user.fullName} (${user.username})`}
        secondary={props.showSecondary ? user.role : null}
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