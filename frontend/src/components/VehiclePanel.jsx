import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className="text-3xl text-slate-300 hover:text-slate-500 transition-colors duration-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-bold mb-5 text-slate-800'>Choose a Vehicle</h3>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('car')
            }} className='flex border-1 border-slate-200 hover:border-blue-500 active:border-blue-600 mb-3 rounded-lg w-full p-4 items-center justify-between transition-all duration-200 hover:shadow-md cursor-pointer'>
                <img className='h-10 w-10 object-cover rounded-md' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="UberGo" />
                <div className='ml-3 w-1/2'>
                    <h4 className='font-bold text-base text-slate-800'>UberGo <span className='text-slate-500'><i className="ri-user-3-fill"></i>4</span></h4>
                    <h5 className='font-semibold text-sm text-blue-500'>2 mins away</h5>
                    <p className='font-normal text-xs text-slate-600'>Affordable, compact rides</p>
                </div>
                <h2 className='text-lg font-bold text-slate-800'>₹{props.fare.car}</h2>
            </div>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('motorcycle')
            }} className='flex border-1 border-slate-200 hover:border-blue-500 active:border-blue-600 mb-3 rounded-lg w-full p-4 items-center justify-between transition-all duration-200 hover:shadow-md cursor-pointer'>
                <img className='h-10 w-10 object-cover rounded-md' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Moto" />
                <div className='ml-3 w-1/2'>
                    <h4 className='font-bold text-base text-slate-800'>Moto <span className='text-slate-500'><i className="ri-user-3-fill"></i>1</span></h4>
                    <h5 className='font-semibold text-sm text-blue-500'>3 mins away</h5>
                    <p className='font-normal text-xs text-slate-600'>Affordable motorcycle rides</p>
                </div>
                <h2 className='text-lg font-bold text-slate-800'>₹{props.fare.motorcycle}</h2>
            </div> 
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('auto')
            }} className='flex border-1 border-slate-200 hover:border-blue-500 active:border-blue-600 mb-3 rounded-lg w-full p-4 items-center justify-between transition-all duration-200 hover:shadow-md cursor-pointer'>
                <img className='h-10 w-10 object-cover rounded-md' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="UberAuto" />
                <div className='ml-3 w-1/2'>
                    <h4 className='font-bold text-base text-slate-800'>UberAuto <span className='text-slate-500'><i className="ri-user-3-fill"></i>3</span></h4>
                    <h5 className='font-semibold text-sm text-blue-500'>3 mins away</h5>
                    <p className='font-normal text-xs text-slate-600'>Affordable Auto rides</p>
                </div>
                <h2 className='text-lg font-bold text-slate-800'>₹{props.fare.auto}</h2>
            </div>
        </div>
    )
}

export default VehiclePanel