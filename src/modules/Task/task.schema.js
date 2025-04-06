const joi = require('joi');

const taskSchemaValidation = joi.object({
    title: joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'Title must be at least 3 characters',
            'string.max': 'Title must not exceed 100 characters',
            'any.required': 'Title is required'
        }),

    description: joi.string()
        .trim()
        .min(10)
        .required()
        .messages({
            'string.min': 'Description must be at least 10 characters',
            'any.required': 'Description is required'
        }),

    category: joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid category ID format',
            'any.required': 'Category is required'
        }),

    dueDate: joi.date()
        .min('now')
        .required()
        .messages({
            'date.min': 'Due date cannot be in the past',
            'any.required': 'Due date is required'
        }),

    priority: joi.string()
        .valid('low', 'medium', 'high')
        .default('medium')
        .messages({
            'any.only': 'Priority must be either low, medium, or high'
        }),

    status: joi.string()
        .valid('todo', 'in-progress', 'completed')
        .default('todo')
        .messages({
            'any.only': 'Status must be either todo, in-progress, or completed'
        }),

    tags: joi.array()
        .items(joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .messages({
            'string.pattern.base': 'Invalid tag ID format'
        })
});

const updateTaskStatusSchema = joi.object({
    status: joi.string()
        .valid('todo', 'in-progress', 'completed')
        .required()
        .messages({
            'any.only': 'Status must be either todo, in-progress, or completed',
            'any.required': 'Status is required'
        })
});

module.exports = {
    taskSchemaValidation,
    updateTaskStatusSchema
};