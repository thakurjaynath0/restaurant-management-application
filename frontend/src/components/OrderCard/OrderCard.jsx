import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSingleUserQuery } from '../../services/api';
import "./ordercard.css";

const OrderCard = ({orderItem}) => {
    const {id, status, tables, number, items, takenBy} = orderItem;

    const {data: singleUserData, isSuccess: singleUserSuccess} = useSingleUserQuery(takenBy);
    const [singleUser, setSingleUser] = useState(singleUserData);
    useEffect(()=> {
        singleUserSuccess && setSingleUser(singleUserData);
    }, [singleUserSuccess, setSingleUser, singleUserData])
  return (
    <div className={`order-lists`}>
        <div className="top-strip">
            <div className="order-number">Order no. <span className="number">{number}</span></div>
            <div className="table-number">
                table no. 
                <span className="number">
                    {tables?.map((table)=> {
                        return table?.number + " "; 
                    })}
                </span>
            </div>
        </div>
        <div className="order-detail-strip">
                <div className="taken-by-container">
            {
                singleUser?.user?.name &&
                <>
                    <span>Taken by:</span>
                    <div className="taken-by">{singleUser?.user?.name}</div>
                </>
            }
                </div>
            <div className="order-status">
                <button disabled="disabled" className={`btn order-status-btn ${status}`}>{status}</button>
            </div>
        </div>
        <div className="middle-strip">
            <div className="items details">Items</div>
            <ul className="order-item-list">
                {items?.map((item, index)=> {
                    return(
                        <li className='order-item' key={index}>
                            <span>{item?.name}</span>
                            <span className="quantity">{item?.quantity} plt</span>
                            <span className={`order-item-status ${item.status}`}>{item.status}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
        {
            status === "pending" && 
            <Link to={`/order/editorder/${id}`}>
                <div className="bottom-strip">
                    <button className='edit-button active'>Edit</button>
                </div>
            </Link>
        }
    </div>
  )
}

export default OrderCard;