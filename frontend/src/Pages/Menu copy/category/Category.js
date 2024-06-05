import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import AddMenuItem from "../MenuItem/AddMenuItem";
import MenuItem from "../MenuItem/MenuItem";
import UpdateCategory from "./UpdateCategory";

import './Category.css';
import { useCategoryItemsQuery } from "../../../services/api";

const Category = ({ _id, name, currentUser, ...rest}) => {
    const { data, isLoading, isSuccess, isFetching } = useCategoryItemsQuery(_id);

    const [addActive, setAddActive] = useState(false);
    const [editActive, setEditActive] = useState(false);
    const [activeItem, setActiveItem] = useState('');

    if(['superuser', 'admin'].includes(currentUser?.role) && editActive){
        return <UpdateCategory {...{setEditActive, name, _id}}/>
    }
    return (
        <div className="category">
            <h2 className="category-title">
                <span>{name}</span>
                {['superuser', 'admin'].includes(currentUser?.role) &&<>
                    <FaEdit onClick={(e) => setEditActive(true)}/>
                    <FaPlus className={addActive && "add-active"} onClick={() => setAddActive(!addActive)}/>
                </>}
            </h2>
            {['superuser', 'admin'].includes(currentUser?.role) && <AddMenuItem category={_id} active={addActive}/>}
            {(isLoading || isFetching) && <div className="category-items-loading"><AiOutlineLoading3Quarters/></div>}
            {(!(isLoading || isFetching) && isSuccess) && <div className="category-items">
                {data?.category?.items?.map(item => <MenuItem currentUser={currentUser} key={item._id} {...{item, active:activeItem===item._id ? true : false, setActiveItem}}/>)}
            </div>}
        </div>
    )
}

export default Category;