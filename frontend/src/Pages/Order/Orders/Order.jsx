import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FaArrowLeft, FaChevronCircleLeft, FaChevronLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader/Loader';
import OrderCard from '../../../components/OrderCard/OrderCard';
import Paginator from '../../../components/Paginator/Paginator';
import { SocketContext } from '../../../contexts/socketContext';
import { useGetAllOrderQuery } from '../../../services/api';
import "./order.css";
import OrderFilter from './OrderFilter/OrderFilter';
import OrderSettings from './OrderSettings/OrderSettings';

const Order = () => {
  const [queryString, setQueryString] = useState('numericFilters=&dateFilters=')
  const [page,setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {data: orderData, error: orderError, isLoading: orderLoading, isFetching: orderFetching, refetch:orderRefetch} = useGetAllOrderQuery({ queryString:queryString + `&page=${page}&limit=${limit}` });
  const [data, setData] = useState(orderData);
  const navigate = useNavigate();


  const handlePageChange = (e, value) => {
    setPage(value)
}

const handleLimitChange = (val) => {
    setLimit(parseInt(val, 10))
    setPage(1)
}
  // const [data, setData] = useState(orderData?.orders);

  // console.log(orderData);
  // const navigate = useNavigate();

  const { register } = useContext(SocketContext);
  useEffect(() => {
    register("order:create", (message) => {
      console.log(message)
      orderRefetch();
    })
  }, [register, orderRefetch]);

  useEffect(()=> {
      orderData && setData(orderData);
  }, [orderData]);

  if(orderLoading || orderFetching){
    return <Loader/>
  }



  return (
    <main className="order-main-container">
      <div className="order-header">
            <div className="order-header-back"><FaArrowLeft onClick={() => navigate('/')}/></div>
            <div className="order-header-title">Orders</div>
      </div>
      {/* <div className="back-icon" onClick={()=> navigate("/")}><FaArrowLeft/></div> */}
        <div className="order-main-top">
            <div className="order-filter-container">
              <OrderFilter {...{setQueryString}}/>
              <OrderSettings {...{limit, handleLimitChange}} />
            {/* <BillSettings limit={limit} handleLimitChange={handleLimitChange}/> */}
              
            </div>
            <div className="new-order-btn-container">
              <Link to="/order/neworder">
                  <button className='add-new-order'>New order</button>
              </Link>

            </div>
        </div>
        {
          data?.orders?.length > 0 ? 
          <>
          <div className="order-lists-container">
            {
              data?.orders?.map((item)=> {
                return <OrderCard key={item?.id} orderItem={item}/>
              })
            }


          </div>
          <Paginator
            totalPage={data?.totalPage || 0} 
            page={page} 
            handlePageChange={handlePageChange}
            // limit={limit}
            // handleLimitChange={handleLimitChange}
            boundaryCount={1}
        />
        </>
        : 
        <div className="no-order-container">
           No orders yet
        </div>
        }

    </main>
  )
}

export default Order