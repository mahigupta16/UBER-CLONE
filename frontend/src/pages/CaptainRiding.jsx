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

            <div className='fixed bottom-0 left-0 w-full bg-yellow-400 z-[1010]'>
                <div className='w-full flex justify-center pt-2' onClick={() => setFinishRidePanel(true)}>
                    <i className="ri-arrow-up-s-line text-2xl text-black/70"></i>
                </div>
                <div className='p-6 pt-2 flex items-center justify-between'>
                    <h4 className='text-xl font-semibold'>{formatDistance(rideData?.distance)}</h4>
                    <button onClick={() => setFinishRidePanel(true)} className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
                </div>
            </div>
            <div className={`fixed left-0 w-full z-[2000] bottom-0 ${finishRidePanel ? 'translate-y-0' : 'translate-y-full'} bg-white px-3 pt-10 pb-[env(safe-area-inset-bottom,1rem)] shadow-xl border-t border-slate-200 rounded-t-2xl max-h-[80vh] overflow-y-auto transition-transform duration-300 ease-in-out`}>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

            <div className='h-screen fixed w-screen top-0 z-0 pointer-events-auto'>
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