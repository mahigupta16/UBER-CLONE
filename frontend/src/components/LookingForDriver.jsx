import React, { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'

const LookingForDriver = (props) => {
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    const handleCancelRide = () => {
        // Emit a socket event to cancel the ride if possible
        if (props.ride && props.ride._id && props.ride.user && props.ride.user._id) {
            socket.emit('cancel-ride', { rideId: props.ride._id, userId: props.ride.user._id })
        }
        // Always close the panel and reset UI
        if (props.setVehicleFound) props.setVehicleFound(false)
        // Optionally reset other panels if needed
        navigate('/home')
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                if (props.setVehicleFound) props.setVehicleFound(false)
            }}><i className="text-3xl text-slate-300 hover:text-slate-500 transition-colors duration-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-bold mb-5 text-slate-800'>Your Ride Details</h3>
            
            <div className='space-y-4 mb-6'>
                <div className='flex items-center gap-4 p-4 bg-slate-50 rounded-xl'>
                    <i className="ri-map-pin-user-fill text-blue-500 text-xl"></i>
                    <div>
                        <h4 className='font-semibold text-slate-800'>Pickup</h4>
                        <p className='text-sm text-slate-600'>{props.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-4 bg-slate-50 rounded-xl'>
                    <i className="ri-map-pin-2-fill text-slate-500 text-xl"></i>
                    <div>
                        <h4 className='font-semibold text-slate-800'>Destination</h4>
                        <p className='text-sm text-slate-600'>{props.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 p-4 bg-slate-50 rounded-xl'>
                    <i className="ri-currency-line text-lime-500 text-xl"></i>
                    <div>
                        <h4 className='font-semibold text-slate-800'>Estimated Fare</h4>
                        <p className='text-lg font-bold text-lime-600'>₹{props.fare[props.vehicleType]}</p>
                    </div>
                </div>
            </div>

            <div className='text-center space-y-4'>
                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto'>
                    <i className="text-3xl text-blue-500 ri-search-line animate-pulse"></i>
                </div>
                <p className='text-slate-600 font-medium'>Finding the best driver for you...</p>
                <div className='bg-slate-50 rounded-xl p-4 mb-4'>
                    <p className='text-sm text-slate-500'>Please wait while we connect you with a nearby driver</p>
                </div>
                <button 
                    onClick={handleCancelRide}
                    className='w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200'>
                    Cancel Ride
                </button>
            </div>
        </div>
    )
}

export default LookingForDriver