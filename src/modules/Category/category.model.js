const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    description: {
        type: String,
        // required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    // tasks: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Task'
    // }]
}, {
    timestamps: true
})


module.exports = mongoose.model('Category', categorySchema);