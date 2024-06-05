import { useContext } from 'react'
import { NotificationContext } from '../contexts/notificationContext'
import useAudio from './useAudio'
import NOTIFICATION_AUDIO from '../assets/sounds/mixkit-fairy-message-notification-861.wav'
import { generateRandomHexString } from '../utils/hexString'

const useNotification = () => {
    const { notifications, setNotifications } = useContext(NotificationContext)
    
    const { play } = useAudio(NOTIFICATION_AUDIO, {
        vibrate:true,
    })

    const notify = ({ title, content, type }) => {
        const id = generateRandomHexString(16)
        setNotifications(notifications => [...notifications, {id, title, content, type}])
        play()
    }

    const remove = ({ id }) => {
        setNotifications(notifications => notifications.filter(item => item.id !== id))
    }

    return { notify, notifications, remove }
}

export default useNotification