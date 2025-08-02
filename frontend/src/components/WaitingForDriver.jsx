import React from 'react'

const WaitingForDriver = (props) => {

    return (
        <div>
            <h5 className='p-2 text-center w-[93%] absolute top-2' onClick={() => {
                props.setWaitingForDriver(false)
            }}><i className="text-3xl text-slate-300 hover:text-slate-500 transition-colors duration-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-bold mb-6 text-slate-800'>Driver is Coming</h3>
            
            {!props.showOtpInput ? (
                // Initial driver info view (first 5-10 seconds)
                <div className='space-y-6'>
                    <div className='flex items-center gap-4 p-4 bg-lime-50 border border-lime-200 rounded-xl'>
                        <img className='h-12 w-12 rounded-full object-cover border-2 border-white shadow-md' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="Driver" />
                        <div>
                            <h4 className='font-bold text-slate-800'>{props.ride?.captain?.fullname?.firstname + " " + props.ride?.captain?.fullname?.lastname}</h4>
                            <p className='text-sm text-slate-600'>Your driver</p>
                        </div>
                    </div>
                    <div className='bg-slate-50 rounded-xl p-4'>
                        <p className='text-sm text-slate-600 font-medium'>Estimated arrival time: <span className='text-lime-600 font-bold'>2-3 minutes</span></p>
                    </div>
                    <div className='text-center'>
                        <div className='inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg'>
                            <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                            <span className='text-sm font-semibold'>Driver is on the way</span>
                        </div>
                    </div>
                </div>
            ) : (
                // OTP display view (after 5-10 seconds)
                <div className='space-y-6'>
                    <div className='flex items-center gap-4 p-4 bg-lime-50 border border-lime-200 rounded-xl'>
                        <img className='h-12 w-12 rounded-full object-cover border-2 border-white shadow-md' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="Driver" />
                        <div>
                            <h4 className='font-bold text-slate-800'>{props.ride?.captain?.fullname?.firstname + " " + props.ride?.captain?.fullname?.lastname}</h4>
                            <p className='text-sm text-slate-600'>Your driver</p>
                        </div>
                    </div>
                    
                    <div className='bg-slate-50 rounded-xl p-4 text-center'>
                        <h4 className='font-semibold text-slate-800 mb-2'>Share this OTP with your driver:</h4>
                        <h1 className='text-5xl font-bold text-blue-500 tracking-wider'>{props.ride?.otp}</h1>
                    </div>
                    
                    <div className='space-y-3'>
                        <button
                            onClick={() => props.setWaitingForDriver(false)}
                            className='w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200'>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WaitingForDriver