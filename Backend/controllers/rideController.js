const rideService = require('../services/rideServices');
const { validationResult } = require('express-validator');
const mapService = require('../services/mapsService');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const destinationCoordinates = await mapService.getAddressCoordinate(destination);

        const ride = await rideService.createRide({ 
            user: req.user._id, 
            pickup, 
            destination, 
            vehicleType,
            pickupCoords: pickupCoordinates,
            destinationCoords: destinationCoordinates
        });
        res.status(201).json(ride);

        console.log('Pickup coordinates:', pickupCoordinates);

        const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 50); // 50km radius for testing

        // Filter captains by vehicle type
        const matchingCaptains = captainsInRadius.filter(captain => 
            captain.vehicle && captain.vehicle.vehicleType === vehicleType
        );

        console.log('Matching captains for vehicle type:', vehicleType, matchingCaptains.length);

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        matchingCaptains.forEach(captain => {
            console.log('Sending ride to captain:', captain._id, 'Socket ID:', captain.socketId);
            if (captain.socketId) {
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                })
            } else {
                console.error('Captain has no socketId:', captain._id);
            }
        })

    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        console.log('Sending ride-confirmed to user:', ride.user.socketId, ride);
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.getUserRideHistory = async (req, res) => {
    try {
        const rides = await rideModel.find({ user: req.user._id })
            .populate('captain', 'fullname')
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json(rides);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.getCaptainRideHistory = async (req, res) => {
    try {
        const rides = await rideModel.find({ captain: req.captain._id })
            .populate('user', 'fullname')
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json(rides);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}