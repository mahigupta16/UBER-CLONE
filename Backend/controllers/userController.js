const userModel = require('../models/user.model');
const userService = require('../services/userService');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, fullname, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });
     
     
   const token = user.generateAuthToken();

    res.status(201).json({ token, user });
}

