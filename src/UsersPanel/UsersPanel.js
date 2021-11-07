import axios from "axios";

import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import ItemsPanel from "../Panel/ItemsPanel";
import { getToken } from "../authentication/authentication";
import config from "../config.json";
import UserItem from "./UserItem";


export default function UsersPanel(props) {

  function getAllUsers(setItems) {
    const token = getToken();
    if (!token) {
      return;
    }
    axios.get(config.API_URL+"/users/",
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).then(response => {
      console.log(response.data);

      for (const user of response.data) {
        setItems(users => ({
          ...users,
          [user.id]: {
            id: user.id,
            fullName: user.full_name,
            username: user.username,
            email: user.email,
            role: user.role,
          }
        }));
      }
    }).catch(error => {
      if (error.response.status === 401) {
        // setError(error.response.data.message);
      } else {
        // setError("Something went wrong. Please try again later.");
      }
    });
  }

  return <ItemsPanel
    itemType="user"
    getAllItems={getAllUsers}
    route="/users/"
    addItemForm={AddUserForm}
    editItemForm={EditUserForm}
    history={props.history}
    listItem={UserItem}
    itemsName="Users"
    itemName="User"
  />

}
