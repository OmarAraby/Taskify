const Joi = require('joi');

const validateSchema = (schema) => {
    return (req, res, next) => {
        console.log('Incoming request body:', req.body);
        
        try {
            // Check if schema is a valid Joi schema
            if (!schema || !schema.validate) {
                console.error('Invalid schema provided');
                return res.status(500).json({
                    success: false,
                    message: 'Server configuration error',
                    error: 'Invalid validation schema'
                });
            }

            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                console.log('Validation error:', error);
                const errors = error.details.map(err => ({
                    field: err.path[0],
                    message: err.message,
                }));
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    details: errors,
                });
            }

            console.log('Validated body:', value);
            req.body = value;
            next();
        } catch (error) {
            console.error('Validation middleware error:', error);
            return res.status(500).json({
                success: false,
                message: 'Validation middleware error',
                error: error.message
            });
        }
    };
};

module.exports = validateSchema;