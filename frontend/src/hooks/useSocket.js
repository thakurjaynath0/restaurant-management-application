import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import useNotification from './useNotification'

const useSocket = ({ key, setState }) => {
    const [socket, setSocket] = useState(null)
    const { notify } = useNotification()
    


    const message = ({ key, message }) => {
        socket.emit(key, message)
    }

    useEffect(() => {
        const newSocket = io('/')
        setSocket(newSocket)
        return () => newSocket.close()
    }, [setSocket])

    useEffect(() => {
        socket && socket.on('connect', () => {
            socket.on(key, (message) => {
                setState(true);
                notify({
                    title:"Order Created",
                    content:"",
                    type:"info"
                })
            })
        })
    }, [socket, notify, key, setState])

    return {socket, message}
}

export default useSocket