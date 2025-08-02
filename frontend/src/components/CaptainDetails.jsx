import React, { useContext, useState, useEffect } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const CaptainDetails = () => {
    const [stats, setStats] = useState({
        totalTrips: 0,
        totalEarnings: 0,
        totalHours: 0,
        totalDistance: 0
    });

    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/stats`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching captain stats:', error);
            }
        };

        if (captain?._id) {
            fetchStats();
        }
    }, [captain?._id]);

    return (
        <div className='space-y-4'>
            {/* Profile and Earnings */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <img className='h-12 w-12 rounded-full object-cover border-2 border-gray-200' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <div>
                        <h4 className='text-lg font-semibold capitalize'>{captain?.fullname?.firstname + " " + captain?.fullname?.lastname}</h4>
                        <p className='text-sm text-gray-600'>Online</p>
                    </div>
                </div>
                                        <div className='text-right'>
                            <h4 className='text-2xl font-bold text-green-600'>₹{stats.totalEarnings}</h4>
                            <p className='text-sm text-gray-600'>Total Earnings</p>
                        </div>
            </div>
            
            {/* Stats Grid */}
                                <div className='grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4'>
                        <div className='text-center'>
                            <i className="text-2xl mb-2 text-blue-600 ri-timer-2-line"></i>
                            <h5 className='text-lg font-semibold'>{stats.totalTrips}</h5>
                            <p className='text-xs text-gray-600'>Total Trips</p>
                        </div>
                        <div className='text-center'>
                            <i className="text-2xl mb-2 text-green-600 ri-speed-up-line"></i>
                            <h5 className='text-lg font-semibold'>{stats.totalHours}</h5>
                            <p className='text-xs text-gray-600'>Hours Online</p>
                        </div>
                        <div className='text-center'>
                            <i className="text-2xl mb-2 text-purple-600 ri-booklet-line"></i>
                            <h5 className='text-lg font-semibold'>{stats.totalDistance}km</h5>
                            <p className='text-xs text-gray-600'>Total Distance</p>
                        </div>
                    </div>
            
            {/* Status Indicator */}
            <div className='text-center'>
                <div className='inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg'>
                    <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                    <span className='text-sm font-medium'>Online & Available</span>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails