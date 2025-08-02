import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const Captainlogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

    if (response.status === 200) {
      const data = response.data

      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')

    }

    setEmail('')
    setPassword('')
  }
  return (
    <div className='p-8 h-screen flex flex-col justify-between bg-slate-50'>
      <div>
        <img className='w-24 mb-6' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="Captain Icon" />

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-xl font-bold mb-3 text-slate-800'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-white border border-slate-200 mb-6 rounded-xl px-5 py-4 w-full text-lg placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-all duration-200'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-xl font-bold mb-3 text-slate-800'>Enter Password</h3>

          <input
            className='bg-white border border-slate-200 mb-8 rounded-xl px-5 py-4 w-full text-lg placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-all duration-200'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type="password"
            placeholder='password'
          />

          <button
            className='bg-blue-500 hover:bg-blue-600 text-white font-bold mb-6 rounded-xl px-5 py-4 w-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
          >Login</button>

        </form>
        <p className='text-center text-slate-600'>Join a fleet? <Link to='/captain-signup' className='text-blue-500 font-semibold hover:text-blue-600 transition-colors duration-200'>Register as a Captain</Link></p>
      </div>
      <div>
        <Link
          to='/login'
          className='bg-slate-800 hover:bg-slate-900 flex items-center justify-center text-white font-bold mb-6 rounded-xl px-5 py-4 w-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
        >Sign in as User</Link>
      </div>
    </div>
  )
}

export default Captainlogin