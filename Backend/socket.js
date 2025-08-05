const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                console.log('Socket join event:', { userId, userType, socketId: socket.id });

                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    console.log('User joined:', userId);
                } else if (userType === 'captain') {
                    const updatedCaptain = await captainModel.findByIdAndUpdate(userId, { 
                        socketId: socket.id,
                        status: 'active' // Ensure captain is active
                    }, { new: true });
                    console.log('Captain joined:', userId, 'Socket ID:', socket.id, 'Status:', updatedCaptain.status);
                }
            } catch (error) {
                console.error('Error in join socket event:', error);
                socket.emit('error', { message: 'Failed to join' });
            }
        });

        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;
                console.log('Updating captain location:', { userId, location });

                if (!location || !location.ltd || !location.lng) {
                    console.error('Invalid location data:', location);
                    return socket.emit('error', { message: 'Invalid location data' });
                }

                const updatedCaptain = await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        type: 'Point',
                        coordinates: [location.lng, location.ltd]
                    }
                }, { new: true });

                console.log('Captain location updated:', updatedCaptain._id);
            } catch (error) {
                console.error('Error in update-location-captain socket event:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        // Handle ride cancellation
        socket.on('cancel-ride', async (data) => {
            try {
                const { rideId, userId, captainId } = data;
                console.log('Ride cancellation requested:', { rideId, userId, captainId });

                // Find the ride and update its status
                const ride = await rideModel.findById(rideId).populate('user captain');
                if (!ride) {
                    console.error('Ride not found:', rideId);
                    return;
                }

                // Update ride status to cancelled
                await rideModel.findByIdAndUpdate(rideId, { status: 'cancelled' });

                // Emit cancellation to both user and captain
                if (ride.user && ride.user.socketId) {
                    sendMessageToSocketId(ride.user.socketId, {
                        event: 'ride-cancelled',
                        data: { rideId, reason: 'Ride cancelled' }
                    });
                }

                if (ride.captain && ride.captain.socketId) {
                    sendMessageToSocketId(ride.captain.socketId, {
                        event: 'ride-cancelled',
                        data: { rideId, reason: 'Ride cancelled' }
                    });
                }

                console.log('Ride cancellation completed for ride:', rideId);
            } catch (error) {
                console.error('Error in cancel-ride socket event:', error);
                socket.emit('error', { message: 'Failed to cancel ride' });
            }
        });

        // Handle live location updates during rides
        socket.on('update-ride-location', async (data) => {
            try {
                const { rideId, location, userType } = data;
                console.log('Live location update:', { rideId, userType, location });

                const ride = await rideModel.findById(rideId).populate('user captain');
                if (!ride || ride.status !== 'ongoing') {
                    console.error('Ride not found or not ongoing:', rideId);
                    return;
                }

                // Broadcast location to the other party
                if (userType === 'captain' && ride.user && ride.user.socketId) {
                    sendMessageToSocketId(ride.user.socketId, {
                        event: 'captain-location-update',
                        data: { rideId, location }
                    });
                } else if (userType === 'user' && ride.captain && ride.captain.socketId) {
                    sendMessageToSocketId(ride.captain.socketId, {
                        event: 'user-location-update',
                        data: { rideId, location }
                    });
                }
            } catch (error) {
                console.error('Error in update-ride-location socket event:', error);
                socket.emit('error', { message: 'Failed to update ride location' });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            
            try {
                // Update user/captain status on disconnect
                const user = await userModel.findOneAndUpdate(
                    { socketId: socket.id },
                    { socketId: null },
                    { new: true }
                );
                
                if (user) {
                    console.log('User disconnected:', user._id);
                } else {
                    const captain = await captainModel.findOneAndUpdate(
                        { socketId: socket.id },
                        { socketId: null, status: 'inactive' },
                        { new: true }
                    );
                    
                    if (captain) {
                        console.log('Captain disconnected:', captain._id);
                    }
                }
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log('Sending message to socket:', socketId, messageObject);

    if (!socketId) {
        console.error('No socketId provided for message:', messageObject);
        return;
    }

    if (io) {
        // Check if the socket is connected
        const connectedSockets = Array.from(io.sockets.sockets.keys());
        console.log('Connected socket IDs:', connectedSockets);
        console.log('Target socket ID:', socketId);
        console.log('Socket exists:', connectedSockets.includes(socketId));
        
        io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log('Message sent successfully to socket:', socketId);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };