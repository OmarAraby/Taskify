const joi = require('joi');

const tagSchemaValidation = joi.object({
    name: joi.string()
        .trim()
        .min(2)
        .max(30)
        .required()
        .messages({
            'string.min': 'Tag name must be at least 2 characters',
            'string.max': 'Tag name must be at most 30 characters',
            'any.required': 'Tag name is required'
        }),
    color: joi.string()
        .trim()
        .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .default('#000000')
        .messages({
            'string.pattern.base': 'Color must be a valid hex color code'
        })
});

module.exports = { tagSchemaValidation };