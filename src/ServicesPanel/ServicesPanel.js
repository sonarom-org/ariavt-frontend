import axios from "axios";

import AddServiceForm from "./AddServiceForm";
import EditServiceForm from "./EditServiceForm";
import ItemsPanel from "../Panel/ItemsPanel";
import { getToken } from "../authentication/authentication";
import config from "../config.json";
import ServiceItem from "./ServiceItem";


export default function ServicesPanel(props) {

  function getAllServices(setItems) {
    const token = getToken();
    if (!token) {
      return;
    }
    axios.get(config.API_URL+"/services",
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).then(response => {
      console.log(response.data);

      for (const service of response.data) {
        setItems(services => ({
          ...services,
          [service.id]: {
            id: service.id,
            name: service.name,
            url: service.url,
            fullName: service.full_name,
            description: service.description,
            resultType: service.result_type,
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
    itemType="service"
    getAllItems={getAllServices}
    route="/services/"
    addItemForm={AddServiceForm}
    editItemForm={EditServiceForm}
    history={props.history}
    listItem={ServiceItem}
    itemsName="Services"
    itemName="Service"
  />

}
