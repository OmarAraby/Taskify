// to handle api errors
class APIError extends Error{
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.success = false;
        this.statusCode = statusCode;
    }
    toJson() {
        return {
            success: this.success,
            message: this.message,
            // statusCode: this.statusCode
            error:{
                statusCode: this.statusCode,
                timestamp: new Date().toISOString(),
            }
        };
    }
}


module.exports = APIError;