import React, { useState } from 'react'
import { useEffect } from 'react';
import {FaArrowLeft, FaExclamationCircle, FaSearch} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import UserCard, {UserAddCard} from '../../../components/UserCard/UserCard';
import { useAllUsersQuery, useCurrentUserQuery, useLogoutMutation } from '../../../services/api';

import './User.css';

const Users = ({ currentUser }) => {
    const navigate = useNavigate();
    const { data, error, isLoading, isFetching, isSuccess} = useAllUsersQuery();
    const [searchedUsers, setSearchedUsers] = useState(data?.users || []);
    const [search, setSearch] = useState('');

    useEffect(()=> {
        setSearchedUsers(data?.users || []);
    }, [data])

    useEffect(() => {
        setSearchedUsers(data?.users.filter(user => user.name.toLowerCase().includes(search.toLowerCase())) || []);
    }, [search, data])

    return (
    <div className="users-page">
        <div className="users-page-header">
            <h1 className="users-page-title">
                <FaArrowLeft onClick={() => navigate('/')}/>
                Users
            </h1>
            {/* <button className="add-user" onClick={() => navigate('/users/registration')}>Add User <FaPlus/></button> */}
        </div>
        <div className="users-page-search">
            <div className="search">
                <FaSearch/>
                <input type="text" placeholder="Search here" className="search-input" value={search} onChange={(e) => {setSearch(e.target.value)}}/>
            </div>
            {/* <div className="filter">
                <FaSlidersH/> FILTER
            </div> */}
        </div>
        {error && <h1 className="users-error"><FaExclamationCircle/> Sorry, Unable to get users .</h1>}
        {!error && <div className="users-list">
            {(isLoading || isFetching) && [1,2,3,4].map(item => {
                return <div className="user-card loading" key={item}>
                    <div className="image"></div>
                    <div className="name"></div>
                    <div className="role"></div>
                </div>
            })}
            {isSuccess && searchedUsers.map(user => {
                return <UserCard {...user} currentUser={currentUser} key={user._id}/>
            })}
            {isSuccess && <UserAddCard/>}
        </div>}
    </div>
    )
}

export default Users