import React, { useEffect, useState } from 'react'
import { FaSlidersH } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'

import './BillFilter.css'

const BillFilter = ({ setQueryString }) => {
    const [filterActive, setFilterActive] = useState(false)
    const [filter, setFilter] = useState({
        settled:'',
        payment:'',
        orderNumber:['', ''],
        discount: ['', ''],
        total:['', ''],
        date:['', '']
    })

    const generateQueryString = (filter) => {
        let otherFilter = "";
        let numericFilter=""
        let dateFilter = ""
        filter?.settled && (otherFilter += `settled=${filter?.settled}&`)

        filter?.payment && (otherFilter += `payment=${filter?.payment}&`)
        
        filter?.orderNumber[0] && (numericFilter += `details.orderNumber>=${filter?.orderNumber[0]},`)
        filter?.orderNumber[1] && (numericFilter += `details.orderNumber<=${filter?.orderNumber[1]},`)

        filter?.total[0] && (numericFilter += `details.total>=${filter?.total[0]},`)
        filter?.total[1] && (numericFilter += `details.total<=${filter?.total[1]},`)

        filter?.discount[0] && (numericFilter += `discount>=${filter?.discount[0]},`)
        filter?.discount[1] && (numericFilter += `discount<=${filter?.discount[1]},`)

        filter?.date[0] && (dateFilter += `createdAt>=${filter?.date[0]},`)
        filter?.date[1] && (dateFilter += `createdAt<=${filter?.date[1]},`)

        return `${otherFilter}numericFilters=${numericFilter}&dateFilters=${dateFilter}`
    }

    const handleSave = () => {
        setQueryString(generateQueryString(filter))
        setFilterActive(false)
    }

    const handleClear = () => {
        const emptyFilter = {
            settled:'',
            payment:'',
            orderNumber:['', ''],
            discount: ['', ''],
            total:['', ''],
            date:['', '']
        }
        setFilter(emptyFilter)
        setQueryString(generateQueryString(emptyFilter))
        setFilterActive(false)
    }

    // useEffect(()=> {
    //     setQueryString(generateQueryString(filter))
    // }, [filter, setQueryString])
    
  return (
    <div className="bills-filter">
        <div className="bills-filter-origin">
            <div className="bills-filter-origin-content" onClick={() => setFilterActive(true)}>
                <span>Filter</span>
                <FaSlidersH />
            </div>
        </div>
        {filterActive && <>
            {/* <div className="bills-filter-pseudo-wrapper"></div> */}
            <div className="bills-filter-wrapper">
                <div className="bills-filter-filter">
                    <div className="bills-filter-close" onClick={() => setFilterActive(false)}>
                        <AiOutlineClose />
                    </div>
                    <div className="bills-filter-settled">
                        <label>
                            Settled
                            <select value={filter?.settled ? filter.settled : ""} onChange={(e) => setFilter(filter => ({...filter, settled: e.target.value }) )}>
                                <option value="">------</option>
                                <option value='false'>Pending</option>
                                <option value='true'>Settled</option>
                            </select>
                            {/* <input type="checkbox" value={filter?.settled === true} onChange={(e) => setFilter({...filter, settled:e.target.value})}/> */}
                        </label>
                    </div>
                    <div className="bills-filter-payment">
                        <label>
                            Payment
                            <select value={filter?.payment ? filter.payment : ""} onChange={(e) => setFilter(filter => ({...filter, payment: e.target.value }) )}>
                                <option value="">---------</option>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="online">Online</option>
                            </select>
                        </label>
                    </div>
                    <div className="bills-filter-order">
                        <label>
                            Order Number
                            <div className="inputs">
                                <label> From: <input type="number" value={filter?.orderNumber[0]} onChange={(e) => setFilter(filter => ({...filter, orderNumber:[e.target.value, filter?.orderNumber[1]]}) )} /> </label>
                                <label> To: <input type="number" value={filter?.orderNumber[1]} onChange={(e) => setFilter(filter => ({...filter, orderNumber:[filter?.orderNumber[0], e.target.value]}) )} /> </label>
                            </div>
                        </label>
                    </div>
                    <div className="bills-filter-total">
                        <label>
                            Total
                            <div className="inputs">
                                <label> From: <input type="number" value={filter?.total[0]} onChange={(e) => setFilter(filter => ({...filter, total:[e.target.value, filter?.total[1]]}) )} /> </label>
                                <label> To: <input type="number" value={filter?.total[1]} onChange={(e) => setFilter(filter => ({...filter, total:[filter?.total[0], e.target.value]}) )} /> </label>
                            </div>
                        </label>
                    </div>
                    <div className="bills-filter-discount">
                        <label>
                            Discount
                            <div className="inputs">
                                <label> From: <input type="number" value={filter?.discount[0]} onChange={(e) => setFilter(filter => ({...filter, discount:[e.target.value, filter?.discount[1]]}) )} /> </label>
                                <label> To: <input type="number" value={filter?.discount[1]} onChange={(e) => setFilter(filter => ({...filter, discount:[filter?.discount[0], e.target.value]}) )} /> </label>
                            </div>
                        </label>
                    </div>
                    <div className="bills-filter-date">
                        <label>
                            Date
                            <div className="inputs">
                                <label> From: <input type="date" value={filter?.date[0]} onChange={(e) => setFilter(filter => ({...filter, date:[e.target.value, filter?.date[1]]}) )} /> </label>
                                <label> To: <input type="date" value={filter?.date[1]} onChange={(e) => setFilter(filter => ({...filter, date:[filter?.date[0], e.target.value]}) )} /> </label>
                            </div>
                        </label>
                    </div>
                    <div className="bills-filter-actions">
                        <button className="bills-filter-actions-clear" onClick={handleClear}>Clear</button>
                        <button className="bills-filter-actions-save" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </> 
        }
    </div>
  )
}

export default BillFilter