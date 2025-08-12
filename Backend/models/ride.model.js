const mongoose = require('mongoose');


const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickup: {
        type: String,
        required: true,
    },
    // Optional intermediate stops (addresses)
    stops: {
        type: [String],
        default: [],
    },
    destination: {
        type: String,
        required: true,
    },
    pickupCoords: {
        ltd: { type: Number },
        lng: { type: Number }
    },
    // Coordinates for intermediate stops (if any)
    stopsCoords: {
        type: [
            new mongoose.Schema({
                ltd: { type: Number },
                lng: { type: Number }
            }, { _id: false })
        ],
        default: [],
    },
    destinationCoords: {
        ltd: { type: Number },
        lng: { type: Number }
    },
    fare: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [ 'pending', 'accepted', "ongoing", 'completed', 'cancelled' ],
        default: 'pending',
    },

    duration: {
        type: Number,
    }, // in seconds

    distance: {
        type: Number,
    }, // in meters

    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },

    otp: {
        type: String,
        select: false,
        required: true,
    },
})

module.exports = mongoose.model('ride', rideSchema);