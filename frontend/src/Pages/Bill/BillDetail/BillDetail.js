import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FaArrowLeft } from 'react-icons/fa'
import QR from 'react-qr-code'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetBillQuery, useSettleBillMutation } from '../../../services/api'
import { formatDate } from '../../../utils/date'

import './BillDetail.css'

const BillDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data:{ bill={} } = {}, isSuccess, isLoading, isFetching } = useGetBillQuery(id)

    const [settlementData, setSettlementData] = useState({
        id,
        discount:bill?.discount || 0,
        payment: bill?.payment || 'cash',
        note: bill?.note || ''
    })

    const [settleBill, {isLoading:settlementIsLoading, isFetching:settlementIsFetching, error:settlementError }] = useSettleBillMutation()

    const getInvoicePath = (id, full=false) => {
        if(!full) {
            return '/outlet/view-invoice/'+id;
        }
        return window.location.protocol+'//'+window.location.host+'/outlet/view-invoice/'+id;
    }

    useEffect(() =>{
        isSuccess && setSettlementData(prev => ({
            ...prev,
            discount:bill?.discount || 0,
            payment: bill?.payment || 'cash',
            note: bill?.note || ''
        }))
    }, [bill, isSuccess])

    const handleSettlement = (e) => {
        e.preventDefault();
        settleBill(settlementData)
    }

    return (
    <div className="bill-detail">
        <div className="bill-detail-header">
            <div className="bill-detail-header-back"><FaArrowLeft onClick={() => navigate(-1)}/></div>
            <div className="bill-detail-header-title">Bill Details</div>
        </div>
        {(isLoading || isFetching || settlementIsLoading || settlementIsFetching) && <div className="bill-detail-loader"><AiOutlineLoading3Quarters/></div>}
        {!(isLoading || isFetching || settlementIsLoading || settlementIsFetching) && <div className="bill-detail-wrapper">
            <div className="bill-detail-details">
                <div className="bill-detail-order-number">Order #{bill?.details?.orderNumber}</div>
                    <div className="bill-detail-order-date">{formatDate(bill?.createdAt)}</div>
                    <div className="bill-detail-order-tables">
                        {bill?.details?.orderTables.map(table => <span key={table}>{table}</span>)}
                    </div>
                    <div className={"bill-detail-order-status "+ (bill?.settled ? "settled" : "pending")}><span>{bill?.settled ? "settled" : "pending"}</span></div>
                    {bill?.settled && bill?.settledBy && <div className="bill-detail-settled-by"><span>By :- {bill?.settledBy?.name}</span></div>}
                    
                    <div className="bill-detail-order-items">
                        <div className="bill-detail-order-items-heading">
                            <span className="item">Item</span>
                            <span className="quantity">Qty</span>
                            <span className="rate">Rate</span>
                            <span className="total">Total</span>
                        </div>
                        {bill?.details?.orderItems?.map(item => <div key={item?._id} className="bill-detail-order-items-item">
                            <span className="item">{item?.itemName}</span>
                            <span className="quantity">{item?.itemQuantity}</span>
                            <span className="rate">{item?.itemPrice}</span>
                            <span className="total">{item?.itemTotal}</span>
                        </div>)}
                    </div>

                    <div className="bill-detail-order-subtotal">
                        <span className="amount-title">Sub total</span>
                        <span className="amount">Rs {bill?.details?.subTotal}</span>
                    </div>
                    <div className="bill-detail-order-tax">
                        <span className="amount-title">Tax</span>
                        <span className="amount">Rs {bill?.details?.taxAmount}</span>
                    </div>
                    <div className="bill-detail-order-service-charge">
                        <span className="amount-title">Service charge</span>
                        <span className="amount">Rs {bill?.details?.gratuity}</span>
                    </div>
                    <div className="bill-detail-order-discount">
                        <span className="amount-title">Discount</span>
                        <span className="amount">Rs {bill?.discount || 0}</span>
                    </div>

                    <div className="bill-detail-order-total">
                        <span className="amount-title">Total</span>
                        <span className="amount">Rs {(bill?.details?.total - (settlementData?.discount || 0)).toFixed(2)}</span>
                    </div>
            </div>

            <div className="bill-detail-settlement">
                {settlementError && <div className="bill-detail-settlement-error">
                    {settlementError && typeof settlementError?.data?.msg === 'object' && Object.keys(settlementError?.data?.msg).map(item => settlementError?.data?.msg[item]+"\n")}
                    {settlementError && typeof settlementError?.data?.msg === 'string' && settlementError?.data?.msg}
                </div>}
                <form onSubmit={handleSettlement}>
                    <div className="bill-detail-settlement-note">
                        <label>
                            Note : 
                            <textarea 
                                rows="3" 
                                value={settlementData?.note} 
                                onChange={e => setSettlementData(prev => ({...prev, note:e.target.value}) )}
                                disabled={bill?.settled}>
                            </textarea>
                        </label>
                    </div>
                    <div className="bill-detail-settlement-discount">
                        <label>
                            Discount :
                            <input 
                                required
                                type="number" 
                                value={settlementData?.discount} 
                                onChange={e => setSettlementData(prev => ({...prev, discount:e.target.value}) )}
                                disabled={bill?.settled}/>
                        </label>
                    </div>
                    <div className="bill-detail-settlement-payment">
                        <label>
                            Payment Method:
                            <select 
                                required
                                value={settlementData?.payment} 
                                onChange={e => setSettlementData(prev => ({...prev, payment:e.target.value}) )} 
                                disabled={bill?.settled}>

                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="online">Online Payment</option>
                            </select>
                        </label>
                    </div>
                    <div className="bill-detail-settlement-actions">
                        {!bill?.settled && <button type="submit" className="bill-detail-settlement-actions-settle">Settle Bill</button>}
                        <button className="bill-detail-settlement-actions-receipt" type="button" onClick={() => navigate(getInvoicePath(id))}>Receipt</button>
                    </div>
                </form>
                <div className="bill-detail-settlement-qr">
                    <QR size={150} bgColor="#ffffff" fgColor="#2460b9" value={getInvoicePath(id, true)}/>
                </div>
            </div>
        </div>}
    </div>
    )
}

export default BillDetail