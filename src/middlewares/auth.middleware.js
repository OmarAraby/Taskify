const APIError = require('../utils/errors/APIError');
const jwt = require('jsonwebtoken');


// adding protection MW to verify user permissions
const protectionMW = (req, res, next) => {
    try {
        // check req has a authentication header
        const auth = req.headers.authorization;
        if (!auth) {
            throw new APIError('You are not authorized', 401);
        }

        // verify token 
        const token = auth.split(' ')[1];
        try {
            // we need to decode the token to get payload information
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new APIError('Token has expired, please login again', 401);
            }
            throw new APIError('Invalid token', 401);
        }
    } catch (error) {
        next(error);
    }
}

// role middleware 
const roleMiddleware = (role) => {
    return (req,res,next) => {
        if(req.user.role===role){
            next();
        }else{
            throw new APIError('You are not authorized to perform this action',403);
        }
    }
}



module.exports = {protectionMW,roleMiddleware};