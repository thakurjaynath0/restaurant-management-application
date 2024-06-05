import React, { useEffect, useState } from 'react';
import { useUpdateCategoryMutation } from '../../../services/api';

const UpdateCategory = ({ setEditActive, name, _id }) => {
    const [category, setCategory] = useState({
        _id,
        name
    })

    const [updateCategory, { error, status, isLoading, isSuccess}] = useUpdateCategoryMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateCategory(category);
    }

    useEffect(() =>{
        isSuccess && setEditActive(false);
    },[isSuccess, setEditActive])

    return(
        <div className={"category update-category "+(isLoading && 'loading')}>
            <form id="add-category-form" onSubmit={handleSubmit}>
                <p className="error">
                        {error && typeof error?.data?.msg === 'object' && Object.keys(error?.data?.msg).map(item => error?.data?.msg[item]+"\n")}
                        {error && typeof error?.data?.msg === 'string' && error?.data?.msg}
                </p>
                <input required id="name" type="text" value={category.name} placeholder="Category Name ...." onChange={(e) => setCategory({...category, name:e.target.value})}/>
                <button type="button" id="cancel" onClick={(e) => setEditActive(false)}>Cancel</button>
                <button type="submit" id="save">Save</button>
            </form>
            <div className="item-edit-pseudo-wrapper" onClick={(e) => setEditActive(false)}></div>
        </div>
    )
}

export default UpdateCategory;