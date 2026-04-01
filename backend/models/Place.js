// backend/models/Place.js
const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    place_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    city_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'City', 
        required: true 
    },
    name: { type: String, required: true },
    type: { type: String },
    description: { type: String },
    timing: { type: String },
    entry_fee: { type: String },
    map_link: { type: String },
    image_url: { type: String }
});

module.exports = mongoose.model('Place', placeSchema);