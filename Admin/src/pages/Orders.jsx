import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/admin_assets/assets'
const Orders = ({ token }) => {
    const [orders, setOrders] = useState([])

    const fetchAllOrders = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/order/list`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            const data = await res.json()
            // console.log(data.orders)
            if (data.success) {
                setOrders(data.orders)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const statusHandler = async (e, orderId) => {
        try {
            // console.log(token)
            const res = await fetch(`${backendUrl}/api/order/status`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    orderId,
                    status: e.target.value
                })
            })
            const data = await res.json()
            // console.log(data)
            if (data.success) {
                await fetchAllOrders()
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
        fetchAllOrders()
    }, [token])

    return (
        <div>
            <h3 className='font-bold mb-3'>Order Page</h3>
            <div >
                {
                    orders.map((order, index) => (
                        <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md: p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
                            <img className='w-12' src={assets.parcel_icon} />
                            <div className='gap-4'>
                                <div>
                                    {order.items.map((item, index) => {
                                        if (index === order.items.length - 1) {
                                            return <p className='py-0.5' key={index}>{item.name} x {item.quantity} <span>{item.size}</span></p>
                                        }
                                        else {
                                            return <p className='py-0.5' key={index}>{item.name} x {item.quantity} <span>{item.size}</span></p>
                                        }
                                    })}
                                </div>
                                <p className='font-medium mt-3 mb-2'>{`${order.address.firstName} ${order.address.lastName}`}</p>
                                <div>
                                    <p>{`${order.address.street},`}</p>
                                    <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`}</p>
                                </div>
                                <p>{`${order.address.phone}`}</p>
                            </div>
                            <div>
                                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                                <p className='mt-3'>Method: {order.paymentMethod}</p>
                                <p>Payment: {order.payment ? "Done" : "Pending"}</p>
                                <p>Date: {new Date(order.date).toDateString()}</p>
                            </div>
                            <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>

                            <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className='p-2 font-semibold'>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packing">Packing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Orders
