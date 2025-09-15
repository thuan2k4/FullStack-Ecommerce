import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
    const location = useLocation() // get current path
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const path = location.pathname
        if (path.includes('collection') && showSearch) {
            setVisible(true)
        }
        else {
            setVisible(false)
        }
    }, [location, showSearch])

    return showSearch && visible ? (
        <div className='border-t border-b bg-gray-50 text-center flex justify-center items-center'>
            <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search' className='flex-1 ouline-none bg-inherit text-sm' />
                <img src={assets.search_icon} className='w-4' alt="" />
            </div>
            <img className='inlinne w-3 cursor-pointer' onClick={() => setShowSearch(false)} src={assets.cross_icon} alt="" />
        </div>
    ) : null
}

export default SearchBar
