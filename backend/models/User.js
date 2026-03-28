const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    profile_image_url: { type: String, default: 'images/default_profile.png' },
    bio: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
