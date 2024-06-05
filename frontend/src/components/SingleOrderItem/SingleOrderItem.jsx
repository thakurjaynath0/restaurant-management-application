import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FaCheck, FaCross, FaEdit, FaTicketAlt, FaTimes } from 'react-icons/fa';
import { useRemoveItemEditOrderMutation, useUpdateItemEditOrderMutation } from '../../services/api';
import "./single.css";

const SingleOrderItem = ({item, action, newItems=[], setNewItems=undefined, id=null, setErr=undefined}) => {
    const [removeItem, {isSuccess: removeItemSuccess, isLoading: removeItemLoading, error: removeItemError}] = useRemoveItemEditOrderMutation();
    const [updateItem, {isSuccess: updateItemSuccess, isLoading: updateItemLoading, error: updateItemError}] = useUpdateItemEditOrderMutation();
    const [isEdit, setIsEdit ] = useState(false);
    const [quantity, setQuantity] = useState(item.quantity);


    const handleEdit = ()=> {
        setIsEdit(true);
    }
    const handleSave = async () => {
        if(action === "edit"){
            await updateItem({_id:id, id: item._id, quantity: quantity, item: item.item});
            setIsEdit(false);
            return;
        }
        setIsEdit(false);
         let currentItem = newItems.filter((singleItem)=> singleItem.item === item.item);
         console.log(currentItem);
         currentItem[0].quantity = quantity;
         let itemsExcludingCurrent = newItems.filter((singleItem)=> singleItem.item != item.item);
         setNewItems([...itemsExcludingCurrent, ...currentItem]);

    }
    const handleDelete = async() => {
        if(action==="edit"){
            await removeItem({_id: id, item: item._id})
            setIsEdit(false);
            return;
        }
        setIsEdit(false)
        let itemsExcludingCurrent = newItems.filter((singleItem)=> singleItem.item != item.item);
        setNewItems([...itemsExcludingCurrent]);
    }

    useEffect(()=> {
        if(action === "edit"){
            updateItemError && setErr(updateItemError);
            removeItemError && setErr(removeItemError);
        }
    }, [updateItemError, removeItemError])
  return (
      <>
        <div className='single-item'>
            <div className="single-item-left">{item.name || "kera"}</div>
            <div className="single-item-middle">
                <span>{item.quantity}</span><span> plate/pcs</span>
            </div>
            <div className="single-item-right">
                {
                    !isEdit &&
                    <button className='order-item-edit btn' onClick={handleEdit}>Change</button>
                }
            </div>

        </div>
        {
            // isEdit &&
            <>
                <div className={isEdit ? "absolute-wrapper active": "absolute-wrapper"} onClick={()=>setIsEdit(prev=> !prev)}>

                </div>
                <div className={isEdit? "absolute-container active": "absolute-container"} disabled>
                    <div className="absolute-name">{item.name}</div>
                    <span className="quantity-title">Change quantity</span>
                    <div className="absolute-quantity">
                        <input type="number" value={quantity} onChange={(e)=> setQuantity(e.target.value)} placeholder="Quantity"/>
                        <span>plate / pcs</span>
                    </div>
                    <div className="button-container">
                        <button className="delete-btn" onClick={handleDelete} disabled={removeItemLoading? true: false}>{removeItemLoading ? "Loading": "Delete"}</button>
                        
                        <button className="save-btn" onClick={handleSave} disabled={updateItemLoading? true: false}>{updateItemLoading ? "Loading": "Done"}</button>
                        <button className="complete-item">Complete</button>
                    </div>
                </div>
            </>

        }
      </>
  )
}

export default SingleOrderItem