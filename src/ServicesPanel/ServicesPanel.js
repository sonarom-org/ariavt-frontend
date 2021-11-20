
import AddServiceForm from "./AddServiceForm";
import EditServiceForm from "./EditServiceForm";
import ItemsPanel from "../Panel/ItemsPanel";
import ServiceItem from "./ServiceItem";
import getAllServices from "./services";


export default function ServicesPanel(props) {

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
