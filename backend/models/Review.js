// backend/models/Review.js
const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reply_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review_text: { type: String, required: true },
  images: [{ type: String }], // Array of uploaded image paths (up to 4)
  replies: [ReplySchema],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);