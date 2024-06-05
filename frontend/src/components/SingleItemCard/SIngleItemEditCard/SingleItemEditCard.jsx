import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  useRemoveItemEditOrderMutation,
  useUpdateItemEditOrderMutation,
} from "../../../services/api";
import "./edit.css";

const SingleItemEditCard = ({
  setEditSingleOrderActive,
  editSingleOrderActive,
  newItems,
  setNewItems,
  action = "create",
  orderId = null,
  setErr = null,
}) => {
  const [removeItem, { isLoading: removeItemLoading, error: removeItemError }] =
    useRemoveItemEditOrderMutation();
  const [updateItem, { isLoading: updateItemLoading, error: updateItemError }] =
    useUpdateItemEditOrderMutation();
  const [newPrice, setNewPrice] = useState(
    editSingleOrderActive?.item?.price || 0
  );
  const [newQuantity, setNewQuantity] = useState(
    editSingleOrderActive?.item?.quantity || 0
  );
  const [isPackingOn, setIsPackingOn] = useState(
    editSingleOrderActive?.item?.type === "packing" ? true : false
  );

  const handleChange = (e) => {
    let newQnty = e.target.value;
    setNewQuantity(newQnty);
    let temp =
      (editSingleOrderActive?.item?.price /
        editSingleOrderActive?.item?.quantity) *
      newQnty;
    setNewPrice(temp);
  };
  const handleEditComplete = async () => {
    if (action === "edit") {
      // return;
      console.log(editSingleOrderActive?.item);
      await updateItem({
        _id: orderId,
        id: editSingleOrderActive?.item?._id,
        quantity: newQuantity,
      });
    } else {
      const removingSameItem = newItems.filter((item) => {
        return item.item !== editSingleOrderActive?.item?.item;
      });
      //   return;
      const { name, item, price } = editSingleOrderActive?.item;
      let temp = {
        item,
        name,
        price,
        quantity: newQuantity,
        type: isPackingOn ? "packing" : "table",
      };
      setNewItems([...removingSameItem, temp]);
    }
    setEditSingleOrderActive({ status: false, item: {} });
  };
  const handleCancelItem = async () => {
    if (action === "edit") {
      await removeItem({
        _id: orderId,
        item: editSingleOrderActive?.item?._id,
      });
    } else {
      const removingSameItem = newItems.filter((item) => {
        return item.item !== editSingleOrderActive?.item?.item;
      });
      setNewItems([...removingSameItem]);
    }
    setEditSingleOrderActive({ status: false, item: {} });
  };
  const handlePackClick = async () => {
    if (action === "edit") {
      await updateItem({
        _id: orderId,
        id: editSingleOrderActive?.item?._id,
        type: isPackingOn ? "table" : "packing",
      });
      setIsPackingOn((prev) => !prev);
    } else {
      const removingSameItem = newItems.filter((item) => {
        return item.item !== editSingleOrderActive?.item?.item;
      });
      const { name, item, price } = editSingleOrderActive?.item;
      let temp = {};
      if (isPackingOn) {
        temp = { item, name, price, quantity: newQuantity, type: "table" };
      } else {
        temp = { item, name, price, quantity: newQuantity, type: "packing" };
      }
      setNewItems([...removingSameItem, temp]);
      setIsPackingOn((prev) => !prev);
    }
  };
  useEffect(() => {
    setNewPrice(editSingleOrderActive?.item?.price);
    setNewQuantity(editSingleOrderActive?.item?.quantity);
    setIsPackingOn(
      editSingleOrderActive?.item?.type === "packing" ? true : false
    );
  }, [editSingleOrderActive]);

  useEffect(() => {
    removeItemError && setErr(removeItemError);
    updateItemError && setErr(updateItemError);
  }, [updateItemError, removeItemError, setErr]);
  return (
    <div
      className={
        editSingleOrderActive.status ? "edit-card active" : "edit-card"
      }
    >
      <div className="edit-wrapper">
        <div
          className={
            editSingleOrderActive.status
              ? "edit-container active"
              : "edit-container"
          }
        >
          <div className="edit-top-title">Edit Order Item</div>
          <div className="edit-main">
            <div className="edit-item-name">
              {editSingleOrderActive?.item?.name || ""}
            </div>
            <div className="edit-item edit-item-quantity">
              <div>Quantity</div>
              <input
                type="number"
                value={newQuantity}
                onChange={handleChange}
              />
            </div>
            <div className="edit-item edit-item-price">
              <div>Price</div>
              <input type="text" value={newPrice || 0} disabled />
            </div>
            <div className="edit-container-btns">
              {isPackingOn ? (
                <button className="btn pack-btn" onClick={handlePackClick}>
                  {updateItemLoading ? "Loading" : "Serve in the table"}
                </button>
              ) : (
                <button className="btn pack-btn" onClick={handlePackClick}>
                  {updateItemLoading ? "Loading" : "Pack Dish"}
                </button>
              )}
              <button
                className="btn cancel-btn"
                onClick={handleCancelItem}
                disabled={removeItemLoading}
              >
                {removeItemLoading ? "Loading" : "Cancel Item"}
              </button>
              <button
                className="btn done-btn"
                onClick={handleEditComplete}
                disabled={updateItemLoading}
              >
                {updateItemLoading ? "Loading" : "Done"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleItemEditCard;
