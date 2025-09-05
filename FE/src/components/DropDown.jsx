import React, { useContext, useEffect, useRef } from 'react'
import { ShopContext } from '../context/ShopContext'

const DropDown = ({ Logout, showDropDown, setShowDropDown }) => {
    const { navigate } = useContext(ShopContext)
    const dropDownRef = useRef(null)

    const trigger = (action) => {
        action()
        setShowDropDown(false)
    }


    useEffect(() => {
        const handleClickEvent = (e) => {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                setShowDropDown(false)
            }
        }
        if (showDropDown) {
            document.addEventListener('mousedown', handleClickEvent)
        }
        else {
            document.removeEventListener('mousedown', handleClickEvent)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickEvent)
        }
    }, [showDropDown, setShowDropDown])

    return (showDropDown
        ? <div ref={dropDownRef}>
            <div className="absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                    <p className='cursor-pointer hover:text-black'>My Profile</p>
                    <p onClick={() => trigger(() => navigate('/orders'))} className='cursor-pointer hover:text-black'>Orders</p>
                    <p onClick={() => trigger(Logout)} className='cursor-pointer hover:text-black'>Logout</p>
                </div>
            </div>
        </div>
        : null
    )
}

export default DropDown
