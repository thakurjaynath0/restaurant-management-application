import React, { useState } from 'react'
import { AiFillSetting, AiOutlineClose } from 'react-icons/ai'

import './BillSettings.css'

const BillSettings = ({ limit, handleLimitChange }) => {
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
    <div className="bills-settings">
        <div className="bills-settings-origin">
            <div className="bills-settings-origin-content" onClick={() => setActive(true)}>
                {/* <span>Filter</span> */}
                <AiFillSetting />
            </div>
        </div>
        {active && <div className="bills-settings-wrapper">
            <div className="bills-settings-settings">
                <div className="bills-settings-close" onClick={() => setActive(false)}>
                    <AiOutlineClose />
                </div>
                <div className="bills-settings-limit">
                    <label>
                        Bills per page :
                        <input type="number" value={settings?.limit} onChange={(e) => setSettings(settings => ({...settings, limit:parseInt(e.target.value ,10)}) )}/>
                    </label>
                </div>
            <div className="bills-settings-actions">
                <button className="bills-settings-actions-save" onClick={handleSave}>Save</button>
                <button className="bills-settings-actions-clear" onClick={handleReset}>Clear</button>
            </div>
            </div>
        </div>}
    </div>
  )
}

export default BillSettings