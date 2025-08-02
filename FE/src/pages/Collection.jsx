import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Footer from '../components/Footer'

const Collection = () => {
  const { products } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  return (
    <>
      <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-1'>

        {/* Filter */}
        <p className='my-2 text-xl flex items-center cursor-pointer gpa-2'>
          FILTER
        </p>

        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'}`}>

        </div>

      </div>
      <Footer />
    </>
  )
}

export default Collection
