import React from 'react'
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import { useUpdateItemEditOrderMutation } from '../../services/api';

import './OrderItem.css'

const OrderItem = ({ order, item }) => {
    const [updateItemEditOrder, {data:updateData, isLoading:updateIsLoading, isFetching:updateIsFetching}] = useUpdateItemEditOrderMutation()

    const handleStatusUpdate = (_id, id, status) => {
      if(status === "pending") {
        updateItemEditOrder({ _id, id, status:"cooking" })
      }
      if(status === "cooking") {
        updateItemEditOrder({ _id, id, status:"completed" })
      }
    }
  return (
    <div className={"kitchen-order-items-item "+item?.status+(updateIsLoading ? " loading" : "")}>
        {(updateIsLoading || updateIsFetching) && <span className="loader-svg"> <AiOutlineLoading3Quarters/></span>}
        { !(updateIsLoading || updateIsFetching) && <>
            <div className="kitchen-order-items-item-name">{item?.name}</div>
            <div className="kitchen-order-items-item-quantity">{item?.quantity}</div>
            <div className="kitchen-order-items-item-type">{(item?.type === "packing") && item?.type}</div>
            <div className="kitchen-order-items-item-status" onClick={() => handleStatusUpdate(order?._id, item?._id, item?.status)}>{item?.status}</div>
        </>}
    </div>
  )
}

export default OrderItem