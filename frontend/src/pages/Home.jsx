
import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';


const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ stops, setStops ] = useState([]) // optional intermediate stops
    const [ panelOpen, setPanelOpen ] = useState(false)
    const [ suggestionsOpen, setSuggestionsOpen ] = useState(false)
    const [ menuOpen, setMenuOpen ] = useState(false)
    const { theme, toggleTheme } = useContext(ThemeContext)

    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const destinationRef = useRef(null)

    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ showOtpInput, setShowOtpInput ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ stopSuggestions, setStopSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    // Panel management function
    const closeAllPanels = () => {
        setVehiclePanel(false)
        setConfirmRidePanel(false)
        setVehicleFound(false)
        setWaitingForDriver(false)
        setShowOtpInput(false)
        setPanelOpen(false)
    }

    // Enhanced panel setters
    const openVehiclePanel = () => {
        closeAllPanels()
        setVehiclePanel(true)
    }

    const openConfirmRidePanel = () => {
        closeAllPanels()
        setConfirmRidePanel(true)
    }

    const openVehicleFound = () => {
        closeAllPanels()
        setVehicleFound(true)
    }

    const openWaitingForDriver = () => {
        closeAllPanels()
        setWaitingForDriver(true)
        setShowOtpInput(false)

        // Show OTP input after 7 seconds
        setTimeout(() => {
            setShowOtpInput(true)
        }, 7000)
    }

    useEffect(() => {
        if (user?._id) {
            socket.emit("join", { userType: "user", userId: user._id })
        }
    }, [ user, socket ])

    useEffect(() => {
        const handleRideConfirmed = (ride) => {
            console.log('Ride confirmed received:', ride);
            console.log('Ride captain data:', ride.captain);
            console.log('Ride OTP:', ride.otp);
            setVehicleFound(false)
            openWaitingForDriver()
            setRide(ride)
        }

        const handleRideStarted = (ride) => {
            console.log('Ride started received:', ride);
            closeAllPanels()
            navigate('/riding', { state: { ride } })
        }

        socket.on('ride-confirmed', handleRideConfirmed)
        socket.on('ride-started', handleRideStarted)

        return () => {
            socket.off('ride-confirmed', handleRideConfirmed)
            socket.off('ride-started', handleRideStarted)
        }
    }, [socket, navigate])


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleStopChange = async (e, index) => {
        const value = e.target.value
        setStops(prev => {
            const next = [...prev]
            next[index] = value
            return next
        })
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setStopSuggestions(response.data)
        } catch {}
    }

    const submitHandler = (e) => {
        e.preventDefault();

        setDestination('')
        setPickup('')
        setStops([])
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        // If pickup is empty, use geolocation
        if (!pickup) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const coords = position.coords;
                    setPickup(`Current Location (${coords.latitude}, ${coords.longitude})`);
                    // Optionally, reverse geocode here for a better label
                });
            }
        }
        openVehiclePanel()
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: {
                pickup: pickup || 'Current Location',
                destination,
                stops: JSON.stringify(stops.filter(Boolean))
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setFare(response.data)
    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            stops: stops.filter(Boolean),
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


    }


    return (
        <div className='h-screen relative overflow-hidden'>
             {/* Header */}
            <div className={`fixed top-0 left-0 flex items-center justify-between w-full z-20 bg-transparent h-16 px-4 pointer-events-none transition-all duration-300 ${panelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <img className='w-12 h-12 object-contain ml-2 pointer-events-auto' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />
                <div className='relative pointer-events-auto flex items-center gap-2'>
                    <button
                        onClick={() => toggleTheme()}
                        aria-label='Toggle theme'
                        className='h-10 w-10 bg-slate-100 hover:bg-slate-200 flex items-center justify-center rounded-full transition-all duration-200 shadow-sm hover:shadow-md'
                    >
                        {theme === 'dark' ? (
                          <i className="ri-sun-line text-slate-700"></i>
                        ) : (
                          <i className="ri-moon-line text-slate-700"></i>
                        )}
                    </button>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className='h-10 w-10 bg-slate-100 hover:bg-slate-200 flex items-center justify-center rounded-full transition-all duration-200 shadow-sm hover:shadow-md'
                    >
                        <i className="text-lg font-medium ri-menu-line text-slate-700"></i>
                    </button>

                    {menuOpen && (
                        <div className='absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-slate-200 min-w-48 py-2'>
                            <Link
                                to='/ride-history'
                                className='flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700'
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="ri-history-line"></i>
                                <span>Ride History</span>
                            </Link>
                            <Link
                                to='/start'
                                className='flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700'
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="ri-logout-box-r-line"></i>
                                <span>Logout</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className='fixed inset-0 z-0 pointer-events-auto'>
                <LiveTracking
                    className="h-full w-full"
                    pickupCoords={ride?.pickupCoords ? { lat: ride.pickupCoords.ltd, lng: ride.pickupCoords.lng } : null}
                    destinationCoords={ride?.destinationCoords ? { lat: ride.destinationCoords.ltd, lng: ride.destinationCoords.lng } : null}
                    stopsCoords={ride?.stopsCoords ? ride.stopsCoords.map(s => ({ lat: s.ltd, lng: s.lng })) : []}
                    scrollWheelZoom={true}
                    zoomControl={true}
                />
            </div>
            <div className='fixed inset-0 z-10 flex flex-col justify-end'>
                <div className={`p-4 bg-white relative transition-all duration-300 ${panelOpen ? 'h-full' : 'h-[36%]'} flexy flex-col rounded-t-2xl shadow-xl border-t border-slate-200`}>
                    <button onClick={() => setPanelOpen(!panelOpen)} className='absolute left-1/2 -top-3 -translate-x-1/2 w-12 h-1.5 rounded-full bg-slate-300'></button>
                <h5 ref={panelCloseRef} onClick={() => {
                    setPanelOpen(false)
                }} className={`absolute right-6 top-6 text-2xl transition-all duration-300 ${panelOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <i className="ri-arrow-down-wide-line"></i>
                </h5>
                    <h4 className='text-xl font-semibold mb-3 text-slate-800'>Find a trip</h4>
                    <div className={`flex-1 overflow-y-auto pr-1 ${suggestionsOpen ? 'pb-[50vh]' : 'pb-2'}`}>
                        <form className='relative py-1' onSubmit={(e) => {
                            submitHandler(e)
                        }}>
                            <div className='relative'>
                                <i className="ri-map-pin-user-fill absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-lg"></i>
                                <input
                                    onFocus={() => {
                                        setPanelOpen(true)
                                        setSuggestionsOpen(true)
                                        setActiveField('pickup')
                                    }}
                                    onBlur={() => { setTimeout(() => setSuggestionsOpen(false), 150) }}
                                    value={pickup}
                                    onChange={(e)=>{ setSuggestionsOpen(true); handlePickupChange(e); }}
                                    className='bg-slate-100 pl-10 pr-4 py-2 text-base rounded w-full border border-slate-200 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-500'
                                    type="text"
                                    placeholder='Add a pick-up location'
                                />
                            </div>
                            {/* Dynamic stops inputs come between pickup and destination (original order) */}
                            {panelOpen && stops.map((stop, index) => (
                                <div key={`stop-${index}`} className='mt-2 flex items-center gap-2'>
                                  <div className='w-6 text-center text-xs font-semibold text-slate-600'>{index + 1}</div>
                                  <div className='relative flex-1 min-w-0'>
                                    <i className="ri-map-pin-2-fill absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 text-base"></i>
                                    <input
                                        onFocus={() => { setSuggestionsOpen(true); setActiveField(`stop-${index}`) }}
                                        onBlur={() => { setTimeout(() => setSuggestionsOpen(false), 150) }}
                                        value={stop || ''}
                                        onChange={(e) => { setSuggestionsOpen(true); handleStopChange(e, index) }}
                                        className='bg-slate-100 pl-9 pr-10 py-2 text-sm rounded w-[86%] ml-2 border border-slate-200 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-500'
                                        type="text"
                                        placeholder={`Add stop ${index + 1}`}
                                    />
                                    <button type='button' aria-label='Remove stop' onClick={() => setStops(prev => prev.filter((_, i) => i !== index))} className='absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-600'>
                                      <i className="ri-close-circle-line text-lg"></i>
                                    </button>
                                  </div>
                                </div>
                            ))}
                            {panelOpen && stops.length < 3 && (
                              <div className='flex gap-2 mt-2'>
                                  <button type='button'
                                      onClick={() => setStops(prev => prev.length >= 3 ? prev : [...prev, ''])}
                                      className='text-blue-600 text-sm font-medium hover:underline'>+ Add stop</button>
                              </div>
                            )}
                            {/* Destination input (original position after stops) */}
                            <div className='relative mt-2'>
                                <i className="ri-map-pin-2-fill absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg"></i>
                                <input
                                    ref={destinationRef}
                                    onFocus={() => {
                                        setPanelOpen(true)
                                        setSuggestionsOpen(true)
                                        setActiveField('destination')
                                    }}
                                    onBlur={() => { setTimeout(() => setSuggestionsOpen(false), 150) }}
                                    value={destination}
                                    onChange={(e)=>{ setSuggestionsOpen(true); handleDestinationChange(e); }}
                                    className='bg-slate-100 pl-10 pr-4 py-2 text-base rounded w-full border border-slate-200 focus:border-blue-500 transition-all duration-200 placeholder:text-slate-500'
                                    type="text"
                                    placeholder='Enter your destination' />
                            </div>
                            {!(vehiclePanel || confirmRidePanel || vehicleFound || waitingForDriver) && (
                              <div className='sticky bottom-0 bg-white pt-3 pb-1'>
                                <button
                                    type='button'
                                    onClick={findTrip}
                                    className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded w-full font-semibold text-base transition-all duration-200 shadow hover:shadow-md'
                                >
                                    Find Trip
                                </button>
                              </div>
                            )}
                        </form>
                    </div>

                </div>
                {suggestionsOpen && (
                  <div ref={panelRef} className='fixed bottom-0 left-0 w-full max-h-[60%] overflow-y-auto bg-white shadow-md z-30 rounded-t-2xl'>
                      <LocationSearchPanel
                          suggestions={activeField === 'pickup' ? pickupSuggestions : activeField?.startsWith('stop-') ? stopSuggestions : destinationSuggestions}
                          setPanelOpen={setPanelOpen}
                          setSuggestionsOpen={setSuggestionsOpen}
                          setVehiclePanel={setVehiclePanel}
                          setPickup={setPickup}
                          setDestination={setDestination}
                          setStops={setStops}
                          activeField={activeField}
                      />
                  </div>
                )}
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-4 py-8 pt-10 shadow-xl rounded-t-2xl'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-4 py-6 pt-10 shadow-xl rounded-t-2xl'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-4 py-6 pt-10 shadow-xl rounded-t-2xl'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0  bg-white px-4 py-6 pt-10 shadow-xl rounded-t-2xl'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver}
                    showOtpInput={showOtpInput} />
            </div>


        </div>
    )
}

export default Home
