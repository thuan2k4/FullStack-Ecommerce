import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List';
import Orders from './../../Admin/src/pages/Orders';
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = "$"
const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') || "")

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    }
  }, [token])


  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <SideBar />
            <div className='w-[70%] ms-auto my-8 text-gray-600 text-base' style={{ marginLeft: "max(5vw, 25px)" }}>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }

    </div>
  )
}

export default App
