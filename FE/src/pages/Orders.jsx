import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from './../context/ShopContext';
import Title from './../components/Title';
import { toast } from 'react-toastify';

const Orders = () => {
  const { currency, token, backendUrl } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])

  const getDetailOrder = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/order/user-orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()

      if (data.success) {
        let allOrderItem = []

        data.orderDetail.map((order) => (
          order.items.map((item) => {
            // Add element for oderDetail: status, payment(method), date
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrderItem.push(item)
          })
        ))
        // console.log(allOrderItem)
        setOrderData(allOrderItem.reverse())
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDetailOrder()
  }, [])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDER'} />
      </div>

      <div className=''>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4' >
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-bsae text-gray-700'>
                    <p className='text-lg'>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='mt-2'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-2'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-700'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button className='border px-4 py-2 text-sm font-medium rounded-sm'>
                  Track Order
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
