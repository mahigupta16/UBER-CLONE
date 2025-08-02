const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

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

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
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