const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');

//Connecting to the database
const connectDB = require('./db/db');
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.use('/users',userRoutes)

module.exports = app;