import React from 'react'

const ConfirmRide = (props) => {
    return (
        <div>
            <h5 className='p-2 text-center w-[93%] absolute top-2' onClick={() => {
                props.setConfirmRidePanel(false)
            }}><i className="text-3xl text-slate-300 hover:text-slate-500 transition-colors duration-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-bold mb-6 text-slate-800'>Confirm Your Ride</h3>
            <div className='space-y-4'>
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
                        <h4 className='font-semibold text-slate-800'>Fare</h4>
                        <p className='text-lg font-bold text-lime-600'>₹{props.fare[props.vehicleType]}</p>
                    </div>
                </div>
            </div>
            <button
                onClick={() => {
                    props.createRide()
                    props.setConfirmRidePanel(false)
                    props.setVehicleFound(true)
                }}
                className='bg-lime-500 hover:bg-lime-600 text-white font-bold py-4 px-6 rounded-xl mt-6 w-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'>
                Confirm Ride
            </button>
        </div>
    )
}

export default ConfirmRide