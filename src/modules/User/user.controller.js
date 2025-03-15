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


// login user

const login = asyncHandler(async(req,res,next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password');  // select password field

    if(!user){
        throw new APIError('Email Or Password are invalid',401)
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new APIError('Email Or Password are invalid',401)
    }

    const tokenPayload={
        username: user.username,
        email: user.email,
        id: user._id,
        role:user.role,
        loggedAt:new Date().toISOString()
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION})

    res.json({
        success: true,
        message: 'User logged in successfully',
        token,
        user: {
            // id: user._id,
            username: user.username,
            email: user.email,
        }
    })
})




module.exports = {
    register,
    login
}   