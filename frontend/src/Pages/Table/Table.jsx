import React, {useState} from 'react';
import TableIMG from "../../assets/table.png";
import {tables} from "../../mock/tables";
import TableCard from '../../components/TableCard/TableCard';
import { FaArrowLeft, FaChevronLeft, FaPlus} from 'react-icons/fa';
import "./table.css";
import { useCreateTableMutation, useGetTablesQuery } from '../../services/api';
import { useEffect } from 'react';
import Loader from "../../components/Loader/Loader";
import {useNavigate} from "react-router-dom";

const Table = () => {
  const navigate = useNavigate();
  const { data:fetchedData, isLoading: dataLoading, isFetching: dataFetching } = useGetTablesQuery();
  const [createTable, {error: createTableError, isLoading: createTableLoading, isSuccess: createTableSuccess}] = useCreateTableMutation(); 
  const [data, setData] = useState(fetchedData?.tables);
  const [isActive, setIsActive] = useState(false);
  const [newTable, setNewTable] = useState("");
  const [frontendError, setFrontendError] = useState({status: false, msg: ""});

  const handleAddNew = () => {
      setIsActive(true);
      

  };

  const handleCancel = ()=> {
    setIsActive(false);
    setNewTable("");
  }
  const handleSave = () => {
    createTable({number: newTable});
    // clear new table state after posting the new table
    setNewTable("");
      setIsActive(false);
  }

  useEffect(()=> {
    setData(fetchedData?.tables);
  },[fetchedData]);

  useEffect(()=> {

    if(typeof createTableError?.data?.msg === "string"){
          setFrontendError({status: true, msg: createTableError?.data?.msg});
    }
    const timer1 = setTimeout(()=>{setFrontendError({status: false, msg: ""})},4000);

    return ()=> clearTimeout(timer1);

  }, [createTableError]);

  useEffect(()=> {
    setFrontendError({status: false, msg: ""})
  }, []);

  if(dataLoading || dataFetching){
    return <Loader/>
  }

  return (
    <main className="table-container">
      <div className="back-icon" onClick={()=> navigate("/")}><FaArrowLeft/></div>
      <div className="table-title">Tables</div>
      <div className="error active">{frontendError.msg}</div>
      <div className="table-list-container">
        {data?.map((table, index)=> {
          if(dataLoading || dataFetching){
            return <div className="table-lists" key={index}>
                    <div className="loader"></div>
            </div>
          }
          return <TableCard key={index} table={table} TableIMG={TableIMG} setFrontendError={setFrontendError}/>
        })}
        <div className="table-lists">
          {(dataLoading || createTableLoading) ? 
            <div className="loader">
              
            </div> 
            :
          <div className="table-lists-wrapper">
            {
              isActive ?
              <div className="form-control">
                  <img src={TableIMG} alt="" />
                  <input type="text" placeholder='add table name/number' value={newTable} onChange={e => setNewTable(e.target.value)}/>
                  <div className="btn-container">
                    <button className='cancel-btn' onClick={handleCancel}>cancel</button>
                    <button className="save-btn" onClick={handleSave}>Save</button>
            </div>
              </div>
              :
              <div className="add-table-icon" onClick={handleAddNew}>
                <FaPlus/>
              </div>
            }

          </div>

        }
        </div>
      </div>
    </main>
  )
}

export default Table