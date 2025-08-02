import React from 'react'

const RideCompleted = ({ ride, onReturnHome }) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl p-6 mx-4 max-w-sm w-full'>
        {/* Success Icon */}
        <div className='flex justify-center mb-4'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
            <i className="text-3xl text-green-600 ri-check-line"></i>
          </div>
        </div>
        
        {/* Title */}
        <h2 className='text-2xl font-bold text-center mb-2'>Ride Completed!</h2>
        <p className='text-gray-600 text-center mb-6'>Thank you for choosing our service</p>
        
        {/* Ride Details */}
        <div className='space-y-3 mb-6'>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
            <span className='text-gray-600'>Fare</span>
            <span className='font-semibold'>₹{ride?.fare}</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
            <span className='text-gray-600'>Distance</span>
            <span className='font-semibold'>{(ride?.distance / 1000).toFixed(1)} km</span>
          </div>
          <div className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'>
            <span className='text-gray-600'>Duration</span>
            <span className='font-semibold'>{Math.round((ride?.duration || 0) / 60)} min</span>
          </div>
        </div>
        
        {/* Return Button */}
        <button 
          onClick={onReturnHome}
          className='w-full bg-black text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors'
        >
          <i className="ri-arrow-left-line"></i>
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default RideCompleted 