import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAddTableEditOrderMutation, useRemoveTableEditOrderMutation } from '../../services/api';
import "./selecttablecard.css";

const SelectTableCard = ({table, newTables=[] ,action, setNewTables=undefined, orderId=null, setErr=undefined, tableLoading=null, setTableLoading=null}) => {
  const [addTable, {error: addTableError, isSuccess: addTableSuccess, isLoading: addTableLoading}] = useAddTableEditOrderMutation();
  const [removeTable, {error: removeTableError, isSuccess: removeTableSuccess, isLoading: removeTableLoading}] = useRemoveTableEditOrderMutation();
  const [active, setActive] = useState(table.occupied);
  
  const handleCreateClick = () => {
      setActive((prev)=> !prev);
      let data = {number: table.number, id: table._id, table: table._id};

      if(!active){
          setNewTables([...newTables, data]);
      }
      if(active){
        const newVal = newTables.filter((item)=> {
              return item.id !== table._id
        });
        setNewTables(newVal);
      }
    }

    const handleEditClick = async()=> {
      if(table.occupied){
        await removeTable({_id: orderId, table: table._id});
        return;
      }
      await addTable({_id: orderId, table: table._id});

    }
    useEffect(()=> {
      if(action === "edit"){
        addTableError && setErr(addTableError);
        removeTableError && setErr(removeTableError);

      }
    },[addTableError, removeTableError, setErr,action]);

    useEffect(()=> {
        setTableLoading(addTableLoading || removeTableLoading || false)

    }, [addTableLoading, removeTableLoading, setTableLoading])
    

  return (
    <div className="wrapper">
        {
          // !table.occupied && 
          <div className={active? 'table-card active': 'table-card'} onClick={action==="edit"? handleEditClick : handleCreateClick}>{table.number}</div>
        }
    </div>
  )
}

export default SelectTableCard