// handle User model
const mongoose = require('mongoose');
const bcrypt =require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        trim: true,
        minlength: [3,"Name must be at least 3 characters"],
        maxlength: [30,"Name must be at most 30 characters"]
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/[a-zA-Z0-9_%+]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}/, 'Invalid email format'] ,
    },
    password:{
        type: String,
        required: true,
        minlength: [8,"Password must be at least 8 characters"],
        match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/, 'Invalid Password format'],
        select: false // will not include in my query results
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user' 
    },
    profileImage:{
        type: String,
    },
    passwordResetToken:String,
    passwordResetExpires:Date

    // tasks:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Task'
    // }]
}, {timestamps:true});   // add createdAt and UpdatedAt properties by default


// hashing password before saving it to the database
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    // Hash password
    this.password = await bcrypt.hash(this.password, 6);
    next();
});

module.exports = mongoose.model('User',userSchema);