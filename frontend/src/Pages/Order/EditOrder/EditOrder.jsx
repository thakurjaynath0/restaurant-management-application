import React, {useState, useEffect } from "react";
import SingleItemCard from "../../../components/SingleItemCard/SingleItemCard";

import Navbar from "../../../components/Nav/Navbar";
import TempMenu from "../../../components/TempMenu/TempMenu";
import SelectTable from "../../../components/SelectTable/SelectTable";
import { useAllMenuItemsQuery, useCancelOrderMutation, useCompleteOrderMutation, useCreateOrderMutation, useGetOneOrderQuery } from "../../../services/api";
import SingleSearchItem from "../../../components/SingleSearchItem/SingleSearchItem";
import { useNavigate, useParams } from "react-router-dom";
import SingleItemEditCard from "../../../components/SingleItemCard/SIngleItemEditCard/SingleItemEditCard";
import Loader from "../../../components/Loader/Loader";
import { FaArrowLeft } from "react-icons/fa";


const EditOrder = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {data: singleOrderData, isLoading: singleOrderLoading, error: singleDataError, isSuccess: singleDataSuccess} = useGetOneOrderQuery({_id: id});
  const [completeOrder, {error: completeOrderError, isSuccess: completeOrderSuccess, isLoading: completeOrderLoading}] = useCompleteOrderMutation();
  const [cancelOrder, {error: cancelOrderError, isSuccess: cancelOrderSuccess, isLoading: cancelOrderLoading}] = useCancelOrderMutation();
  
  const [tableCardActive, setTableCardActive] = useState(false);
  const [numOfPeople, setNumOfPeople] = useState(singleOrderData?.order?.people);
  const [newTables, setNewTables] = useState([]);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [searchActive, setSearchActive] = useState(false);
  const [newOrderData, setNewOrderData] = useState(singleOrderData?.order);
  const [newItems, setNewItems] = useState([]);
  const [sumTotal, setSumTotal] = useState(0);
  const [err, setErr] = useState();
  const [orderItemLoading, setOrderItemLoading] = useState(false);
  // temp tables

  // edit single order item
  const [editSingleOrderActive, setEditSingleOrderActive] = useState({status: false, item: {}});
  // search menu
  const {
    data: menuData,
    error: menuDataError,
    isLoading: menuDataLoading,
    isSuccess: menuDataSuccess,
  } = useAllMenuItemsQuery();
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
 
  const handleDismiss = () => {
    navigate('/order')
}
const handleCancelOrder = async ()=>{
  await cancelOrder({_id: id})
  console.log(cancelOrderSuccess);
  
}
const handleCompleteOrder = async() =>{
  await completeOrder({_id: id})
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
  }, [menuData, menuDataSuccess]);

  useEffect(()=> {
    if(singleDataSuccess){
      setNewTables(singleOrderData?.order?.tables)
      setNewItems(singleOrderData?.order?.items)
      setNumOfPeople(singleOrderData?.order?.people)

    }
    
  }, [singleDataSuccess, setNewTables,setNewItems, singleOrderData])


  useEffect(()=>{
    setSumTotal(sum)
  }, [sum]);
  useEffect(()=> {
    setNewOrderData({tables: [...newTables], items: [...newItems], people: numOfPeople})
  },[newTables, newItems, numOfPeople])


  useEffect(()=> {
      (completeOrderSuccess || cancelOrderSuccess) && navigate('/order')
  }, [completeOrderSuccess, cancelOrderSuccess, navigate])
  useEffect(()=>{
    completeOrderError && setErr(completeOrderError)
    cancelOrderError && setErr(cancelOrderError)
  }, [completeOrderError, cancelOrderError, setErr])
// handling errors
useEffect(()=> {
if(err){
  if(typeof err?.data?.msg === "object"){
      Object.keys(err?.data?.msg).slice(0,1).map(item => setFrontendError({status: true, msg: err?.data?.msg[item]}))
  }
  if(typeof err?.data?.msg === "string"){
      setFrontendError({status: true, msg: err?.data?.msg});
  }
}
const timer1 = setTimeout(()=> {
setFrontendError({status: false, msg: ""});
}, 3000);
return (()=> {
clearTimeout(timer1);
})
}, [err]);

useEffect(()=> {
  const timer1 = setTimeout(()=> {
      (orderItemLoading === true) && setOrderItemLoading(false);
      }, 3000);
      return (()=> {
    clearTimeout(timer1);
    })
}, [orderItemLoading])

console.log(singleOrderData);
  return (
    <>
      <div className="back-top">
        <div className="back-icon" onClick={()=> navigate("/order")}><FaArrowLeft/></div>
        <div className="back-title">Create Order</div>
      </div>
      <main className="main-pg create-order-main">
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
          {
            orderItemLoading? 
            <div className="orders-info-loading">
              <Loader/>
            </div>
            :
          <div className="orders-info">
            {
              newItems?.map((newItem, index)=> {
                const {name, quantity, price, item, _id, type} = newItem;
                return <SingleItemCard key={index} item={item} {...{name, quantity,price,_id, type, newItems, editSingleOrderActive, setEditSingleOrderActive}}/>
              })
            }
          </div>
          }
          <div className="create-order-left-bottom">
            <div className="order-total">
              <span>Total</span>
              <span>Rs {sumTotal}</span>
            </div>
            <div className="line"></div>
            <div className="order-btns">
              <div className="order-btns-top edit-btns">
                <button className="btn cancel-btn" onClick={handleCancelOrder} disabled={cancelOrderLoading}>{cancelOrderLoading ? "Loading": "Cancel order"}</button>
                <button className="btn complete-btn" onClick={handleCompleteOrder} disabled={completeOrderLoading}>{completeOrderLoading?"Loading": "Complete Order"}</button>
                <button className="btn dismiss-btn" onClick={handleDismiss}>Done</button>
              </div>
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
                    return <SingleSearchItem key={_id}  orderId={id} {...{_id, name, price, setSearchActive, newItems, setNewItems, sumTotal, setSumTotal,setOrderItemLoading, setErr}} action="edit"/>;
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
                  return <TempMenu key={_id} item={_id} orderId={id} {...{_id, name,price, setSumTotal, sumTotal, setNewItems, newItems,setSearchActive, setOrderItemLoading, setErr}} action="edit"/>;
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <SelectTable
        newTable={newTables}
        setNewTable={setNewTables}
        numOfPeople={numOfPeople}
        setNumOfPeople={setNumOfPeople}
        setTableCardActive={setTableCardActive}
        active={tableCardActive ? true : false}
        singleOrderData={singleOrderData}
        orderId={id}
        action="edit"
      />
      <SingleItemEditCard {...{editSingleOrderActive, setEditSingleOrderActive,newItems, setNewItems, setErr}} orderId={id} action="edit"/>
    </>
  );
};

export default EditOrder;
