const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname:{   //it is an object to store first and last name
        firstname:{
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname:{
            type: String,
            required: true,
            minlength: [3, 'Last name must be at least 3 characters long'],
        }
    },
    email:{
        type:String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password:{
        type: String,
        required: true,
        select: false, // Do not return password in queries
    },
    socketId:{
        type:String
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });  
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}


module.exports = mongoose.model('user', userSchema);