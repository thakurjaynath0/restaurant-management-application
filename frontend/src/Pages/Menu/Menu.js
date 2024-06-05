import React, { useEffect, useState } from 'react'
import { FaSearch, FaSlidersH, FaArrowLeft, FaExclamation, FaExclamationCircle } from 'react-icons/fa';
import {AiOutlineLoading3Quarters} from "react-icons/ai";

import './Menu.css';
import Category from './category/Category';
import AddCategory from './category/AddCategory';
import { useAllCategoriesQuery } from '../../services/api';
// import CategorySkeleton from './category/CategorySkeleton';
import { useNavigate } from 'react-router-dom';
import Filter from './Filter';

const Menu = ({ currentUser }) => {
    const navigate = useNavigate();
    const {data, error, isLoading, isFetching, isSuccess} = useAllCategoriesQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filter, setFilter] = useState({
        category:'',
        price:{
            high:'',
            low:'',
        }
    })

    return (
    <main className="menu">
        <h1 className="menu-title">
            <span onClick={() => navigate('/')}><FaArrowLeft/></span>
            Menu
        </h1>
        <header className="menu-header">
            <div className="search">
                <FaSearch/>
                <input type="text" className="search-field" placeholder="Search here ..." onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}/>
            </div>
            <div className="filter" onClick={() => setShowFilter(true)}>
                <FaSlidersH />
                FILTER
            </div>
            {showFilter && <Filter filter={filter} setFilter={setFilter} setShowFilter={setShowFilter} categories={data?.category} />}
        </header>
        {error && <h1 className="menu-error"><FaExclamationCircle/> Sorry, Unable to get menu</h1>}
        {!error && <section className="category-list">
            {(isLoading || isFetching) && <div className="category-loading"><AiOutlineLoading3Quarters/></div>}
            {!(isLoading || isFetching) && 
                data?.category?.map(category => 
                    !!filter?.category 
                        ? 
                        (category?._id === filter?.category) && <Category currentUser={currentUser} key={category._id} {...category} searchQuery={searchQuery} filter={filter}/> 
                        : 
                        <Category currentUser={currentUser} key={category._id} {...category} searchQuery={searchQuery} filter={filter}/>
                )}
            {['superuser', 'admin'].includes(currentUser?.role) && !(isLoading || isFetching) && isSuccess && <AddCategory />}
        </section>}
    </main>
    )
}

export default Menu;