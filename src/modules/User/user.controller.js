const User = require('./user.model');
const jwt = require('jsonwebtoken');
const APIError = require('../../utils/errors/APIError');
const bcrypt = require('bcrypt');
const {asyncHandler} = require('../../middlewares/errorHandler.middleware');
const crypto = require('crypto');
// Update imports at the top
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../../services/email.service');
const cloudinary = require('../../services/cloudinary.service');



// register
const register = asyncHandler(async(req,res,next) => {
    const registerUser = {...req.body}
    const existingUser = await User.findOne({ email:registerUser.email});
    if(existingUser){
        throw new APIError('User already exists',400)
    }

    const createdUser = new User(registerUser);
    const user = await createdUser.save()

    //welcome mail to register 
    await sendWelcomeEmail(user.email, user.username);

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
        role: user.role,
        loggedAt: new Date().toISOString()
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.json({
        success: true,
        message: 'User logged in successfully',
        token,
        user: {
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
});


// update user
const updateUser = asyncHandler(async(req, res, next) => {
    try {
        const updateData = { ...req.body };
        
        // Check if files were uploaded
        if (req.files && req.files.length > 0) {
            const imageFile = req.files.find(file => file.fieldname === 'profileImage');
            if (imageFile) {
                // Upload to cloudinary
                const result = await cloudinary.uploader.upload(imageFile.path, {
                    folder: 'Taskify/users',
                    width: 300,
                    crop: "scale"
                });
                
                // Add cloudinary URL to update data
                updateData.profileImage = result.secure_url;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            updateData,
            { new: true }
        );
        
        if (!updatedUser) {
            return next(new APIError("User not found", 404));
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error('Update error:', error);
        next(new APIError(error.message, 500));
    }
});

// get all users

const getAllUsers = asyncHandler(async(req,res,next) => {
    const users = await User.find({});
    res.json({
        success: true,
        data: users
    })
})
// delete User 
const deleteUser = asyncHandler(async(req,res,next) => {
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new APIError('User not found', 404);
    }
    res.json({
        success: true,
        message: 'User deleted successfully',
    });
})


// handle forgot pawssword

const forgotPassword = asyncHandler(async(req,res,next) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new APIError('User not found', 404);
    }

    try {
        // generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // save hashed token to user
        user.passwordResetToken = passwordResetToken;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // send email with reset password link
        await sendPasswordResetEmail(user.email, resetToken);
        
        res.status(200).json({
            success: true,
            message: 'Password reset token sent to your email'
        });
    } catch (error) {
        // Reset the token fields in case of error
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        
        console.error('Password reset error:', error);
        throw new APIError('Failed to process password reset request', 500);
    }
});

// handle rest password
const resetPassword = asyncHandler(async(req,res,next) => {
    const {resetToken} = req.params;
    const {password} = req.body;
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires:{$gt: Date.now()}
    });
    if(!user){
        throw new APIError('Invalid or expired reset token',400)
    }

    // update password
    user.password = await bcrypt.hash(password, 6);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password reset successfully'
    })
});

const changePassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
        throw new APIError('User not found', 404);
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new APIError('Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
        success: true,
        message: 'Password updated successfully'
    });
});


// delete profile image
const deleteProfileImage = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.profileImage) {
            throw new APIError("No profile image to delete", 400);
        }

        // Extract public_id from Cloudinary URL
        const publicId = user.profileImage.split('/').slice(-2).join('/').split('.')[0];
        
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(`herafyhub/users/${publicId}`);
        
        // Update user document without triggering validation
        user.profileImage = '';
        await user.save({ validateBeforeSave: false });

        res.json({
            success: true,
            message: "Profile image deleted successfully",
            user
        });
    } catch (error) {
        next(new APIError(error.message, error.statusCode || 500));
    }
});



module.exports = {
    register,
    login,
    updateUser,
    getAllUsers,
    deleteUser,
    forgotPassword,
    resetPassword,
    changePassword,
    deleteProfileImage
}