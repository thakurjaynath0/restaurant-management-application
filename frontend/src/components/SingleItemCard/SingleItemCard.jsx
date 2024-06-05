import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useAddItemEditOrderMutation } from "../../services/api";
import "./singleitemcard.css";
const SingleItemCard = ({type="table", item, name,_id, quantity, price, editSingleOrderActive, setEditSingleOrderActive}) => {
  const [totalPrice, setTotalPrice] = useState(quantity * price);
  const handleClick = () => {
    const temp = {name, item, quantity, price, _id, type}
    setEditSingleOrderActive({status: !editSingleOrderActive?.status || true, item: temp})
  }

  useEffect(() => {
    setTotalPrice(quantity * price);
  }, [quantity, price]);

  return (
    <>
      <div className="single-order" onClick={handleClick}>
        <div className="single-order-left">
          <div className="single-order-name">{name}</div>
          <div className="single-order-price">Rs {price}</div>
        </div>
        <div className="single-order-middle">
          <div className="single-order-quantity">{quantity}</div>
        </div>
        <div className="single-order-right">
          <div className="single-order-total"> Rs {totalPrice}</div>
        </div>
      </div>
    </>
    

  );
};

export default SingleItemCard;
