import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {

    const [ finishRidePanel, setFinishRidePanel ] = useState(false)

    const location = useLocation()
    const rideData = location.state?.ride

    // Function to format distance
    const formatDistance = (distanceInMeters) => {
        if (!distanceInMeters) return '0 KM away'
        const distanceInKm = (distanceInMeters / 1000).toFixed(1)
        return `${distanceInKm} KM away`
    }



    return (
        <div className='h-screen relative flex flex-col justify-end'>

            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center w-[90%] absolute top-0' onClick={() => {
                    setFinishRidePanel(true)
                }}><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
                <h4 className='text-xl font-semibold'>{formatDistance(rideData?.distance)}</h4>
                <button onClick={() => setFinishRidePanel(true)} className=' bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
            </div>
            <div className={`fixed w-full z-[500] bottom-0 ${finishRidePanel ? 'translate-y-0' : 'translate-y-full'} bg-white px-3 pt-10 pb-4 shadow-xl border-t border-slate-200 rounded-t-2xl max-h-[80vh] overflow-y-auto transition-transform duration-300 ease-in-out`}>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

            <div className='h-screen fixed w-screen top-0 z-[-1]'>
                <LiveTracking
                    isCaptain={true}
                    pickupCoords={rideData?.pickupCoords ? { lat: rideData.pickupCoords.ltd, lng: rideData.pickupCoords.lng } : null}
                    destinationCoords={rideData?.destinationCoords ? { lat: rideData.destinationCoords.ltd, lng: rideData.destinationCoords.lng } : null}
                    stopsCoords={rideData?.stopsCoords ? rideData.stopsCoords.map(s => ({ lat: s.ltd, lng: s.lng })) : []}
                />
            </div>

        </div>
    )
}

export default CaptainRiding