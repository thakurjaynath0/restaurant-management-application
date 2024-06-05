import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { useAddCategoryMutation } from '../../../services/api';

import './Category.css'

const AddCategory = () => {
    const [addCategory, {error, isSuccess, isLoading, isFetching}] = useAddCategoryMutation();
    const [addActive, setAddActive] = useState(false);
    const [data, setData] = useState({ name:'' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addCategory(data)
    }

    useEffect(() =>{
        isSuccess && setAddActive(false);
        isSuccess && setData({name:''});
    },[isSuccess])

    return(
        <>
            {addActive && <div className={"category update-category add "+((isLoading || isFetching) && 'loading')}>
                <form id="update-category-form" onSubmit={handleSubmit}>
                    <p className="error">
                        {error && typeof error?.data?.msg === 'object' && Object.keys(error?.data?.msg).map(item => error?.data?.msg[item]+"\n")}
                        {error && typeof error?.data?.msg === 'string' && error?.data?.msg}
                    </p>
                    <input required id="name" type="text" placeholder="Category Name ...." onChange={(e) => setData({...data, name: e.target.value})}/>
                    <button type="button" id="cancel" onClick={(e) => setAddActive(false)}>Cancel</button>
                    <button type="submit" id="save">Save</button>
                </form>
            <div className="item-edit-pseudo-wrapper" onClick={(e) => setAddActive(false)}></div>
            </div>}
            <div className="add-category" >
                <span onClick={(e) => setAddActive(true)}>Add new category <FaPlus /></span>
            </div>
        </>
    )
}

export default AddCategory;