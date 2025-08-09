import React from 'react'

const DropDown = ({ Logout, showDropDown }) => {
    return (showDropDown
        ? <div>
            <div className="absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                    <p className='cursor-pointer hover:text-black'>My Profile</p>
                    <p className='cursor-pointer hover:text-black'>Orders</p>
                    <p onClick={() => Logout()} className='cursor-pointer hover:text-black'>Logout</p>
                </div>
            </div>
        </div>
        : null
    )
}

export default DropDown
