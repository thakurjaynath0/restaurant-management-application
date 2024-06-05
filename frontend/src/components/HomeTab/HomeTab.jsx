import React from 'react'
import {Link, useNavigate} from 'react-router-dom';

import './HomeTab.css'

const HomeTab = ({ title , Icon , link }) => {
    const navigate = useNavigate();
  return (
    <div className="tab" onClick={() => navigate(link)}>
        <Icon/>
        <div className="tab-title">
            {title}
        </div>
    </div>
  )
}

export default HomeTab