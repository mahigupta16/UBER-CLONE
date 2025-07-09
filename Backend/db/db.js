const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

function connectDB() {
    mongoose.connect(process.env.DB_CONNECT,{ })
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
}

module.exports = connectDB;