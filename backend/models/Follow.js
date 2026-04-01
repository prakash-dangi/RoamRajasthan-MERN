// backend/models/Follow.js
const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    following_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

// This replicates the `UNIQUE KEY (follower_id, following_id)` from your SQL
// It prevents a user from following the same person twice
followSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);