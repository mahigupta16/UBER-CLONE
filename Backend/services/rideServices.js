const rideModel = require("../models/ride.model");
const mapService = require("./mapsService");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  const baseFare = {
    auto: 30,
    car: 50,
    motorcycle: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    motorcycle: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    motorcycle: 1.5,
  };

  const fare = {
    auto: Math.round(
      baseFare.auto +
        (distanceTime.distance / 1000) * perKmRate.auto +
        (distanceTime.duration / 60) * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        (distanceTime.distance / 1000) * perKmRate.car +
        (distanceTime.duration / 60) * perMinuteRate.car
    ),
    motorcycle: Math.round(
      baseFare.motorcycle +
        (distanceTime.distance / 1000) * perKmRate.motorcycle +
        (distanceTime.duration / 60) * perMinuteRate.motorcycle
    ),
  };

  return fare;
}

module.exports.getFare = getFare;

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
  pickupCoords,
  destinationCoords,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);
  const distanceTime = await require('./mapsService').getDistanceTime(pickup, destination);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    pickupCoords,
    destinationCoords,
    otp: getOtp(6),
    fare: fare[vehicleType],
    distance: distanceTime.distance,
    duration: distanceTime.duration,
  });

  return ride;
};

module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "accepted",
      captain: captain._id,
    }
  );

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  );

  return ride;
};

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  await rideModel.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
    }
  );

  // Update captain stats
  const captainModel = require('../models/captain.model');
  await captainModel.findByIdAndUpdate(captain._id, {
    $inc: {
      totalTrips: 1,
      totalEarnings: ride.fare,
      totalDistance: Math.round((ride.distance || 0) / 1000), // Convert meters to km and round to whole number
      totalHours: Math.round((ride.duration || 0) / 3600) // Convert seconds to hours, round to whole number
    }
  });

  return ride;
};
