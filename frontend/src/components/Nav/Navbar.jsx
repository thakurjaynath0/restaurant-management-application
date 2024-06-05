import React from "react";
import {
  FaBars,
  FaConciergeBell,
  FaExchangeAlt,
  FaHome,
  FaTable,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { GiCook } from "react-icons/gi"
import SingleMenu from "./SingleMenu/SingleMenu";
import "./navbar.css";
import { useState } from "react";
import { useCurrentUserQuery, useLogoutMutation } from "../../services/api";
import { MdLocalDining } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";

const Navbar = ({title}) => {
  const { data: currentUser } = useCurrentUserQuery();
  const [logout] = useLogoutMutation();
  const [navActive, setNavActive] = useState(false);
  const handleNavClick = () => {
    setNavActive(!navActive);
  };
  const handleLogout=()=>{
    logout();
    setNavActive(false);
  }
  return (
    <div className="nav-bar">
      <div className="nav-left nav-menu">
        <div className="menu-icon" onClick={handleNavClick}>
          <FaBars />
        </div>
        <div className={navActive ? "menu-items active" : "menu-items"}>
          <div className="cross-icon" onClick={handleNavClick}>
            <FaTimes />
          </div>
          <div className="user-name">
            {currentUser?.name}
            
            <div className="user-role">{currentUser?.role}</div>
            <div className="line"></div>
          </div>
          <div className="menu-main">
            <SingleMenu title="Home" Icon={FaHome} link="/" setNavActive={setNavActive}/>
            <SingleMenu title="Menu" Icon={MdLocalDining} link="/menu" setNavActive={setNavActive}/>
            {["superuser", "admin"].includes(currentUser?.role) && (
              <SingleMenu title="Users" Icon={FaUsers} link="/users" setNavActive={setNavActive}/>
            )}
            <SingleMenu title="Tables" Icon={FaTable} link="/table" setNavActive={setNavActive}/>
            <SingleMenu title="Orders" Icon={FaConciergeBell} link="/order" setNavActive={setNavActive}/>
            <SingleMenu title="Kitchen Orders" Icon={GiCook } link="/kitchen" setNavActive={setNavActive} />
            <SingleMenu title="Bills" Icon={RiBillLine} link="/bills" setNavActive={setNavActive}/>
            <div className="menu-item" onClick={handleLogout}>
              <div className="strip"></div>
              <span className="menu-content">
                <FaExchangeAlt /> &nbsp;&nbsp; Logout
              </span>
            </div>
          </div>
          <span className="cprt">&copy; Himalayan Cafe</span>
        </div>
      </div>
      <div className="nav-middle">{title}</div>
      <div className="nav-right"></div>
    </div>
  );
};

export default Navbar;