import React from 'react'
import './404.css'
import { useNavigate } from 'react-router-dom'
const Page404 = () => {
  const navigate = useNavigate();
  const handleClick = ()=> {
    navigate("/")
  }
  return (
      <>
        {/* <Navbar/> */}
        <div className="e404">
            <div className='err-num'>404</div>
            <div className='err-not-found'>Not Found</div>
            <div className='err-text'>Looks like the page does not exist!</div>
            <button className='err-btn' onClick={handleClick}>Home Page</button>
        </div>
      </>
  )
}

export default Page404