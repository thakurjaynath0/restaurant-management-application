import React, {useState, useEffect } from "react";
import "./createorder.css";
import SingleItemCard from "../../../components/SingleItemCard/SingleItemCard";

import Navbar from "../../../components/Nav/Navbar";
import TempMenu from "../../../components/TempMenu/TempMenu";
import SelectTable from "../../../components/SelectTable/SelectTable";
import { useAllMenuItemsQuery, useCreateOrderMutation } from "../../../services/api";
import SingleSearchItem from "../../../components/SingleSearchItem/SingleSearchItem";
import { useNavigate } from "react-router-dom";
import SingleItemEditCard from "../../../components/SingleItemCard/SIngleItemEditCard/SingleItemEditCard";
import { FaArrowLeft } from "react-icons/fa";
import { useContext } from "react";
import { SocketContext } from "../../../contexts/socketContext";

const initialNewOrderData = {
  tables: [],
  items: [],
  people: ''
}
const CreateOrder = () => {
  const { message } = useContext(SocketContext);

  const [tableCardActive, setTableCardActive] = useState(true);
  const [numOfPeople, setNumOfPeople] = useState(0);
  const [newTables, setNewTables] = useState([]);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [searchActive, setSearchActive] = useState(false);
  const [newOrderData, setNewOrderData] = useState(initialNewOrderData);
  const [newItems, setNewItems] = useState([]);
  const [sumTotal, setSumTotal] = useState(0);

  // edit single order item
  const [editSingleOrderActive, setEditSingleOrderActive] = useState({status: false, item: {}});
  // search menu
  const navigate = useNavigate();
  const {
    data: menuData,
    error: menuDataError,
    isLoading: menuDataLoading,
    isSuccess: menuDataSuccess,
  } = useAllMenuItemsQuery();
  const [createOrder, {error: createOrderError, isLoading: createOrderLoading, isSuccess: createOrderSuccess, data:createOrderData}] = useCreateOrderMutation();
  const [data, setData] = useState(menuData?.items);
  const [searchVal, setSearchVal] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [frontendError, setFrontendError] = useState({status: false, msg: ""});

  const val = newItems?.map((item)=> {
    
    return item.price * item.quantity
  })
  const sum = val.reduce((partialSum, a) => partialSum + a, 0);

  const handleEditTableClick = () => {
    setTableCardActive((prev) => !prev);
  };

  const handleSearch = (e) => {
    setSearchActive(true);
    let val = e.target.value;
    setSearchVal(val);
    const tempArr = [];
    data?.map((item) => {
      if (item.name.toLowerCase().includes(val.toLowerCase())) {
        tempArr.push(item);
      }
      return;
    });
    setFilteredData(tempArr);
  };
 
  
  const handleCreateOrder = async () => {
    await createOrder(newOrderData);
  }
  const handleCancel = () => {
    navigate('/order')
    console.log("hello");
}

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });
  useEffect(() => {
    menuDataSuccess && setData(menuData?.items);
  }, [menuData]);

  useEffect(()=>{
    setSumTotal(sum)
  }, [sum]);
  useEffect(()=> {
    setNewOrderData({tables: [...newTables], items: [...newItems], people: numOfPeople})
  },[newTables, newItems, numOfPeople])

  useEffect(()=> {
    createOrderSuccess && navigate("/order");

}, [createOrderSuccess]);


// handling errors
useEffect(()=> {
  if(createOrderError){
    if(typeof createOrderError?.data?.msg === "object"){
        Object.keys(createOrderError?.data?.msg).slice(0,1).map(item => setFrontendError({status: true, msg: createOrderError?.data?.msg[item]}))
    }
    if(typeof createOrderError?.data?.msg === "string"){
        setFrontendError({status: true, msg: createOrderError?.data?.msg});
    }
}
const timer1 = setTimeout(()=> {
  setFrontendError({status: false, msg: ""});
}, 3000);
return (()=> {
  clearTimeout(timer1);
})
}, [createOrderError]);

useEffect(() => {
  createOrderSuccess && createOrderData && message({ key:"order:create", message:createOrderData?.order?._id});
},[createOrderData, createOrderSuccess, message])

  return (
    <>
    <div className="back-top">
      <div className="back-icon" onClick={()=> navigate("/order")}><FaArrowLeft/></div>
      <div className="back-title">Edit order</div>
    </div>
      <main className="create-order-main">
        <div className="create-order-left">
          <div className="left-top-wrapper">
            <div className="table-info">
              <span className="table-no">
                Table{" "}
                {newTables?.map((table, index) => {
                  return <span key={index}> {table?.number} </span>;
                })}
              </span>{" "}
              | <span className="table-people">{numOfPeople} people</span>
            </div>
            <div className="edit-table-optn" onClick={handleEditTableClick}>
              Edit table
            </div>
            {frontendError.status && <small className="order-error">{frontendError?.msg}</small>}

          </div>
          <div className="orders-info">
            {
              newItems?.map((newItem, index)=> {
                const {name, quantity, price, item, _id, type} = newItem;
                return <SingleItemCard key={index} item={item} {...{name,_id, type, quantity,price, newItems, editSingleOrderActive, setEditSingleOrderActive}}/>
              })
            }
          </div>
          <div className="create-order-left-bottom">
            <div className="order-total">
              <span>Total</span>
              <span>Rs {sumTotal}</span>
            </div>
            <div className="line"></div>
            <div className="order-btns">
              <div className="order-btns-top">
                <button className="btn dismiss-btn" onClick={handleCancel}>Dismiss</button>
                  {
                  
                  }
                <button className="btn take-order-btn" onClick={handleCreateOrder}  disabled={createOrderLoading? true: false}> {createOrderLoading? "Loading": "Place order"}</button>
              </div>
              {/* <button className="btn pay-btn">Make Payment</button> */}
            </div>
          </div>
        </div>
        <div className="create-order-right">
          <div className="search-bar">
            <input
              type="text"
              className="search"
              placeholder="Search menu"
              value={searchVal}
              onChange={handleSearch}
            />
            {windowSize < 550 && searchActive && filteredData?.length > 0  && searchVal.length > 0 && (
              <div className="search-wrapper">
                <div className="search-result-container">
                  {filteredData?.map((item) => {
                    const { _id, name, price } = item;
                    return <SingleSearchItem key={_id} _id={_id} name={name} price={price} setSearchActive={setSearchActive} newItems={newItems} setNewItems={setNewItems} sumTotal={sumTotal} setSumTotal={setSumTotal}/>;
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="menu-wrappers">
            {windowSize > 550 && (
              <div className="order-menu-items">
                {filteredData?.map((item) => {
                  const { _id, name, price } = item;
                  return <TempMenu key={_id} item={_id} name={name} price={price} setSearchActive={setSearchActive} newItems={newItems} setNewItems={setNewItems} sumTotal={sumTotal} setSumTotal={setSumTotal}/>;
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <SelectTable
        newTable={newTables}
        setNewTable={setNewTables}
        setNumOfPeople={setNumOfPeople}
        setTableCardActive={setTableCardActive}
        active={tableCardActive ? true : false}
      />
      <SingleItemEditCard {...{editSingleOrderActive, setEditSingleOrderActive,newItems, setNewItems}}/>
    </>
  );
};

export default CreateOrder;
