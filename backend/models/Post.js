const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post_text: { type: String, required: true },
    post_image_url: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
