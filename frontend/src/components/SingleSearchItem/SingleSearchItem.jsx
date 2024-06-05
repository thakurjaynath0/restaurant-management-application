import React, { useEffect } from 'react'
import { useAddItemEditOrderMutation, useUpdateItemEditOrderMutation } from '../../services/api';
import "./single.css"

const SingleSearchItem = ({_id, name, price,type="table", setSearchActive, setNewItems, newItems, action="create", orderId=null, setOrderItemLoading=null, setErr=null}) => {
  const [addItem, {error: addItemError, isSuccess: addItemSuccess, isLoading: addItemLoading}] = useAddItemEditOrderMutation();
  const [updateItem, {isSuccess: updateItemSuccess, isLoading: updateItemLoading, error: updateItemError}] = useUpdateItemEditOrderMutation();
    
  const handleClick = async ()=> {
    const sameItem = newItems.filter((newItem)=> {

      return newItem.item === _id
    })
    const quantity = sameItem[0]?.quantity;
    const singleItemOrderId = sameItem[0]?._id;
    if(action==="edit"){
      if(sameItem.length > 0){
        console.log(newItems);
        await updateItem({ _id: orderId, id: singleItemOrderId, quantity: quantity+1, type})
      } else{
        await addItem({_id: orderId, item: _id, quantity: 1, type});
      }
    setSearchActive(prev => !prev)
      return;
    }
    
    const removingSameItem = newItems.filter((newItem)=> {
      return newItem.item !== _id
    })
    const temp = {item: _id, name, price, quantity: quantity+1, type }
    if(sameItem.length> 0){
      setNewItems([...removingSameItem, temp])
    }
    else{
      setNewItems([...newItems, {item: _id, name, price, quantity: 1, type}])
    }
    setSearchActive(prev => !prev)
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
    <div className='single-search-item-container' onClick={handleClick}>
        <span className="search-name">{name}</span>
        <span className='search-price'>Rs {price}</span>
    </div>
  )
}

export default SingleSearchItem