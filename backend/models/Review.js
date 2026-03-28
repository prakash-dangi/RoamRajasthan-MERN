const mongoose = require('mongoose');

const reviewReplySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reply_text: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
    place_id: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    review_text: { type: String },
    photos: [{ type: String }],
    replies: [reviewReplySchema],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
