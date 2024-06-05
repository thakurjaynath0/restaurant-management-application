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

    if(addActive) {
        return(
            <div className={"category add-category "+((isLoading || isFetching) && 'loading')}>
                <p className="error">{error && Object.keys(error?.data?.msg).map(item => error?.data?.msg[item]+"\n")}</p>
                <form id="add-category-form" onSubmit={handleSubmit}>
                    <input required id="name" type="text" placeholder="Category Name ...." onChange={(e) => setData({...data, name: e.target.value})}/>
                    <button type="button" id="cancel" onClick={(e) => setAddActive(false)}>Cancel</button>
                    <button type="submit" id="save">Save</button>
                </form>
            </div>
        )
    }

    return(
        <div className="category add-category">
            <FaPlus onClick={(e) => setAddActive(true)}/>
        </div>
    )
}

export default AddCategory;