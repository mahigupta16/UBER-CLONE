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
                    <img className='h-12 w-12 rounded-full object-cover border-2 border-slate-200 shadow-sm' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="Captain Profile" />
                    <div>
                        <h4 className='text-lg font-bold capitalize text-slate-800'>{captain?.fullname?.firstname + " " + captain?.fullname?.lastname}</h4>
                        <p className='text-sm text-slate-600 font-medium'>Online</p>
                    </div>
                </div>
                <div className='text-right'>
                    <h4 className='text-2xl font-bold text-lime-500'>₹{stats.totalEarnings}</h4>
                    <p className='text-sm text-slate-600 font-medium'>Total Earnings</p>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className='grid grid-cols-3 gap-3 bg-slate-50 rounded-xl p-4 shadow-sm'>
                <div className='text-center'>
                    <i className="text-2xl mb-2 text-blue-500 ri-timer-2-line"></i>
                    <h5 className='text-lg font-bold text-slate-800'>{stats.totalTrips}</h5>
                    <p className='text-xs text-slate-600 font-medium'>Total Trips</p>
                </div>
                <div className='text-center'>
                    <i className="text-2xl mb-2 text-lime-500 ri-speed-up-line"></i>
                    <h5 className='text-lg font-bold text-slate-800'>{stats.totalHours}</h5>
                    <p className='text-xs text-slate-600 font-medium'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-2xl mb-2 text-slate-500 ri-booklet-line"></i>
                    <h5 className='text-lg font-bold text-slate-800'>{Math.round(stats.totalDistance || 0)}</h5>
                    <p className='text-xs text-slate-600 font-medium'>Total Distance (km)</p>
                </div>
            </div>
            
            {/* Status Indicator */}
            <div className='text-center'>
                <div className='inline-flex items-center gap-2 bg-lime-100 text-lime-800 px-4 py-2 rounded-lg shadow-sm'>
                    <div className='w-2 h-2 bg-lime-500 rounded-full animate-pulse'></div>
                    <span className='text-sm font-semibold'>Online & Available</span>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails