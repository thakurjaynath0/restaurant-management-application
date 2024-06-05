import React, { useState } from 'react'

const NotificationContext = React.createContext()

const NotificationProvider = ({ children }) => {
    const [ notifications, setNotifications ] = useState([])
    const notify = ({ title, content }) => {
        setNotifications(notifications => [{ title, content }, ...notifications])
    }
    return (
        <NotificationContext.Provider value={{
            notifications,
            setNotifications,
            notify
        }}>
            { children }
        </NotificationContext.Provider>
    )
}

export { NotificationContext, NotificationProvider }