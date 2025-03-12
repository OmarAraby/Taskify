const joi= require('joi');

const validateSchema = (schema) => {
    return (req, res, next) => {
      try {
        const validationResult = schema.safeParse(req.body);
        if (!validationResult.success){
            const errors = validationResult.error.issues.map(err=>({  // Extract and format validation errors
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                details: errors
            });
        }
            req.body = validationResult.data;  // replace existing req.body with validated data
            next();
        
        
      } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
      }
    };  
}


module.exports = validateSchema;