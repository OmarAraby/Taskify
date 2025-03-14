const User = require('./user.model');
const jwt = require('jsonwebtoken');
const APIError = require('../../utils/errors/APIError');
const bcrypt = require('bcrypt');
const {asyncHandler} = require('../../middlewares/errorHandler.middleware')



// register
const register = asyncHandler(async(req,res,next) => {
    const registerUser = {...req.body}
    const existingUser = await User.findOne({ email:registerUser.email});
    if(existingUser){
        throw new APIError('User already exists',400)
    }

    const createdUser = new User(registerUser);
    const user = await createdUser.save()

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: user
    })
})




module.exports = {
    register,
}