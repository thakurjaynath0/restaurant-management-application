import React, { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Paginator from '../../components/Paginator/Paginator'
import { useAllBillsQuery } from '../../services/api'
import { formatDate } from '../../utils/date'
import BillFilter from './BillFilter/BillFilter'

import './Bills.css'
import BillSettings from './BillSettings/BillSettings'
const Bills = () => {
    const navigate = useNavigate()
    const [queryString, setQueryString] = useState('numericFilters=&dateFilters=')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const {data, isLoading, isFetching} = useAllBillsQuery({ queryString:queryString + `&page=${page}&limit=${limit}` })

    const handlePageChange = (e, value) => {
        setPage(value)
    }

    const handleLimitChange = (val) => {
        setLimit(parseInt(val, 10))
        setPage(1)
    }

    return (
    <div className="bills">
        <div className="bills-header">
            <div className="bills-header-back"><FaArrowLeft onClick={() => navigate('/')}/></div>
            <div className="bills-header-title">Bills</div>
        </div>
        <div className="bills-options">
            <BillFilter setQueryString={setQueryString} />
            <BillSettings limit={limit} handleLimitChange={handleLimitChange}/>
        </div>
        {(isLoading || isFetching) && <div className="bills-loader"><AiOutlineLoading3Quarters/></div>}
        {!(isLoading || isFetching) && <div className="bills-wrapper">
            {data?.bills?.map(bill => <div className="bill" key={bill?._id} onClick={() => navigate(bill?._id)}>
                <div className="bill-order-number">Order #{bill?.details?.orderNumber}</div>
                <div className="bill-order-date">{formatDate(bill?.createdAt)}</div>
                <div className="bill-order-tables">
                    {bill?.details?.orderTables.map(table => <span key={table}>{table}</span>)}
                </div>
                <div className={"bill-order-status "+ (bill?.settled ? "settled" : "pending")}><span>{bill?.settled ? "settled" : "pending"}</span></div>
                {bill?.settled && bill?.settledBy && <div className="bill-settled-by"><span>By :- {bill?.settledBy?.name}</span></div>}
                <div className="bill-order-subtotal">
                    <span className="amount-title">Sub total</span>
                    <span className="amount">Rs {bill?.details?.subTotal}</span>
                </div>
                <div className="bill-order-tax">
                    <span className="amount-title">Tax</span>
                    <span className="amount">Rs {bill?.details?.taxAmount}</span>
                </div>
                <div className="bill-order-service-charge">
                    <span className="amount-title">Service charge</span>
                    <span className="amount">Rs {bill?.details?.gratuity}</span>
                </div>
                <div className="bill-order-discount">
                    <span className="amount-title">Discount</span>
                    <span className="amount">Rs {bill?.discount || 0}</span>
                </div>

                <div className="bill-order-total">
                    <span className="amount-title">Total</span>
                    <span className="amount">Rs {bill?.details?.total - (bill?.discount || 0)}</span>
                </div>
            </div>)}
        </div>}
        <Paginator 
            totalPage={data?.totalPage || 0} 
            page={page} 
            handlePageChange={handlePageChange}
            // limit={limit}
            // handleLimitChange={handleLimitChange}
            boundaryCount={1}
        />
    </div>  
    )
}

export default Bills