const axios = require('axios');
const captainModel = require('../models/captain.model');

const ORS_API_KEY = process.env.ORS_API_KEY;

// Get coordinates from address or "lat,lng" string
module.exports.getAddressCoordinate = async (address) => {
    try {
        // If input looks like a "lat,lng" string, parse directly to avoid geocoding
        if (typeof address === 'string' && address.includes(',')) {
            const parts = address.split(',').map(s => s.trim());
            if (parts.length === 2) {
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                if (!Number.isNaN(lat) && !Number.isNaN(lng) && lat <= 90 && lat >= -90 && lng <= 180 && lng >= -180) {
                    return { ltd: lat, lng };
                }
            }
        }

        const url = `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(address)}`;
        const response = await axios.get(url);
        const features = response.data.features;

        if (features.length > 0) {
            const [lng, lat] = features[0].geometry.coordinates;
            return {
                ltd: lat,
                lng: lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Get distance and time from origin to destination
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        // Get coordinates of origin and destination (supports address or "lat,lng")
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destinationCoords = await module.exports.getAddressCoordinate(destination);

        const url = 'https://api.openrouteservice.org/v2/matrix/driving-car';

        const body = {
            locations: [
                [originCoords.lng, originCoords.ltd],
                [destinationCoords.lng, destinationCoords.ltd]
            ],
            metrics: ['distance', 'duration']
        };

        const headers = {
            Authorization: ORS_API_KEY,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(url, body, { headers });

        if (!response.data || !response.data.distances) {
            throw new Error('No routes found');
        }

        return {
            distance: response.data.distances[0][1], // in meters
            duration: response.data.durations[0][1]  // in seconds
        };

    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Get address autocomplete suggestions
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${ORS_API_KEY}&text=${encodeURIComponent(input)}`;

    try {
        const response = await axios.get(url);
        console.log('ORS API response:', response.data);
        
        if (response.data && response.data.features && response.data.features.length > 0) {
            return response.data.features.map(f => f.properties.label).filter(Boolean);
        } else {
            console.log('No suggestions found for:', input);
            return [];
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error.response?.data || error.message);
        return [];
    }
};

// Get captains in radius
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    console.log('Searching for captains at coordinates:', { ltd, lng, radius });
    
    // First, let's see all captains
    const allCaptains = await captainModel.find({});
    console.log('All captains in database:', allCaptains.map(c => ({
        id: c._id,
        status: c.status,
        socketId: c.socketId,
        location: c.location
    })));
    
    // Then search with geospatial query
    const captainsInRadius = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, ltd], radius / 6371]
            }
        },
        status: 'active' // Only get active captains
    });
    
    console.log('Captains found in radius:', captainsInRadius.length);
    console.log('Captains in radius details:', captainsInRadius.map(c => ({
        id: c._id,
        status: c.status,
        socketId: c.socketId,
        location: c.location
    })));
    
    return captainsInRadius;
};
