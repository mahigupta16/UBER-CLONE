import React from 'react'

const RidePopUp = (props) => {
    // Function to format distance
    const formatDistance = (distanceInMeters) => {
        if (!distanceInMeters) return '0 KM'
        const distanceInKm = (distanceInMeters / 1000).toFixed(1)
        return `${distanceInKm} KM`
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-slate-300 hover:text-slate-500 transition-colors duration-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-bold mb-5 text-slate-800'>New Ride Available!</h3>
            <div className='flex items-center justify-between p-3 bg-lime-100 border border-lime-200 rounded-lg mt-4'>
                <div className='flex items-center gap-3'>
                    <img className='h-10 rounded-full object-cover w-10 border-1 border-white shadow-sm' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="User Profile" />
                    <h2 className='text-lg font-semibold text-slate-800'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                </div>
                <h5 className='text-lg font-bold text-lime-600'>{formatDistance(props.ride?.distance)}</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-4 p-3 border-b-2 border-slate-100'>
                        <i className="ri-map-pin-user-fill text-blue-500 text-xl"></i>
                        <div>
                            <h3 className='text-lg font-semibold text-slate-800'>Pickup Location</h3>
                            <p className='text-sm text-slate-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-3 border-b-2 border-slate-100'>
                        <i className="text-xl ri-map-pin-2-fill text-slate-500"></i>
                        <div>
                            <h3 className='text-lg font-semibold text-slate-800'>Destination</h3>
                            <p className='text-sm text-slate-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-3'>
                        <i className="ri-currency-line text-lime-500 text-xl"></i>
                        <div>
                            <h3 className='text-lg font-semibold text-slate-800'>₹{props.ride?.fare}</h3>
                            <p className='text-sm text-slate-600'>Cash Payment</p>
                        </div>
                    </div>
                </div>
                <div className='mt-5 w-full space-y-2'>
                    <button onClick={() => {
                        props.setConfirmRidePopupPanel(true)
                        props.confirmRide()

                    }} className='bg-lime-500 hover:bg-lime-600 w-full text-white font-semibold p-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.01]'>Accept Ride</button>

                    <button onClick={() => {
                        props.setRidePopupPanel(false)

                    }} className='w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold p-3 px-8 rounded-lg transition-all duration-200'>Ignore</button>


                </div>
            </div>
        </div>
    )
}

export default RidePopUp