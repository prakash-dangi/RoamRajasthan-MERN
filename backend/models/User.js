// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { // Maps to password_hash in your SQL
        type: String, 
        required: true 
    },
    profile_image_url: { 
        type: String, 
        default: 'images/default_profile.png' 
    },
    bio: { 
        type: String 
    }
}, { timestamps: true }); // timestamps: true automatically adds created_at and updated_at

module.exports = mongoose.model('User', userSchema);