import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainRideHistory = () => {
    const [ rides, setRides ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        const fetchRideHistory = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/captain-history`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setRides(response.data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching ride history:', error)
                setLoading(false)
            }
        }

        if (captain?._id) {
            fetchRideHistory()
        }
    }, [captain])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDistance = (distanceInMeters) => {
        if (!distanceInMeters) return '0 km'
        return `${(distanceInMeters / 1000).toFixed(1)} km`
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100'
            case 'ongoing': return 'text-blue-600 bg-blue-100'
            case 'cancelled': return 'text-red-600 bg-red-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading ride history...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/captain-home" className="text-blue-600 hover:text-blue-700">
                            <i className="ri-arrow-left-line text-xl"></i>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Ride History</h1>
                    </div>
                    <img className="w-12 h-12 object-contain" src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="Captain Icon" />
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {rides.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="ri-route-line text-6xl text-gray-300 mb-4"></i>
                        <h2 className="text-xl font-semibold text-gray-600 mb-2">No rides yet</h2>
                        <p className="text-gray-500">Your ride history will appear here once you complete your first trip.</p>
                        <Link 
                            to="/captain-home" 
                            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Home
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {rides.map((ride) => (
                            <div key={ride._id} className="bg-white rounded-lg shadow-sm border p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <i className="ri-route-line text-blue-600"></i>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {ride.pickup} → {ride.stops?.length ? `${ride.stops.join(' → ')} → ` : ''}{ride.destination}
                                            </p>
                                            <p className="text-sm text-gray-500">{formatDate(ride.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-gray-900">₹{ride.fare}</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                                            {ride.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    {Array.isArray(ride.stops) && ride.stops.length > 0 && (
                                        <div className="col-span-2 text-xs text-gray-500">
                                            <span className="font-medium text-gray-700">Stops:</span> {ride.stops.join(' • ')}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium">Distance</p>
                                        <p>{formatDistance(ride.distance)}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Duration</p>
                                        <p>{Math.round((ride.duration || 0) / 60)} min</p>
                                    </div>
                                </div>

                                {ride.user && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Passenger:</span> {ride.user.fullname?.firstname} {ride.user.fullname?.lastname}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CaptainRideHistory 