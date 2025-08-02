import React from 'react'
import { Link } from 'react-router-dom'
const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 flex justify-between flex-col w-full relative'>
        {/* Overlay for better text readability */}
        <div className='absolute inset-0 bg-slate-900/20'></div>
        
        {/* Logo with better positioning */}
        <div className='relative z-10 px-6 pt-4'>
          <img className='w-16 h-auto' src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417" alt="Uber Logo" />
        </div>
        
        {/* Content section with enhanced styling */}
        <div className='relative z-10 bg-white rounded-t-2xl shadow-xl pb-6 py-6 px-4 mx-2'>
          <h2 className='text-2xl font-bold text-slate-800 mb-4 leading-tight'>Get Started with Uber</h2>
          <p className='text-slate-600 mb-6 text-base leading-relaxed'>Your journey begins here. Book rides, track drivers, and travel with confidence.</p>
          <Link to='/login' className='flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.01]'>
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start