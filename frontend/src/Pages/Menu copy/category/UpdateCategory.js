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
        <div className={"category add-category "+(isLoading && 'loading')}>
            <p className="error">{error && error?.data?.msg}</p>
            <form id="add-category-form" onSubmit={handleSubmit}>
                <input required id="name" type="text" value={category.name} placeholder="Category Name ...." onChange={(e) => setCategory({...category, name:e.target.value})}/>
                <button type="button" id="cancel" onClick={(e) => setEditActive(false)}>Cancel</button>
                <button type="submit" id="save">Save</button>
            </form>
        </div>
    )
}

export default UpdateCategory;