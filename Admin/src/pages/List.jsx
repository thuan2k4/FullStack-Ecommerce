import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from './../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
    const [list, setList] = useState([])

    const fetchList = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/product/list-product`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                method: "GET"
            })

            const data = await res.json()
            if (data.success) {
                setList(data.products)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const removeProduct = async (id) => {
        try {
            // console.log(id, token);

            const res = await fetch(`${backendUrl}/api/product/remove-product`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    productId: id
                })
            })

            const data = await res.json()
            if (data.success) {
                fetchList()
                toast.success("Remove product successful!")
            }
            else {
                toast.error(data.message)

            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchList()
    }, [])

    return (
        <div>
            <p className='text-3xl font-medium mb-3'>All Products List</p>
            <div>
                <table className='table-auto w-full border'>
                    <thead>
                        <tr>
                            <th className='border border-gray-300 px-4 py-2'>Image</th>
                            <th className='border border-gray-300 px-4 py-2'>Name</th>
                            <th className='border border-gray-300 px-4 py-2'>Category</th>
                            <th className='border border-gray-300 px-4 py-2'>Price</th>
                            <th className='border border-gray-300 px-4 py-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length > 0
                            ? list.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 text-center">
                                    <td className="border border-gray-300 px-4 py-2 w-2/12">
                                        <div className="flex justify-center items-center">
                                            <img src={item.image[0]} alt={item.name} className="h-30 object-cover" />
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 w-4/12">{item.name}</td>
                                    <td className="border border-gray-300 px-4 py-2 w-1/12">{item.category}</td>
                                    <td className="border border-gray-300 px-4 py-2 w-2/12">{currency}{item.price}</td>
                                    <td className="border border-gray-300 px-4 py-2 w-full">
                                        <button onClick={() => removeProduct(item._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                                    </td>
                                </tr>
                            ))
                            : <tr className='text-center'>
                                <td className="border border-gray-300 text-xl text-center px-4 py-2" colSpan={5}>EMPTY PRODUCT</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default List
