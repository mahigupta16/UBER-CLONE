import React, { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import { CaptainDataContext } from '../context/CaptainContext'

const About = ({ isOpen, onClose, userType }) => {
    const { user } = useContext(UserDataContext)
    const { captain } = useContext(CaptainDataContext)

    const currentUser = userType === 'captain' ? captain : user
    
    // Debug: Log the current user data
    console.log('About component - userType:', userType)
    console.log('About component - currentUser:', currentUser)
    console.log('About component - user context:', user)
    console.log('About component - captain context:', captain)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            {userType === 'captain' ? 'Captain Details' : 'User Details'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-slate-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    {currentUser ? (
                        <div className="space-y-4">
                            {/* Profile Section */}
                            <div className="bg-slate-50 rounded-lg p-4">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">
                                            {userType === 'captain' 
                                                ? (currentUser.fullname?.firstname?.charAt(0) || currentUser.fullName?.firstName?.charAt(0) || 'C')
                                                : (currentUser.fullname?.firstname?.charAt(0) || currentUser.fullName?.firstName?.charAt(0) || 'U')
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-800">
                                            {userType === 'captain' 
                                                ? (currentUser.fullname?.firstname && currentUser.fullname?.lastname
                                                    ? `${currentUser.fullname.firstname} ${currentUser.fullname.lastname}`
                                                    : currentUser.fullName?.firstName && currentUser.fullName?.lastName 
                                                    ? `${currentUser.fullName.firstName} ${currentUser.fullName.lastName}`
                                                    : 'Captain')
                                                : (currentUser.fullname?.firstname && currentUser.fullname?.lastname
                                                    ? `${currentUser.fullname.firstname} ${currentUser.fullname.lastname}`
                                                    : currentUser.fullName?.firstName && currentUser.fullName?.lastName 
                                                    ? `${currentUser.fullName.firstName} ${currentUser.fullName.lastName}`
                                                    : 'User')
                                            }
                                        </h3>
                                        <p className="text-slate-600">
                                            {userType === 'captain' ? 'Professional Driver' : 'Passenger'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                    <i className="ri-mail-line text-blue-500 text-lg"></i>
                                    <div>
                                        <p className="text-sm text-slate-500">Email</p>
                                        <p className="text-slate-800 font-medium">{currentUser.email || 'Not provided'}</p>
                                    </div>
                                </div>

                                {userType === 'captain' && (
                                    <>
                                        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                            <i className="ri-car-line text-blue-500 text-lg"></i>
                                            <div>
                                                <p className="text-sm text-slate-500">Vehicle Type</p>
                                                <p className="text-slate-800 font-medium">{currentUser.vehicle?.vehicleType || currentUser.vehicleType || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                            <i className="ri-palette-line text-blue-500 text-lg"></i>
                                            <div>
                                                <p className="text-sm text-slate-500">Vehicle Color</p>
                                                <p className="text-slate-800 font-medium">{currentUser.vehicle?.color || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                                            <i className="ri-id-card-line text-blue-500 text-lg"></i>
                                            <div>
                                                <p className="text-sm text-slate-500">License Plate</p>
                                                <p className="text-slate-800 font-medium">{currentUser.vehicle?.plate || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Account Info */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">Account Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Account Type:</span>
                                        <span className="text-blue-800 font-medium">
                                            {userType === 'captain' ? 'Driver' : 'Passenger'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Member Since:</span>
                                        <span className="text-blue-800 font-medium">
                                            {currentUser.createdAt 
                                                ? new Date(currentUser.createdAt).toLocaleDateString()
                                                : 'Recently'
                                            }
                                        </span>
                                    </div>
                                    {userType === 'captain' && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Total Trips:</span>
                                                <span className="text-blue-800 font-medium">
                                                    {currentUser.totalTrips || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Hours Online:</span>
                                                <span className="text-blue-800 font-medium">
                                                    {currentUser.totalHours || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-blue-700">Total Distance (km):</span>
                                                <span className="text-blue-800 font-medium">
                                                    {currentUser?.totalDistance ? Math.round(currentUser.totalDistance) : 0}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <i className="ri-user-line text-4xl text-slate-400 mb-4"></i>
                            <p className="text-slate-600">No user information available</p>
                        </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-slate-200">
                        <button
                            onClick={onClose}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About 