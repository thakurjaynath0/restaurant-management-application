import React, { useEffect } from 'react'
import { FaSearch, FaSlidersH, FaArrowLeft, FaExclamation, FaExclamationCircle } from 'react-icons/fa';

import './Menu.css';
import Category from './category/Category';
import AddCategory from './category/AddCategory';
import { useAllCategoriesQuery } from '../../services/api';
import CategorySkeleton from './category/CategorySkeleton';
import { useNavigate } from 'react-router-dom';

    const Menu = ({ currentUser }) => {
    const navigate = useNavigate();
    const {data, error, isLoading, isFetching, isSuccess} = useAllCategoriesQuery();
    return (
    <main className="menu">
        <h1 className="menu-title">
            <span onClick={() => navigate('/')}><FaArrowLeft/></span>
            Menu
        </h1>
        {/* <header className="menu-header">
            <div className="search">
                <FaSearch/>
                <input type="text" className="search-field" placeholder="Search here ..."/>
            </div>
            <div className="filter">
                <FaSlidersH/>
                FILTER
            </div>
        </header> */}
        {error && <h1 className="menu-error"><FaExclamationCircle/> Sorry, Unable to get menu</h1>}
        {!error && <section className="category-list">
            {(isLoading || isFetching) && [1,2,3,4].map((item, index) => <CategorySkeleton key={index} active={isLoading}/>)}
            {!(isLoading || isFetching) && data?.category?.map(category => <Category currentUser={currentUser} key={category._id} {...category}/>)}
            {['superuser', 'admin'].includes(currentUser?.role) && isSuccess && <AddCategory />}
        </section>}
    </main>
    )
}

export default Menu;