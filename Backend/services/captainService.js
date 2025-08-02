const captainModel = require('../models/captain.model');


module.exports.createCaptain =async ({firstname, lastname, email, password, color, plate, capacity, vehicleType})=>{
    
    if(!firstname ||!email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    const captain = await captainModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password,
        vehicle:{
            color,
            plate,
            capacity,
            vehicleType
        },
        status: 'active', // Set captain as active by default
        location: {
            type: 'Point',
            coordinates: [0, 0] // Default location, will be updated when captain joins
        }
    })

    return captain;
}