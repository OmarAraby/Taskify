const APIError = require('../utils/errors/APIError');


const asyncHandler =(api)=>{
    return async (req,res,next)=>{
        try{
            await api(req,res,next);
        }catch(err){
            console.log(`Error: ${err.message}`);

            // handle known err
            if (err instanceof APIError){
                return res.status(err.statusCode).json(err.toJson());
            }

            // handle unknown error
          const error = new APIError(err.message||'Internal server errrrror',err.statusCode||500);
          return res.status(error.statusCode).json(error.toJson());
        }
            
    }
}

////// global error handler
const globalErrorHandler= (err,req,res,next)=>{
    console.error(`Error: ${err.message}`) // debugging

    if(err instanceof APIError){
        return res.status(err.statusCode).json(err.toJson());
    }


    // unexpected errors

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Sssssserver Error",
        error: {
            statusCode: err.statusCode || 500,
            timestamp: new Date().toISOString()
        }
    });
}

module.exports = {
    asyncHandler,
    globalErrorHandler
};