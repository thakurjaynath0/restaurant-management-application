import React, { useEffect } from 'react'
import useAudio from '../../hooks/useAudio'

// import notification from '../../assets/sounds/mixkit-fairy-message-notification-861.wav';
// import { useContext } from 'react';
// import { NotificationContext } from '../../contexts/notificationContext';
import { useState } from 'react';
import useNotification from '../../hooks/useNotification';
import Notification from '../../components/Notification/Notification';
import { useNavigate } from 'react-router-dom';
import useSocket from '../../hooks/useSocket';
import { useContext } from 'react';
import { SocketContext } from '../../contexts/socketContext';



const Test = () => {
    // const { play } = useAudio(notification, { vibrate:true, loop:1 })
    // const [ created, setCreated ] = useState(false);
    // const { socket, message } = useSocket()
    // const navigate=useNavigate()
    // const [data, setData] = useState({
    //   title:'',
    //   content:'',
    //   type:''
    // })
    // const { notifications, notify } = useNotification()

    // const handleSubmit = (e) => {
    //   e.preventDefault()
    //   notify(data)
    // }
    const [create, setCreate] = useState(false);
    const { message, register } = useContext(SocketContext);
    useEffect(() => {
      register("order:update", (message) => console.log(message + "Kera"));
    }, [register])

    useEffect(() => {
      console.log(create)
    }, [create])

    // useEffect(() =>{
    //   console.log(notifications)
    // }, [notifications])

  return (
    // <div className="test">
    //     <h3 onClick={() => navigate('/')}>Home</h3>
    //     {/* <button onClick={play}>Click Me</button> */}
    //     <br/><br/>
    //     <form onSubmit={handleSubmit}>
    //       <input type="text" name="title" value={data?.title} onChange={(e) => setData(data => ({...data, title:e.target.value}) ) }></input>
    //       <textarea type="text" name="content" onChange={(e) => setData(data => ({...data, content:e.target.value}) ) } value={data?.content}></textarea>
    //       <input type="text" name="type" value={data?.type} onChange={(e) => setData(data => ({...data, type:e.target.value}) ) }></input>
    //       <input type="submit"/>
    //     </form>

    // </div>
    <div>
      <button onClick={() => message({ key:"order:create", message: "somerandomval"})}>Create</button>
      <button onClick={() => message({ key:"order:update", message: "somerandomval"})}>Update`</button>
    </div>
  )
}

export default Test