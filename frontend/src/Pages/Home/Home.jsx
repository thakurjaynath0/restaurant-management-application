import React from "react";
// import { FaHome, FaUsers, FaTable, FaConciergeBell, FaExchangeAlt } from 'react-icons/fa';
// import { MdLocalDining } from 'react-icons/md';
// import { RiBillLine } from 'react-icons/ri'
// import { GiCook } from 'react-icons/gi'
import "./Home.css";

import { useLogoutMutation } from "../../services/api";
import Navbar from "../../components/Nav/Navbar";
import HomeTab from "../../components/HomeTab/HomeTab";
import { FaConciergeBell, FaExchangeAlt, FaHome, FaTable, FaUsers } from "react-icons/fa";
import { MdLocalDining } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { GiCook } from "react-icons/gi";

const Home = ({ currentUser }) => {
  const [logout] = useLogoutMutation();

  return (
    <div className="home">
      <div className="tabs-container">
        <HomeTab title="Menu" Icon={MdLocalDining} link="/menu" />
        <HomeTab title="Users" Icon={FaUsers} link="/users" />
        <HomeTab title="Tables" Icon={FaTable} link="/table" />
        <HomeTab title="Orders" Icon={FaConciergeBell} link="/order" />
        <HomeTab title="Kitchen" Icon={GiCook} link="/kitchen" />
        <HomeTab title="Bills" Icon={RiBillLine} link="/bills" />
        <div className="tab" onClick={logout}>
          <FaExchangeAlt/>
          <div className="tab-title">
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
