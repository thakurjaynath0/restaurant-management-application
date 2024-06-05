import React, { useEffect, useRef, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useAddMenuItemMutation, useUploadMenuItemImageMutation } from '../../../services/api';

// import './AddMenuItem.css';
import './MenuItem.css'
const placeholderImage = 'https://scontent.fpkr3-2.fna.fbcdn.net/v/t39.30808-6/273818709_139546881867550_6906214236089545691_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=Ym3VHv5q22EAX-5XyDo&_nc_ht=scontent.fpkr3-2.fna&oh=00_AT8-ikl8uLAdUd35cV4YdTxFlPNf3VNr9ZyGTRgH855GeA&oe=62FFC13F'

const AddMenuItem = ({ category, active, setActive }) => {
    const imageInputEl = useRef(null)

    const [data, setData] = useState({
        category,
        name:'',
        price:'',
        image:''
    })
    const [addMenuItem, {error, isLoading, isSuccess}] = useAddMenuItemMutation();
    const [uploadMenuItemImage, { error: uploadMenuItemImageError, status: uploadMenuItemImageStatus, data: uploadMenuItemImageData, isLoading:uploadMenuItemImageIsLoading, isSuccess:uploadMenuItemImageIsSuccess}] = useUploadMenuItemImageMutation();


    const handleSubmit = async (e) => {
        e.preventDefault();
        await addMenuItem(data);
        setData({ category, name:'', price:'', image:"" })
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setActive(false);
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

    useEffect(() =>{
        uploadMenuItemImageIsSuccess && setData(data => ({...data, image:uploadMenuItemImageData?.filePath}));
    }, [uploadMenuItemImageData, uploadMenuItemImageIsSuccess])

    useEffect(() => {
        isSuccess && !error && setData({category, name:"", price:"", image:""})
        isSuccess && !error && setActive(false)
    }, [isSuccess, category, setActive, error])

    return (
        <>
           {active && <div className="item-edit-container">
            <div className="item-edit-wrapper">
            <input type="file" ref={imageInputEl} accept="image/*" alt="aria-label" onChange={handleImageUpload} hidden/>
            <div  className={"item-edit image "+((isLoading || uploadMenuItemImageIsLoading  ) && ' loading')} onClick={handleImageClick}>
                <img src={data?.image || placeholderImage } alt=""/>
            </div>
            <p className="item-edit error">
                {error && typeof error?.data?.msg === 'object' && Object.keys(error?.data?.msg).map(item => error?.data?.msg[item]+"\n")}
                {error && typeof error?.data?.msg === 'string' && error?.data?.msg}
                {uploadMenuItemImageError && uploadMenuItemImageError?.data?.msg}
            </p>
            <form className={"item-edit edit-form "+ ((isLoading || uploadMenuItemImageIsLoading  ) && ' loading')} onSubmit={handleSubmit}>
                <input placeholder="Item name" required id="name" type="text" value={data?.name} onChange={(e) => setData({...data, name:e.target.value})}/>
                <input required placeholder="Price" id="price" type="number" value={data?.price} onChange={(e) => setData({...data, price:e.target.value})}/>
                <button id="cancel" type="button" onClick={handleCancel}><FaTimes/> Cancel</button>
                <button type="submit" id="save"><FaCheck/> Save </button>
            </form>
            </div>
            <div className="item-edit-pseudo-wrapper" onClick={handleCancel}></div>
        </div> }
    </>
    )
}

export default AddMenuItem;