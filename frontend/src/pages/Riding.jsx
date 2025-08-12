import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom' // Added useLocation
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'
import RideCompleted from '../components/RideCompleted'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'


const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)
    const navigate = useNavigate()
    const [showCompletion, setShowCompletion] = useState(false)
    const [panelExpanded, setPanelExpanded] = useState(false)

    // Helpers to format ETA and distance
    const formatDistance = (meters) => {
        if (!meters) return '—'
        const km = (meters / 1000).toFixed(1)
        return `${km} km`
    }

    const formatDuration = (seconds) => {
        if (!seconds) return '—'
        const mins = Math.round(seconds / 60)
        if (mins < 60) return `${mins} min`
        const h = Math.floor(mins / 60)
        const m = mins % 60
        return `${h} hr ${m} min`
    }

    const arrivalTimeText = (seconds) => {
        if (!seconds) return ''
        const eta = new Date(Date.now() + seconds * 1000)
        return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const [liveEta, setLiveEta] = useState(null) // seconds
    const [liveDistance, setLiveDistance] = useState(null) // meters

    // Vehicle meta (label and image) based on captain's vehicle type
    const vehicleMeta = (() => {
        const type = ride?.captain?.vehicle?.vehicleType;
        if (type === 'motorcycle') {
            return {
                label: 'Moto',
                img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png'
            }
        }
        if (type === 'auto') {
            return {
                label: 'Auto',
                img: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png'
            }
        }
        return {
            label: 'Car',
            img: 'https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg'
        }
    })()


    // Poll for live ETA every 15s using user's current location and destination
    useEffect(() => {
        let timerId
        const poll = async () => {
            try {
                // Get current geolocation
                await new Promise((resolve, reject) => {
                    if (!navigator.geolocation) return reject(new Error('Geolocation not supported'))
                    navigator.geolocation.getCurrentPosition((pos) => {
                        resolve(pos)
                    }, (err) => reject(err), { enableHighAccuracy: true, maximumAge: 5000 })
                }).then(async (pos) => {
                    const { latitude, longitude } = pos.coords
                    // Build origin as "lat,lng", destination from ride coords
                    const origin = `${latitude},${longitude}`
                    const destCoords = ride?.destinationCoords ? `${ride.destinationCoords.ltd},${ride.destinationCoords.lng}` : null
                    if (!destCoords) return
                    const resp = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
                        params: { origin, destination: destCoords },
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                    setLiveEta(resp.data?.duration ?? null)
                    setLiveDistance(resp.data?.distance ?? null)
                })
            } catch (e) {
                // fail silently to avoid UI disruption
            } finally {
                timerId = setTimeout(poll, 15000)
            }
        }
        poll()
        return () => { if (timerId) clearTimeout(timerId) }
    }, [ride?.destinationCoords])
    // Ensure user joins room again on Riding screen for reliability
    useEffect(() => {
        const uid = user?._id || ride?.user?._id
        if (uid) {
            socket.emit('join', { userType: 'user', userId: uid })
        }
    }, [user?._id, ride?.user?._id, socket])


    useEffect(() => {
        const handleRideEnded = (data) => {
            console.log('ride-ended received', data)
            setShowCompletion(true)
        }

        socket.on("ride-ended", handleRideEnded)

        return () => {
            socket.off("ride-ended", handleRideEnded)
        }
    }, [socket])

    const handleReturnHome = () => {
        navigate('/home')
    }


    return (
        <div className='h-screen'>
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            {/* Fullscreen Map */}
            <div className='fixed inset-0 z-0 pointer-events-auto'>
                <LiveTracking
                    className="h-full w-full"
                    pickupCoords={ride?.pickupCoords ? { lat: ride.pickupCoords.ltd, lng: ride.pickupCoords.lng } : null}
                    destinationCoords={ride?.destinationCoords ? { lat: ride.destinationCoords.ltd, lng: ride.destinationCoords.lng } : null}
                    stopsCoords={ride?.stopsCoords ? ride.stopsCoords.map(s => ({ lat: s.ltd, lng: s.lng })) : []}
                />
            </div>

            {/* Bottom Sheet Panel */}
            <div className={`fixed bottom-0 left-0 right-0 z-20 transition-transform duration-300 ease-in-out ${panelExpanded ? 'translate-y-0' : 'translate-y-[56%]'} pointer-events-none`}>
                <div className='relative p-4 space-y-4 bg-white/95 backdrop-blur-lg border-t border-slate-200 rounded-t-2xl shadow-xl overflow-hidden pointer-events-auto pb-[env(safe-area-inset-bottom,0.5rem)]'>
                    <button onClick={() => setPanelExpanded(!panelExpanded)} className='absolute left-1/2 -top-3 -translate-x-1/2 w-10 h-1.5 rounded-full bg-slate-300'></button>

                {/* ETA Panel */}
                <div className='flex items-center justify-between p-1 border border-blue-200 bg-blue-50 rounded-xl shadow-sm'>
                    <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center'>
                            <i className='ri-time-line text-blue-600 text-lg'></i>
                        </div>
                        <div>
                            <h4 className='font-semibold text-slate-800'>ETA</h4>
                            <p className='text-sm text-slate-600'>
                                {formatDuration(liveEta ?? ride?.duration)} • {formatDistance(liveDistance ?? ride?.distance)}
                            </p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className='text-sm text-slate-500'>Arrives by</p>
                        <p className='text-lg font-bold text-slate-800'>{arrivalTimeText(liveEta ?? ride?.duration)}</p>
                    </div>
                </div>

                <div className='flex items-center justify-between'>
                    <img className='h-12 w-16 object-contain' src={vehicleMeta.img} alt={vehicleMeta.label} />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm text-gray-600'>{vehicleMeta.label}</p>

                    </div>
                </div>

                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>

                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{ride?.fare} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <button className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Make a Payment</button>
                </div>
            </div>

            {/* Ride Completion Popup */}
            {showCompletion && (
                <RideCompleted
                    ride={ride}
                    onReturnHome={handleReturnHome}
                />
            )}
        </div>
    )
}

export default Riding