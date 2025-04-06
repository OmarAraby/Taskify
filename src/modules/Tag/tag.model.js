const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tag name is required'],
        trim: true,
        minlength: [2, 'Tag name must be at least 2 characters'],
        maxlength: [30, 'Tag name must be at most 30 characters'],
        unique: true
    },
    color: {
        type: String,
        default: '#000000',
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color code']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Tag', tagSchema);