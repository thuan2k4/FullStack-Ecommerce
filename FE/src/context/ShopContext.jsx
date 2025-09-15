import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

    const currency = '$'
    const delivery_fee = 10
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || "")

    const navigate = useNavigate()

    const getProducts = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/product/list-product`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "GET"
            })
            const data = await res.json()
            if (data.success) {
                setProducts(data.products)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Get ID & Size then put into cart
    const addToCart = async (itemId, size) => {
        let cartData = structuredClone(cartItems)

        if (!size) {
            toast.error('Select Product Size!')
            return
        }
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            }
            else {
                cartData[itemId][size] = 1
            }
        }
        else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
        setCartItems(cartData)

        if (token) {
            try {
                const res = await fetch(`${backendUrl}/api/cart/add-cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        itemId,
                        size
                    })
                })
                const data = await res.json()
                // console.log(data)
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
            getUserCart()
        }
        getProducts()
    }, [token])


    const getCartCount = () => {
        let totalCount = 0
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) totalCount += cartItems[items][item]
                } catch (error) {
                    console.log(error)
                }
            }
        }
        return totalCount
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setCartItems(cartData)

        if (token) {
            try {
                const res = await fetch(`${backendUrl}/api/cart/update-cart`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        itemId,
                        size,
                        quantity
                    })
                })
                const data = await res.json()
                console.log(data)
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    const removeCart = async (itemId) => {
        if (token) {
            try {
                const res = await fetch(`${backendUrl}/api/cart/remove-cart`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        itemId,
                    })
                })
                const data = await res.json()
                console.log(data)

                setCartItems(prev => {
                    const updated = { ...prev };
                    if (updated[itemId]) {
                        delete updated[itemId]
                    }
                    return updated
                })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    // Count total product
    const getCartAmount = () => {
        let totalAmount = 0
        // console.log(cartItems)
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items)
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item]
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
        return totalAmount
    }

    const getUserCart = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/cart/get-cart`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()
            if (data.success) {
                setCartItems(data.cartData)
            }
            // console.log(data)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        products,
        currency,
        delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        cartItems, addToCart,
        getCartCount, updateQuantity,
        getCartAmount, setCartItems,
        navigate,
        backendUrl,
        token, setToken,
        getUserCart,
        removeCart
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider