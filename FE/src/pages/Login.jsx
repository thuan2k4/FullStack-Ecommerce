import React, { useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const Login = () => {

  const [currenState, setCurrentState] = useState('Login')
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (currenState === "Sign Up") {
        const res = await fetch(`${backendUrl}/api/user/register`, {
          method: "POST",
          headers: { "Content-Type": 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password
          })
        })
        const data = await res.json()
        if (data.success) {
          setCurrentState('Login')
          toast.success(data.message)
        }
        else {
          toast.error(data.message)
        }
      }
      else {
        const res = await fetch(`${backendUrl}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": 'application/json' },
          body: JSON.stringify({
            email: email,
            password: password
          })
        })
        const data = await res.json()
        // console.log(data);
        if (data.success) {
          setToken(data.token)
          localStorage.setItem('token', token)
          toast.success(data.message)
        }
        else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {

    if (token) {
      localStorage.setItem('token', token)
      navigate('/')
    }

  }, [token, navigate])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currenState}</p>
        <hr className='border-none h-[1.5px] - w-8 bg-gray-800' />
      </div>
      {currenState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
      <input onChange={(e) => setEmail(e.target.value)} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
      <input onChange={(e) => setPassword(e.target.value)} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currenState === 'Login'
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create Account</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login here!</p>
        }
      </div>
      <button className='bg-black cursor-pointer text-white font-light px-8 py-2 mt-4'>{currenState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login
