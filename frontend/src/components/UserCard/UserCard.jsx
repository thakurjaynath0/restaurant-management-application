import React from 'react'
import './UserCard.css';
import {useNavigate} from 'react-router';

import userPlaceholder from '../../assets/user.jpg';

import {FaPen, FaPlus, FaStar,} from 'react-icons/fa';

const UserCard = ({ _id, name, position, profile_pic, role, currentUser }) => {
  const navigate = useNavigate();

  const isAllowedToEdit = () => {
    const priority = {
      'superuser':3,
      'admin':2,
      'staff':'1'
    };
    if(priority[currentUser.role] > priority[role])
      return true;
      
    if(priority[role] === priority[currentUser.role]){
      if(_id === currentUser.id)
        return true;
    }
    return false;
  }
  return (
    <div className="user-card">
        <div className={"badge "+ role}>
          <FaStar/>
        </div>
        { isAllowedToEdit() && <div className="edit" onClick={() => navigate(`/users/editUser/${_id}`)}>
          <FaPen />
        </div>}
        <div className="user-card-image">
            <img src={profile_pic || userPlaceholder} alt="alternative text"/>
        </div>
        <div className="user-card-name">
            {name}
        </div>
        <div className="user-card-position">
            {role==='staff' ? position : role}
        </div>
    </div>
  )
}

const UserAddCard = () => {
  const navigate = useNavigate();

  return (
    <div className="user-card user-add-card">
      <FaPlus onClick={() => navigate('/users/addUser')}/>
      <span>Add New User</span>
    </div>
  )
}

export default UserCard;
export {UserAddCard} ;