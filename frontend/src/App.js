import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
// pages
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import AddUser from "./Pages/User/AddUser/AddUser";
import Users from "./Pages/User/Users/Users";
import Table from "./Pages/Table/Table";
import Menu from "./Pages/Menu/Menu";
import EditUser from "./Pages/User/EditUser/EditUser";
import Page404 from './Pages/404/404';
import CreateOrder from "./Pages/Order/CreateOrder/CreateOrder";
import EditOrder from "./Pages/Order/EditOrder/EditOrder";
import Order from "./Pages/Order/Orders/Order";
import Kitchen from "./Pages/Kitchen/Kitchen"
import { useCurrentUserQuery } from "./services/api";
import Bills from "./Pages/Bill/Bills";
import BillDetail from "./Pages/Bill/BillDetail/BillDetail";
import Invoice from "./Pages/Outlets/Invoice/Invoice";
import Test from "./Pages/Test/Test";
import useNotification from "./hooks/useNotification";
import Notification from "./components/Notification/Notification";

function App() {
  const {data: currentUserData, isLoading: currentUserLoading, isFetching:currentUserFetching, error: currentUserError, isSuccess: currentUserSuccess} = useCurrentUserQuery();
  const { notifications } = useNotification()
  // if(currentUserLoading){
  //   return <main className="edit">
  //               <div className="edit-user-container loading">
  //                   <div className="loader"></div>

  //               </div>
  //           </main>
  // }
  if(currentUserError?.status === 401){

    return(
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/*" element={<Navigate to="/login"/>}/>
          </Routes>
        </div>
      </Router>
    )
  }
  return ( 
    <Router>
      <div className="app">
      {notifications.map(notification => <Notification {...notification} />)}
        {!(currentUserLoading || currentUserFetching) && <Routes>
        {<Route path="/login" element={currentUserSuccess ? <Navigate to="/"/> : <Login/>}/>}
        {currentUserSuccess && <>
          <Route path="//" element={<Home currentUser={currentUserData}/>}/>
          {['superuser', 'admin'].includes(currentUserData?.role) && <Route path="/users" element={ <Users currentUser={currentUserData}/>}/>}
          <Route path="/users/adduser" element={<AddUser/>}/>
          <Route path="/table" element={<Table/>}/>
          <Route path="/menu" element={<Menu currentUser={currentUserData}/>}/>
          <Route path="/users/editUser/:id" element={<EditUser/>}/>
          <Route path="/order" element={<Order/>}/>
          <Route path="/order/neworder" element={<CreateOrder/>}/>
          <Route path="/order/editorder/:id" element={<EditOrder/>}/>
          <Route path="/kitchen" element={<Kitchen/>}/>
          <Route path="/bills" element={<Bills/>}/>
          <Route path="/bills/:id" element={<BillDetail/>}/>
          <Route path="/outlet/view-invoice/:id" element={<Invoice/>}/>
          <Route path="/test" element={<Test/>}/>
          <Route path="*" element={<Page404/>} />
        </>}
        </Routes>}
      </div>
    </Router>
  );
}

export default App;
