const nodemailer = require('nodemailer');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (userEmail, username) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Welcome to Taskify!',
            html: `
                <h1>Welcome to Taskify, ${username}!</h1>
                <p>Thank you for joining our community. We're excited to have you on board!</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};

const sendPasswordResetEmail = asyncHandler(async(userEmail, resetToken) => {
    const resetUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Password Reset - Taskify',
        html: `
            <h1>Reset Password Request</h1>
            <p>You requested a password reset for your Taskify account.</p>
            <p>Click the following link to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
        `
    };
    await transporter.sendMail(mailOptions);
    
});  

module.exports = { 
    sendWelcomeEmail,
    sendPasswordResetEmail
 };