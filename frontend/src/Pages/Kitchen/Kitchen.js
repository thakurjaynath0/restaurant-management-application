import React, { useEffect } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGetAllOrderQuery } from '../../services/api'
import Masonry from '@mui/lab/Masonry';

import './Kitchen.css'
import OrderItem from './OrderItem';

const Kitchen = () => {
  const navigate = useNavigate()
  const {data, isLoading, isFetching} = useGetAllOrderQuery({ queryString: 'status=pending'})


  useEffect(() =>{
    console.log(data);
  })
  return (
    <div className="kitchen">
      <div className="kitchen-header">
        <div className="kitchen-header-back"><FaArrowLeft onClick={() => navigate('/')}/></div>
        <div className="kitchen-header-title">Kitchen Orders</div>
      </div>

      {(isLoading || isFetching) && <span className="kitchen-loader-svg"> <AiOutlineLoading3Quarters/></span>}
      <Masonry className="kitchen-order-wrapper" columns={{ xs:1, sm:1, md:2, lg:3, xl:4}} spacing={{ xs:1, sm:2, md:2, lg:4, xl:6 }}>
        {!(isLoading || isFetching) && data?.orders?.map(order => <>
          <div className="kitchen-order" key={order?._id}>  
            <div className="kitchen-order-number">Order #{order?.number}</div>
            <div className="kitchen-order-tables">
              {order?.tables?.map(table => <span>{table?.number} | </span>)}
            </div>
            <div className="kitchen-order-items">
              {order?.items?.map(item => <OrderItem order={order} item={item}/>)}
            </div>
            {order?.note && <div className="kitchen-order-note">
              {order?.note}
            </div>}
          </div>
        </>)}
      </Masonry>
    </div>
  )
}

export default Kitchen