const joi=require('joi');


const categorySchemaValidation = joi.object({
    name: joi.string().trim().min(3).max(50).required(),
    description: joi.string().trim().min(3).max(100),
    // tasks: joi.array().items(joi.string().trim().min(3).max(100))
});

module.exports = {categorySchemaValidation};