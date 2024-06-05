import React, { useState } from 'react'
import { AiFillSetting, AiOutlineClose } from 'react-icons/ai'

import './ordersettings.css'

const OrderSettings = ({ limit, handleLimitChange }) => {
    const [active, setActive] = useState(false)
    const [settings, setSettings] = useState({
        limit,
    })

    const handleSave = () => {
        handleLimitChange(settings.limit)
        setActive(false)
    }

    const handleReset = () => {
        const defaultSettings = {
            limit:10,
        }
        setSettings(defaultSettings)
        handleLimitChange(defaultSettings.limit)
        setActive(false)

    }
  return (
    <div className="order-settings">
        <div className="order-settings-origin">
            <div className="order-settings-origin-content" onClick={() => setActive(true)}>
                {/* <span>Filter</span> */}
                <AiFillSetting />
            </div>
        </div>
        {active && <div className="order-settings-wrapper">
            <div className="order-settings-settings">
                <div className="order-settings-close" onClick={() => setActive(false)}>
                    <AiOutlineClose />
                </div>
                <div className="order-settings-limit">
                    <label>
                        <span>
                        order per page :
                        </span>
                        <input type="number" value={settings?.limit} onChange={(e) => setSettings(settings => ({...settings, limit:parseInt(e.target.value ,10)}) )}/>
                    </label>
                </div>
            <div className="order-settings-actions">
                <button className="order-settings-actions-clear" onClick={handleReset}>Clear</button>
                <button className="order-settings-actions-save" onClick={handleSave}>Save</button>
            </div>
            </div>
        </div>}
    </div>
  )
}

export default OrderSettings