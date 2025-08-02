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

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

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

    async function confirmRide() {

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
            <div className='fixed p-4 top-0 flex items-center justify-between w-full z-20 bg-white shadow-sm'>
                <img className='w-12 h-12' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />
                <Link to='/captain-login' className='h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            
            {/* Map Section */}
            <div className='flex-1 relative mt-16'>
                <LiveTracking 
                    className="h-full w-full"
                    isCaptain={true}
                    pickupCoords={ride?.pickupCoords ? { lat: ride.pickupCoords.ltd, lng: ride.pickupCoords.lng } : null}
                    destinationCoords={ride?.destinationCoords ? { lat: ride.destinationCoords.ltd, lng: ride.destinationCoords.lng } : null}
                />

            </div>
            
            {/* Captain Details Section */}
            <div className='bg-white border-t border-gray-200 p-4 max-h-48 overflow-y-auto'>
                <CaptainDetails />
            </div>
            
            {/* Ride Popup */}
            <div ref={ridePopupPanelRef} className='fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 shadow-2xl border-t-2 border-gray-200 transition-transform duration-300 ease-in-out'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            
            {/* Confirm Ride Popup */}
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 transition-transform duration-300 ease-in-out'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome