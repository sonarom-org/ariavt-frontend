import React, {useEffect, useState} from 'react';
import axios from "axios";

import List from "@material-ui/core/List";

import {Footer, SectionActionTitle} from "../common/CommonUI";
import config from "../config.json";
import { getToken, isAdminUser } from "../authentication/authentication";
import RemoveItemDialog from "../common/RemoveItemDialog";
import EditItem from "../Panel/EditItem";

import {editItemStyle} from "../styles/panel";
import {itemsPanelStyle} from "../styles/panel";


export default function ItemsPanel(props) {
  // -> Styles
  const classes = itemsPanelStyle();
  const itemClasses = editItemStyle();
  // -> States
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(true);
  const [showAddItemForm, setShowAddItemForm] = React.useState(false);
  // Refresh item list
  const [refresh, setRefresh] = useState(false);
  // Refresh item list
  const [items, setItems] = useState({});
  // Remove item dialog
  const [removeItem, setRemoveItem] = React.useState({
    showDialog: false,
    showModal: false,
    itemName: null,
    itemId: null,
  });
  // Selected item
  const [selectedItem, setSelectedItem] = useState(null);


  // ------------------------------------------------------------------

  useEffect(() => {
    props.getAllItems(setItems);
  }, [props, refresh]);


  // ------------------------------------------------------------------
  // -> routes

  function doRefresh() {
    setRefresh(!refresh);
    console.log('REFRESHED');
  }


  // ------------------------------------------------------------------
  // -> Handlers

  function handleItemAdded() {
    // setShowUploadForm(false);
    doRefresh();
  }

  const handleAddItem = () => {
    setShowAddItemForm(!showAddItemForm);
  };

  function handleRemoveItem(itemId, itemName) {
    setRemoveItem({
      showModal: false,
      showDialog: true,
      itemId: itemId,
      itemName: itemName
    });
  }

  function handleCloseRemoveItemDialog() {
    setRemoveItem({
      ...removeItem,
      showDialog: false
    });
  }

  function handleEditFinished() {
    doRefresh();
  }

  function handleCloseEditItem() {
    setRemoveItem({
      ...removeItem,
      showModal: false
    });
  }

  function handleYesRemoveItemDialog() {
    const token = getToken();
    if (!token) {
      return;
    }
    axios.delete(
      config.API_URL + props.route + removeItem.itemId,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).then(response => {
      console.log(response);
      // Build array with the ids of the images
      const removed = response.data['removed'];
      console.log(removed);

      setRemoveItem({
        ...removeItem,
        showDialog: false
      });

      delete items[removeItem.itemId];

      doRefresh();
    }).catch(error => {
      // TODO: add error message
    });
  }


  // ------------------------------------------------------------------
  // -> Subcomponents

  function ItemFromList(props) {
    const item = props.item;

    function handleRemove() {
      handleRemoveItem(item.id, item.itemName);
    }

    function handleEdit() {
      setSelectedItem(item);
      setRemoveItem({
        ...removeItem,
        showModal: true
      });
    }

    return <props.listItem
      item={item}
      className={classes.listItem}
      showSecondary={secondary}
      handleRemove={handleRemove}
      handleEdit={handleEdit}
    />

  }

  // ------------------------------------------------------------------

  if (!isAdminUser()) {
    props.history.push('/');
  }

  return (
    <div>
      <div className={classes.fullHeight}>
        <SectionActionTitle
          title={props.itemsName+" panel"}
          subtitle={"Add/remove "+props.itemsName.toLowerCase()}
          actionLabel={"Add "+props.itemName.toLowerCase()}
          showActionForm={showAddItemForm}
          handleAction={handleAddItem}
          FormComponent={<props.addItemForm handleActionFinished={handleItemAdded} />}
        />
        <EditItem
          open={removeItem.showModal}
          item={selectedItem}
          classDialogContent={itemClasses.dialogContent}
          handleClose={handleCloseEditItem}
          handleActionFinished={handleEditFinished}
          itemsName={props.itemsName}
          form={<props.editItemForm
            title={"Edit "+props.itemName.toLowerCase()+" data"}
            adminEditor={isAdminUser()}
            item={selectedItem}
            handleActionFinished={handleEditFinished}
          />}
        />
        <div className={classes.fullScreenCard}>
          <List dense={dense}>
            {
              Object.keys(items).map(identifier => (
                <ItemFromList
                  key={identifier}
                  item={items[identifier]}
                  listItem={props.listItem}
                />
              ))
            }
          </List>
        </div>
      </div>
      <Footer />
      <RemoveItemDialog
        open={removeItem.showDialog}
        handleClose={handleCloseRemoveItemDialog}
        handleYes={handleYesRemoveItemDialog}
        itemName={removeItem.itemName}
        itemType={props.itemType}
      />
    </div>
  );
}
