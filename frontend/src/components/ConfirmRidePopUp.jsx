import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)

    // Function to format distance
    const formatDistance = (distanceInMeters) => {
        if (!distanceInMeters) return '0 KM'
        const distanceInKm = (distanceInMeters / 1000).toFixed(1)
        return `${distanceInKm} KM`
    }

    const submitHander = async (e) => {
        e.preventDefault()

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            navigate('/captain-riding', { state: { ride: props.ride } })
        }


    }
    return (
        <div className='h-full flex flex-col'>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <div className='flex-1 overflow-y-auto pr-1'>
            <h3 className='text-2xl font-semibold mb-4'>Confirm this ride to Start</h3>
            <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>{formatDistance(props.ride?.distance)}</h5>
            </div>

            {/* Route summary for captain */}
            <div className='mt-4 space-y-1.5'>
                <div className='flex items-start gap-3'>
                    <i className="ri-map-pin-user-fill text-blue-500 text-xl"></i>
                    <div>
                        <h4 className='font-semibold'>Pickup</h4>
                        <p className='text-sm text-slate-600'>{props.ride?.pickup}</p>
                    </div>
                </div>
                {Array.isArray(props.ride?.stops) && props.ride.stops.length > 0 && (
                    <div className='ml-7 space-y-1.5'>
                        {props.ride.stops.map((s, i) => (
                            <div key={`cap-stop-${i}`} className='flex items-start gap-3'>
                                <i className="ri-map-pin-2-fill text-amber-500 text-lg mr-1"></i>
                                <div>
                                    <h4 className='font-semibold'>Stop {i + 1}</h4>
                                    <p className='text-sm text-slate-600'>{s}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className='flex items-start gap-3'>
                    <i className="ri-map-pin-2-fill text-slate-500 text-xl"></i>
                    <div>
                        <h4 className='font-semibold'>Destination</h4>
                        <p className='text-sm text-slate-600'>{props.ride?.destination}</p>
                    </div>
                </div>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                {/* Fare summary only (route details already shown above) */}
                <div className='w-full mt-4'>
                    <div className='flex items-center gap-4 p-3'>
                        <i className="ri-currency-line text-lime-600 text-xl"></i>
                        <div>
                            <h4 className='text-lg font-semibold'>₹{props.ride?.fare}</h4>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>

                <div className='mt-4 w-full'>
                    <form onSubmit={submitHander}>
                        <label className='block text-sm font-semibold text-slate-700'>Enter OTP</label>
                        <input value={otp} onChange={(e) => setOtp(e.target.value)} inputMode='numeric' pattern='[0-9]*' maxLength={6} type="text" className='bg-slate-100 px-6 py-4 tracking-widest font-mono text-lg rounded-lg w-full mt-2 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400' placeholder='______' />

                        <button className='w-full mt-4 text-lg flex justify-center bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg shadow-md'>Confirm</button>
                        <button onClick={(e) => {
                            e.preventDefault();
                            if (props.ride && props.ride._id && props.ride.captain && props.ride.captain._id) {
                                socket.emit('cancel-ride', { rideId: props.ride._id, captainId: props.ride.captain._id })
                            }
                            props.setConfirmRidePopupPanel(false)
                            props.setRidePopupPanel(false)
                            navigate('/captain-home')
                        }} className='w-full mt-2 bg-red-600 hover:bg-red-700 text-lg text-white font-semibold p-3 rounded-lg'>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    )
}

export default ConfirmRidePopUp