import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Footer from '../components/Footer'
import { assets } from '../assets/frontend_assets/assets'
import Title from './../components/Title';
import ProductItem from './../components/ProductItem';
import { toast } from 'react-toastify';

const Collection = () => {
  const { products, search, showSearch, backendUrl } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...prev, e.target.value])
    }

  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value))
    }
    else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }
  const fetchFiltered = async () => {
    const params = new URLSearchParams()
    if (category.length) params.append('category', category.join(','))
    if (subCategory.length) params.append('subCategory', subCategory.join(','))
    if (sortType && sortType !== 'relevant') params.append('sort', sortType)

    try {
      const res = await fetch(`${backendUrl}/api/product/filter?${params.toString()}`)
      const data = await res.json()
      setFilterProducts(data.products)
    } catch (error) {
      console.error('Error fetching filtered products:', error.message)
      toast.error('Error fetching filtered products');
    }
  }
  useEffect(() => {
    setFilterProducts(products)
  }, [])

  useEffect(() => {
    fetchFiltered();
  }, [category, subCategory, sortType])

  return (
    <>
      <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

        <div className="min-w-60">
          {/* Filter */}
          <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'> FILTER
            <img src={assets.dropdown_icon} className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} alt="" />
          </p>

          {/* Category */}
          <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'}`}>
            <p className='mb-3 test-sm font-medium'>CATEGORIES</p>
            <div className='flex flex-col gap-2 text-sm font-light test-gray-700'>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory} /> Men
              </p>

              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory} /> Women
              </p>

              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory} /> Kids
              </p>
            </div>
          </div>

          {/* Subcategories */}
          <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'}`}>
            <p className='mb-3 test-sm font-medium'>Type</p>
            <div className='flex flex-col gap-2 text-sm font-light test-gray-700'>
              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" onChange={toggleSubCategory} value={'Topwear'} /> Topwear
              </p>

              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" onChange={toggleSubCategory} value={'Bottomwear'} /> Bottomwear
              </p>

              <p className='flex gap-2'>
                <input className='w-3' type="checkbox" onChange={toggleSubCategory} value={'Winterwear'} /> Winterwear
              </p>
            </div>

          </div>
        </div>

        {/* Right side */}
        <div className='flex-1'>
          <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTION'} />
            <select className='border-2 border-gray-300 text-sm px-2' onChange={(e) => setSortType(e.target.value)}>
              <option value="relevant">Sort by: Relevent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {
              filterProducts.map((item, index) => (
                <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
              ))
            }
          </div>
        </div>
      </div>

    </>
  )
}

export default Collection
