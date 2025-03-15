
const joi = require('joi');

const userSchemaValidation = joi.object({
    username: joi.string()
        .trim()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username must be at most 30 characters'
        }),
    email: joi.string()
        .trim()
        .email({ tlds: false })
        .required()
        .messages({
            'string.email': 'Email does not match required format'
        }),
    password: joi.string()
        .trim()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
        }),
    role: joi.string()
        .valid('user', 'admin')
        .default('user')
        .messages({
            'any.only': 'Role must be either user or admin'
        })
});


// login validation

const loginSchemaValidation = joi.object({
    email: joi.string()
       .trim()
       .email({ tlds: false })
       .required()
       .messages({
            'string.email': 'Email does not match required format'
        }),
    password: joi.string()
       .trim()
       .min(8)
       .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/)
       .required()
       .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character'
        })
});

module.exports = {
     userSchemaValidation ,
     loginSchemaValidation

};

