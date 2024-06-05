import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { FaDotCircle, FaEllipsisV, FaTable, FaTimes } from "react-icons/fa";
import { useDeleteTableMutation, useUpdateTableMutation } from '../../services/api';
import "./tablecard.css";

const TableCard = ({ TableIMG, table, setFrontendError}) => {
  const [deleteTable, {error: deleteTableError, isSuccess: deleteTableSuccess, isLoading: deleteTableLoading}] = useDeleteTableMutation();
  const [editTable, {error: editTableError, isSuccess: editTableSuccess, isLoading: editTableLoading}] = useUpdateTableMutation();
    const [active, setActive] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [num, setNum] = useState(table.number);
    const inputRef = useRef();

    const handleEditClick = () => {
      inputRef.current.focus();
        setIsEdit(true);
        setActive(false);
        inputRef.current.focus();

    }
    const handleCancel = ()=> {
      setIsEdit(false);
      setNum(table.number);
    }

    const handleSave = ()=> {
      editTable({_id: table._id, number: num});
      if(editTableError){
        inputRef.current.value = table.number;
        inputRef.current.focus();
        setNum(table.number);

      }
      // post request will carry out in this case, for now its just boilerplate
    }

    const handleDelete= () => {
      deleteTable({_id: table._id,});
      setActive(false);

    }

    useEffect(()=> {
      if(editTableError){
        setFrontendError({status: true, msg: editTableError?.data?.msg});
        setIsEdit(false);
      }
      if(deleteTableError){
        setFrontendError({status: true, msg: deleteTableError?.data?.msg});
        setIsEdit(false);
      }
      const timer1 = setTimeout(()=> {setFrontendError({status: false, msg: ""})}, 3000);
      return ()=> clearTimeout(timer1);
    }, [editTableError, deleteTableError]);

    if(editTableLoading || deleteTableLoading){
      return(
        <div className="table-lists">
          <div className="loader"></div>
        </div>
      )
    }
  return (
    <div className="table-lists">
          <div className="table-icon">
              <img src={TableIMG} alt="table" />
          </div>
          <div className={isEdit ? "table-number": "table-number active"}>{table.number}</div>
          <input type="text" ref={inputRef} value={num} onChange={(e)=> setNum(e.target.value)} className={isEdit ? "input-num active": "input-num"}/>
          {isEdit && 
            <div className="btn-container">
                <button className='cancel-btn' onClick={handleCancel}>cancel</button>
                <button className="save-btn" onClick={handleSave}>Save</button>
            </div>
          }
          <div className="table-option-container">
            <div className="table-option-icon">
              <div className="option-icon" onClick={()=> setActive((prev)=> !prev)}>
                {active ? <FaTimes/>:<FaEllipsisV/>}
              </div>
            </div>
            <div className={active ? "table-option active": "table-option"}>
                <div className={isEdit ? 'option active': 'option'} onClick={handleEditClick} >edit</div>
                <div className="seperator"></div>
                <div className="option" onClick={handleDelete}>delete</div>
            </div>
          </div>
        </div>
  )
}

export default TableCard;