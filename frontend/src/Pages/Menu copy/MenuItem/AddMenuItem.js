import React, { useEffect, useState } from 'react';
import { useAddMenuItemMutation } from '../../../services/api';

import './AddMenuItem.css';

const AddMenuItem = ({ category, active }) => {
    const [itemData, setItemData] = useState({
        category,
        name:'',
        price:''
    })
    const [addMenuItem, {error, isLoading}] = useAddMenuItemMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addMenuItem(itemData);
        setItemData({ category, name:'', price:'' })
    }

    return (
        <div className={"add-item " + (active||"disabled")}>
            <p className="error">{error && Object.keys(error?.data?.msg).map(item => error?.data?.msg[item]+"\n")}</p>
            <form className={"add-item-form " + (isLoading && 'loading')} onSubmit={handleSubmit}>
                <input required type="text" id="item-name" value={itemData.name} placeholder="Item name" onChange={(e) => setItemData({...itemData, name:e.target.value})}/>
                <input  required type="number" id="item-price" value={itemData.price} placeholder="Price" onChange={(e) => setItemData({...itemData, price:e.target.value})}/>
                <input type="submit" value="Save"/>
            </form>
        </div>
    )
}

export default AddMenuItem;