import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const FinishRide = (props) => {

    const navigate = useNavigate()

    // Function to format distance
    const formatDistance = (distanceInMeters) => {
        if (!distanceInMeters) return '0 KM'
        const distanceInKm = (distanceInMeters / 1000).toFixed(1)
        return `${distanceInKm} KM`
    }

    async function endRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {

            rideId: props.ride._id


        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (response.status === 200) {
            navigate('/captain-home')
        }

    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mt-6 mb-5'>Finish this Ride</h3>
            <div className='flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>{formatDistance(props.ride?.distance)}</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-4'>
                    {/* Pickup */}
                    <div className='flex items-start gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-blue-500"></i>
                        <div>
                            <h3 className='text-lg font-semibold'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>

                    {/* Stops (if any) */}
                    {Array.isArray(props.ride?.stops) && props.ride.stops.length > 0 && (
                        <div className='p-3 border-b-2'>
                            <div className='ml-8 space-y-2'>
                                {props.ride.stops.map((s, i) => (
                                    <div key={`finish-stop-${i}`} className='flex items-start gap-3'>
                                        <i className="ri-map-pin-2-fill text-amber-500 mr-1"></i>
                                        <div>
                                            <h4 className='font-medium'>Stop {i + 1}</h4>
                                            <p className='text-sm -mt-1 text-gray-600'>{s}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Destination */}
                    <div className='flex items-start gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-slate-500"></i>
                        <div>
                            <h3 className='text-lg font-semibold'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>

                    {/* Fare */}
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>
                </div>

                <div className='mt-4 w-full'>

                    <button
                        onClick={endRide}
                        className='w-full mt-5 flex  text-lg justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'>Finish Ride</button>

                </div>
            </div>
        </div>
    )
}

export default FinishRide