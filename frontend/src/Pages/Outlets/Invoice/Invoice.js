import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useGetBillQuery } from '../../../services/api'
import Logo from '../../../assets/images/logo.png'
import QR from 'react-qr-code'

import { useReactToPrint } from 'react-to-print'

import './Invoice.css'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { formatDate } from '../../../utils/date'

const Invoice = () => {
    const { id } = useParams()
    const {data:{ bill = {} } = {}, isLoading, isFetching} = useGetBillQuery(id)
    const location = window.location.href;

    const invoiceRef = useRef()

    const handlePrint = useReactToPrint({
      content: () => invoiceRef.current
    })

    return (
      <div className="invoice-wrapper">
        {!(isLoading || isFetching) && <div className="invoice-download" onClick={handlePrint}>Print Invoice</div>}
        <div className="bill-container" ref={invoiceRef}>
          {(isLoading || isFetching) && <span className="invoice-loader-svg"> <AiOutlineLoading3Quarters/></span>}
          {!(isLoading || isFetching)&& <><div className="bill-header">
            <div className="header-details">
              <span className="company-name">Himalayan cafe</span>
              <span className="company-address">Birgunj, Nepal</span>
              <span className="company-phone">9845796920, 9807119888</span>
            </div>
            <div className="header-logo">
              <img src={Logo} alt="Himalayan Cafe" />
            </div>
          </div>
          <div className="seperator"></div>
    
          <div className="bill-main">
            <div className="bill-title">
              <div className="order-number">Order: #{bill?.details?.orderNumber}</div>
              <div className="date">Date: {formatDate(bill?.details?.orderDate)}</div>
            </div>
    
            <div className="bill-body">
              <table className="bill-table">
                
                <tr className="table-header">
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>total</th>
                </tr>
    
                {bill?.details?.orderItems.map(item =>
                  <tr key={item?._id}>
                    <td>{item?.itemName}</td>
                    <td>{item?.itemQuantity}</td>
                    <td>{item?.itemPrice}</td>
                    <td>{item?.itemTotal}</td>
                  </tr>
                )}
                
                <tr className="dark">
                  <td colSpan="3">sub total</td>
                  <td>Rs {bill?.details?.subTotal}</td>
                </tr>
                <tr className="dark">
                  <td colSpan="3">Tax</td>
                  <td>Rs {bill?.details?.taxAmount}</td>
                </tr>
                <tr className="dark">
                  <td colSpan="3">Service charge</td>
                  <td>Rs {bill?.details?.gratuity}</td>
                </tr>
                <tr className="dark">
                  <td colSpan="3">Discount</td>
                  <td>Rs {bill?.discount}</td>
                </tr>
                <tr className="dark">
                  <td colSpan="3">Total</td>
                  <td>Rs {(bill?.details?.total - bill?.discount).toFixed(2)}</td>
                </tr>
                <tr className={"dark "+bill?.settled}>
                  <td colSpan="3">Status</td>
                  <td>{bill?.settled ? 'Settled' : 'Pending'}</td>
                </tr>
              </table>
            </div>
          </div>
          <div className="visit">
            Pleasure serving you :)   
          </div>
          <div className="qr">
            <QR  size={120} bgColor="#ffffff" fgColor="#555" value={location}/>
          </div> 
        </>}
      </div>
      </div>
    )
}

export default Invoice