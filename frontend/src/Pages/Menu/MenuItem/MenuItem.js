import React, {useEffect, useState, useRef} from 'react';
import { FaPlus, FaSearch, FaSlidersH, FaTimes, FaCheck, FaTrash, FaEdit } from 'react-icons/fa';
import { useDeleteMenuItemMutation, useUpdateMenuItemMutation, useUploadMenuItemImageMutation } from '../../../services/api';

import './MenuItem.css'

const placeholderImage = 'https://scontent.fpkr3-2.fna.fbcdn.net/v/t39.30808-6/273818709_139546881867550_6906214236089545691_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Ym3VHv5q22EAX-5XyDo&_nc_ht=scontent.fpkr3-2.fna&oh=00_AT8-ikl8uLAdUd35cV4YdTxFlPNf3VNr9ZyGTRgH855GeA&oe=62FFC13F'

const MenuItem = ({item, active, setActiveItem, currentUser}) => {
    const [data, setData] = useState(item);
    const [edit , setEdit] = useState(active);
    const imageInputEl = useRef(null)

    const [updateMenuItem, { error:updateError, data:updateData, status:updateStatus,isLoading:updateIsLoading, isSuccess:updateIsSuccess }] = useUpdateMenuItemMutation();
    const [deleteMenuItem, { error:deleteError, status:deleteStatus, isSuccess:deleteIsSuccess, isLoading:deleteIsLoading }] = useDeleteMenuItemMutation();
    const [uploadMenuItemImage, { error: uploadMenuItemImageError, status: uploadMenuItemImageStatus, data: uploadMenuItemImageData, isLoading:uploadMenuItemImageIsLoading, isSuccess:uploadMenuItemImageIsSuccess}] = useUploadMenuItemImageMutation();

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

    const handleImageClick= async (e) => {
        imageInputEl.current.click();
    }

    const handleImageUpload = async (e)=> {
        const image = e.target.files[0];
        let img = new FormData();
        img.append("image", image);
        await uploadMenuItemImage(img);
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

    useEffect(() =>{
        uploadMenuItemImageIsSuccess && setData(data => ({...data, image:uploadMenuItemImageData?.filePath}));
    }, [uploadMenuItemImageData, uploadMenuItemImageIsSuccess])

    return (
        <>
            {['superuser', 'admin'].includes(currentUser?.role) && edit && <div className="item-edit-container">
                <div className="item-edit-wrapper">
                <input type="file" ref={imageInputEl} accept="image/*" alt="aria-label" onChange={handleImageUpload} hidden/>
                <div  className={"item-edit image "+((updateIsLoading || deleteIsLoading || uploadMenuItemImageIsLoading  ) && ' loading')} onClick={handleImageClick}>
                    <img src={data?.image || placeholderImage } alt={data?.name}/>
                </div>
                <p className="item-edit error">
                    {updateError && typeof updateError?.data?.msg === 'object' && Object.keys(updateError?.data?.msg).map(item => updateError?.data?.msg[item]+"\n")}
                    {updateError && typeof updateError?.data?.msg === 'string' && updateError?.data?.msg}
                    {uploadMenuItemImageError && uploadMenuItemImageError?.data?.msg}
                    {deleteError && deleteError?.data?.msg}
                </p>
                <form className={"item-edit edit-form "+ ((updateIsLoading || deleteIsLoading || uploadMenuItemImageIsLoading  ) && ' loading')} onSubmit={handleUpdate}>
                    <input required id="name" type="text" value={data.name} onChange={(e) => setData({...data, name:e.target.value})}/>
                    <input required id="price" type="number" value={data.price} onChange={(e) => setData({...data, price:e.target.value})}/>
                    <button id="cancel" type="button" onClick={handleCancel}><FaTimes/> Cancel</button>
                    <button type="submit" id="save"><FaCheck/> Save </button>
                    <button id="delete" type="button" onClick={handleDelete}><FaTrash/> Delete </button>
                </form>
                </div>
                <div className="item-edit-pseudo-wrapper" onClick={handleCancel}></div>
            </div>}
            <div className={"item "+(deleteIsSuccess && 'hidden')}  onClick={(e) => setActiveItem(data?._id) }>
                <div className="name">{data?.name}</div>
                <div className="price"> Rs {data?.price}</div>
                <div className="image">
                    <img src={data?.image || placeholderImage} alt={data?.name}/>    
                </div>
            </div>
        </>
    )
}

export default MenuItem;