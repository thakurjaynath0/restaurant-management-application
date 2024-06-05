import React from "react";
import { useEffect } from "react";
import { useAddItemEditOrderMutation, useUpdateItemEditOrderMutation } from "../../services/api";

const TempMenu = ({item, name, price, type="table", setNewItems, newItems, action="create", orderId=null, setOrderItemLoading=null, setErr=null}) => {
  const [addItem, {error: addItemError, isSuccess: addItemSuccess, isLoading: addItemLoading}] = useAddItemEditOrderMutation();
  const [updateItem, {isSuccess: updateItemSuccess, isLoading: updateItemLoading, error: updateItemError}] = useUpdateItemEditOrderMutation();

  const handleClick = async ()=> {
    const sameItem = newItems.filter((newItem)=> {

      return newItem.item === item
    })
    const quantity = sameItem[0]?.quantity;
    const singleItemOrderId = sameItem[0]?._id;
    console.log(sameItem);
    if(action==="edit"){
      if(sameItem.length > 0){
        await updateItem({ _id: orderId, id: singleItemOrderId, quantity: quantity+1, type, price})
      } else{
        await addItem({_id: orderId, item: item, quantity: 1, type, price});
      }
      return;
    }
    
    const removingSameItem = newItems.filter((newItem)=> {
      return newItem.item !== item
    })
    const temp = {item, name, price, quantity: quantity+1 , type}
    if(sameItem.length> 0){
      setNewItems([...removingSameItem, temp])
    }
    else{
      setNewItems([...newItems, {item, name, price, quantity: 1, type}])
    }
  }
  useEffect(()=> {
    if(action==="edit"){
      setOrderItemLoading(addItemLoading || updateItemLoading || false)
    }
  }, [addItemLoading, updateItemLoading, setOrderItemLoading, action])

  useEffect(()=> {
    addItemError && setErr(addItemError);
    updateItemError && setErr(updateItemError);
  }, [addItemError, updateItemError, setErr])
  return (
    <div className="single-menu-item" onClick={handleClick}>
      <div className="menu-title">{name}</div>
      <div className="menu-price">Rs {price}</div>
      <div className="menu-pic">VP</div>
    </div>
  );
};

export default TempMenu;
