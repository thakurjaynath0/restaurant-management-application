import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import AddMenuItem from "../MenuItem/AddMenuItem";
import MenuItem from "../MenuItem/MenuItem";
import UpdateCategory from "./UpdateCategory";
// import MenuSkeleton from "../MenuItem/MenuItemSkeleton";

import './Category.css';
import { useCategoryItemsQuery } from "../../../services/api";

const inRangeInclusive = (amount, low, high) => {
    if(!low && !high) return true;
    if (!low) {
        return amount <= high
    }

    if (!high) {
        return amount >= low
    }
    return (amount >= low) && (amount <= high);
}

const Category = ({ _id, name, currentUser, searchQuery, filter, ...rest}) => {
    const [data, setData] = useState({
        category:{
            _id,
            name,
            items:[]
        }
    })
    const { data:fetchedData, isLoading, isSuccess, isFetching } = useCategoryItemsQuery(_id);

    const [addActive, setAddActive] = useState(false);
    const [editActive, setEditActive] = useState(false);
    const [activeItem, setActiveItem] = useState('');

    // if(['superuser', 'admin'].includes(currentUser?.role) && editActive){
    //     return <UpdateCategory {...{setEditActive, name, _id}}/>
    // }
    useEffect(() => {
        setData(data => ({...data, category:{...data?.category, items:fetchedData?.category.items}}))
    }, [fetchedData])

    useEffect(() => {
        const newItems = fetchedData?.category?.items.filter(item => item.name.toLowerCase().includes(searchQuery) && inRangeInclusive(item?.price, filter?.price?.low, filter?.price?.high))
        setData(data => ({...data, category:{...data?.category, items:newItems}}))

    },[searchQuery, fetchedData, filter])

    return (
        <>
        
        {['superuser', 'admin'].includes(currentUser?.role) && editActive &&
             <UpdateCategory {...{setEditActive, name, _id}}/>
        }
        {<div className="category">
            <div className="category-title">
                <div className="category-name">{name}</div>
                {['superuser', 'admin'].includes(currentUser?.role) &&<>
                    <div><FaEdit className="category-edit" onClick={(e) => setEditActive(true)}/></div>
                    <div><FaPlus className={"category-add-item " + (addActive && "add-active")} onClick={() => setAddActive(!addActive)}/></div>
                </>}
            </div>
            {['superuser', 'admin'].includes(currentUser?.role) && <AddMenuItem category={_id} setActive={setAddActive} active={addActive}/>}
            {(isLoading || isFetching) && <div className="category-items-loading"><AiOutlineLoading3Quarters/></div>}
            {(!(isLoading || isFetching) && isSuccess) && <div className="category-items">
                {data?.category?.items?.map(item => <MenuItem currentUser={currentUser} key={item._id} {...{item, active:activeItem===item._id ? true : false, setActiveItem}}/>)}
            </div>}
        </div>}
        </>
    )
}

export default Category;