import React, {useEffect, useState} from 'react';
import { FaPlus, FaSearch, FaSlidersH, FaTimes, FaCheck, FaTrash, FaEdit } from 'react-icons/fa';
import { useDeleteMenuItemMutation, useUpdateMenuItemMutation } from '../../../services/api';

import './MenuItem.css'

const MenuItem = ({item, active, setActiveItem, currentUser}) => {
    const [data, setData] = useState(item);
    const [edit , setEdit] = useState(active);

    const [updateMenuItem, { error:updateError, data:updateData, status:updateStatus,isLoading:updateIsLoading, isSuccess:updateIsSuccess }] = useUpdateMenuItemMutation();
    const [deleteMenuItem, { error:deleteError, status:deleteStatus, isSuccess:deleteIsSuccess, isLoading:deleteIsLoading }] = useDeleteMenuItemMutation();

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updateMenuItem(data);
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setEdit(false);
        setData(item);
        setActiveItem('');
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        await deleteMenuItem(data);
    }

    useEffect(()=>{
        deleteIsSuccess && setActiveItem('');
        updateIsSuccess && setActiveItem('');
    },[updateIsSuccess, deleteIsSuccess, setActiveItem])

    useEffect(() =>{
        setData(item);
    },[item])

    useEffect(() =>{
        setEdit(active);
    },[active])

    if(['superuser', 'admin'].includes(currentUser?.role) && edit){
        return (
        <>
        <p className="item-edit error">
            {updateError && typeof updateError?.data?.msg === 'object' && Object.keys(updateError?.data?.msg).map(item => updateError?.data?.msg[item]+"\n")}
            {updateError && typeof updateError?.data?.msg === 'string' && updateError?.data?.msg}
            {deleteError && deleteError?.data?.msg}
        </p>
        <form className={"item-edit "+ ((updateIsLoading || deleteIsLoading  ) && ' loading')} onSubmit={handleUpdate}>
            <input required id="name" type="text" value={data.name} onChange={(e) => setData({...data, name:e.target.value})}/>
            <input required id="price" type="number" value={data.price} onChange={(e) => setData({...data, price:e.target.value})}/>
            <button id="cancel" type="button" onClick={handleCancel}><FaTimes/></button>
            <button type="submit" id="save"><FaCheck/></button>
            <button id="delete" type="button" onClick={handleDelete}><FaTrash/></button>
        </form>
        </>
        )
    }
    return (
        <div className={"item "+(deleteIsSuccess && 'hidden')}  onClick={(e) => setActiveItem(data?._id) }>
            <div className="name">{data?.name}</div>
            <div className="price">{data?.price}</div>
        </div>
    )
}

export default MenuItem;