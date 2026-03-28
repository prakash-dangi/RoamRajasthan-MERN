const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    following_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now }
});

followSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);
