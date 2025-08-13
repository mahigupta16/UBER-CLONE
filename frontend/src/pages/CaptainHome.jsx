import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'
import About from '../components/About'
import { ThemeContext } from '../context/ThemeContext'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)
    const [ menuOpen, setMenuOpen ] = useState(false)
    const [ aboutOpen, setAboutOpen ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

    // Debug state changes
    useEffect(() => {
        console.log('Ride popup panel state:', ridePopupPanel);
        console.log('Ride data:', ride);
    }, [ridePopupPanel, ride]);

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)
    const { theme, toggleTheme } = useContext(ThemeContext)

    useEffect(() => {
        if (!captain?._id) {
            console.log('Captain not loaded yet');
            return;
        }
        
        console.log('Captain joining socket:', captain._id);
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })
        
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    console.log('Updating captain location:', position.coords);
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                }, (error) => {
                    console.error('Error getting location:', error);
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        return () => clearInterval(locationInterval)
    }, [captain?._id, socket])

    useEffect(() => {
        const handleNewRide = (data) => {
            console.log('New ride received:', data);
            console.log('Setting ride popup to true');
            setRide(data)
            setRidePopupPanel(true)
        };

        socket.on('new-ride', handleNewRide);

        return () => {
            socket.off('new-ride', handleNewRide);
        };
    }, [socket]);

    useEffect(() => {
        const handleRideCancelled = (data) => {
            alert('The ride was cancelled.');
            setRidePopupPanel(false);
            setConfirmRidePopupPanel(false);
            setRide(null);
            window.location.href = '/captain-home';
        };
        socket.on('ride-cancelled', handleRideCancelled);
        return () => {
            socket.off('ride-cancelled', handleRideCancelled);
        };
    }, [socket]);

    async function confirmRide() {
        if (!captain?._id || !ride?._id) {
            console.error('Missing captain or ride data');
            return;
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }


    useEffect(() => {
        if (ridePopupPanel && ridePopupPanelRef.current) {
            ridePopupPanelRef.current.style.transform = 'translateY(0)'
        } else if (ridePopupPanelRef.current) {
            ridePopupPanelRef.current.style.transform = 'translateY(100%)'
        }
    }, [ridePopupPanel])

    useEffect(() => {
        if (confirmRidePopupPanel && confirmRidePopupPanelRef.current) {
            confirmRidePopupPanelRef.current.style.transform = 'translateY(0)'
        } else if (confirmRidePopupPanelRef.current) {
            confirmRidePopupPanelRef.current.style.transform = 'translateY(100%)'
        }
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen flex flex-col'>
            {/* Header */}
            <div className='fixed top-0 left-0 flex items-center justify-between w-full z-[3000] bg-transparent h-16 px-4 pointer-events-none'>
                <img className='w-12 h-12 object-contain ml-2 pointer-events-auto' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="Captain Icon" />
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
                        <div className='absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-slate-200 min-w-48 py-2 z-[3100]'>
                            <button 
                                onClick={() => {
                                    setAboutOpen(true)
                                    setMenuOpen(false)
                                }}
                                className='flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700 w-full text-left'
                            >
                                <i className="ri-user-line"></i>
                                <span>About</span>
                            </button>
                            <Link 
                                to='/captain-ride-history' 
                                className='flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-slate-700'
                                onClick={() => setMenuOpen(false)}
                            >
                                <i className="ri-history-line"></i>
                                <span>Ride History</span>
                            </Link>
                            <Link 
                                to='/captain-login' 
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
            
            {/* Map Section */}
            <div className='flex-1 relative mt-16'>
                <LiveTracking
                    className="h-full w-full"
                    isCaptain={true}
                    pickupCoords={ride?.pickupCoords ? { lat: ride.pickupCoords.ltd, lng: ride.pickupCoords.lng } : null}
                    destinationCoords={ride?.destinationCoords ? { lat: ride.destinationCoords.ltd, lng: ride.destinationCoords.lng } : null}
                    stopsCoords={ride?.stopsCoords ? ride.stopsCoords.map(s => ({ lat: s.ltd, lng: s.lng })) : []}
                />

            </div>
            
            {/* Captain Details Section */}
            <div className='bg-white border-t border-slate-200 p-4 max-h-48 overflow-y-auto shadow-md pointer-events-auto'>
                <CaptainDetails />
            </div>
            
            {/* Ride Popup */}
            <div ref={ridePopupPanelRef} className='fixed left-0 right-0 bottom-0 z-[2500] translate-y-full bg-white px-3 py-8 pt-10 shadow-xl border-t-2 border-slate-200 transition-transform duration-300 ease-in-out rounded-t-2xl h-[88vh] max-h-[92vh] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0.75rem)] pointer-events-auto'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            
            {/* Confirm Ride Popup */}
            <div ref={confirmRidePopupPanelRef} className='fixed left-0 right-0 bottom-0 z-[2500] translate-y-full bg-white px-3 pt-10 shadow-xl border-t-2 border-slate-200 transition-transform duration-300 ease-in-out rounded-t-2xl h-[88vh] max-h-[92vh] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0.75rem)] pointer-events-auto'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
            
            {/* About Modal */}
            <About 
                isOpen={aboutOpen}
                onClose={() => setAboutOpen(false)}
                userType="captain"
            />
        </div>
    )
}

export default CaptainHome