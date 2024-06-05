import React, { useEffect, useState } from 'react'
import io  from 'socket.io-client'
import useNotification from '../hooks/useNotification'

const SocketContext = React.createContext()

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const { notify } = useNotification()
    const [key, setKey] = useState({
        "order:create":[],
        "order:update":[],
        "ordercomplete":[],
        "order:cancel":[],
        "bill:settle":[],
    })

    useEffect(()=>{
        console.log(socket?._callbacks, key);
    },[socket, key])

    const [register] = useState(() => (newKey, callback = () => {}) => {
        // setKey(key => ({...key, [newKey]:[ setState, callback ] }))
        // setKey(key => ([...key, [newKey, callback]]))

        setKey(key => ({...key, [newKey]:[...key[newKey], callback] }))
    })

    const message = ({ key, message }) => {
        socket.emit(key, message)
    }

    useEffect(() => {
        const newSocket = io('/')
        setSocket(newSocket)
        // return () => newSocket.close()
    }, [setSocket])

    useEffect(() => {
        // const messageKeys = ["order:create", "order:update", "order:complete", "order:cancel", "bill:settle"];
        
        // socket && socket.on('connect', () => {
            socket && Object.keys(key).forEach(item => socket.off(item));
            socket && Object.keys(key).forEach(item => {
                // console.log(item);
                socket.on(item, (message) => {
                    console.log(key);
                    key[item].forEach(callback => {
                        callback(message);
                        console.log(callback);
                    })
                    notify({
                        title:item,
                        content:"",
                        type:"warning"
                    });
                })
            })
        // })
        
        // socket && socket.on('connect', () => {
        //     messageKeys.forEach(item => {
        //         socket.on(item, (message) => {
        //             key[item] && key[item][0](val => !val)
        //             key[item] && key[item][1](message)
        //             notify({
        //                 title:item,
        //                 content:"",
        //                 type:"info"
        //             })
        //         })
        //     })
        // })

    }, [socket, notify, key])

    return (
        <SocketContext.Provider value={{
            socket,
            message,
            register
        }}>
            { socket && <>
                { children }
            </>}
        </SocketContext.Provider>
    )
}

export { SocketContext, SocketProvider } 