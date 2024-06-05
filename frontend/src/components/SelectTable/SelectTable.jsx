import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTablesQuery } from '../../services/api';
import Loader from '../Loader/Loader';
import SelectTableCard from '../SelectTableCard/SelectTableCard';
import './select.css'

const SelectTable = ({newTable, setNewTable, setTableCardActive, numOfPeople=1,setNumOfPeople, active, singleOrderData=null, setErr=null, orderId=null, action="create"}) => {
    const navigate = useNavigate();
  const { data:tablesData } = useGetTablesQuery();
  const [people, setPeople] = useState(numOfPeople);
  // only for editing table
  const [tableLoading, setTableLoading] = useState(false);

    const handleClick = () => {
        setNumOfPeople(people)
        if(people > 0 && newTable.length > 0){
            setTableCardActive(prev=> !prev)
        }
    }
    const handleReturn = () => {
        navigate('/order')
    }
    useEffect(()=> {
      const timer1 = setTimeout(()=> {
          (tableLoading === true) && setTableLoading(false);
          }, 3000);
          return (()=> {
        clearTimeout(timer1);
        })
    }, [tableLoading])
    console.log();
  return (
    <div className={active? "select-table-order active": "select-table-order"}>
        <div className="select">
        <div className="select-table-title">Number of Guests</div>
            <input type="text" placeholder='Number of People..' value={people}  onChange={e=> {setPeople(e.target.value);setNumOfPeople(e.target.value)}} required disabled={action==="edit" ? true: false}/>
            <div className="select-table-title">Select Table</div>
            {
              !tableLoading ? 
            <div className="tables-menu-items">
                {
                    tablesData?.tables?.map((table, index)=>{
                        return !table.occupied &&  <SelectTableCard key={index} setNewTables={setNewTable} newTables={newTable} {...{table, setErr, action, orderId, tableLoading, setTableLoading}}/>
                    })
                }
                {
            singleOrderData?.order?.tables?.map((table, index)=>{
              const object = {
                _id: table._id,
                number: table.number,
                occupied: true
              }
              return  <SelectTableCard key={index} table={object} setNewTables={setNewTable} newTables={newTable} {...{setErr, action, orderId, tableLoading, setTableLoading}}/>
            })
          }

                

            </div>
            :
            <div className="tables-loading">
              <Loader/>
            </div>
            }

            <div className={`select-table-btns ${(action==="edit" || newTable.length > 0) && 'active'}`}>
              {
                (!action==="edit" || newTable.length < 1) &&
                <button className="btn return-btn" onClick={handleReturn}>Return</button>
              }
                <button className={`btn select-done ${(action==="edit" || newTable.length > 0) && 'active'}`} onClick={handleClick}> Done </button>
            </div>
        </div>
    </div>
  )
}

export default SelectTable