const rideModel = require("../models/ride.model");
const mapService = require("./mapsService");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

async function getFare(pickup, destination, stops = []) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  // Build full path: pickup -> ...stops -> destination
  const waypoints = [pickup, ...(Array.isArray(stops) ? stops : []), destination];

  // Sum distance and duration across adjacent segments
  let totalDistance = 0; // meters
  let totalDuration = 0; // seconds
  for (let i = 0; i < waypoints.length - 1; i++) {
    const seg = await mapService.getDistanceTime(waypoints[i], waypoints[i + 1]);
    totalDistance += seg.distance;
    totalDuration += seg.duration;
  }

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

  const additionalStopFee = 5; // optional small fee per extra stop
  const extraStopsCount = Math.max(0, waypoints.length - 2 - 0); // exclude pickup and destination

  const fare = {
    auto: Math.round(
      baseFare.auto +
        (totalDistance / 1000) * perKmRate.auto +
        (totalDuration / 60) * perMinuteRate.auto +
        additionalStopFee * extraStopsCount
    ),
    car: Math.round(
      baseFare.car +
        (totalDistance / 1000) * perKmRate.car +
        (totalDuration / 60) * perMinuteRate.car +
        additionalStopFee * extraStopsCount
    ),
    motorcycle: Math.round(
      baseFare.motorcycle +
        (totalDistance / 1000) * perKmRate.motorcycle +
        (totalDuration / 60) * perMinuteRate.motorcycle +
        additionalStopFee * extraStopsCount
    ),
  };

  return { fare, totalDistance, totalDuration };
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
  stops = [],
  stopsCoords = [],
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  // Ensure we have coordinates for stops if not provided
  if (!stopsCoords.length && stops.length) {
    const mapServiceLocal = require('./mapsService');
    stopsCoords = [];
    for (const addr of stops) {
      const c = await mapServiceLocal.getAddressCoordinate(addr);
      stopsCoords.push(c);
    }
  }

  const fareResult = await getFare(pickup, destination, stops);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    stops,
    pickupCoords,
    stopsCoords,
    destinationCoords,
    otp: getOtp(6),
    fare: fareResult.fare[vehicleType],
    distance: fareResult.totalDistance,
    duration: fareResult.totalDuration,
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
