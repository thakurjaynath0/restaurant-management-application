import React from 'react'
import './singlemenu.css'
import { useNavigate } from 'react-router-dom'

const SingleMenu = ({title, Icon, link, setNavActive}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(link);
    setNavActive(false)
  }
  return (
    <div className="menu-item" onClick={handleClick}>
        <div className="strip"></div>
        <span className='menu-content'><Icon/> &nbsp;&nbsp; {title}</span>
    </div>
  )
}

export default SingleMenu