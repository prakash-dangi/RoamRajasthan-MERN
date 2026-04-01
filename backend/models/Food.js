// backend/models/Food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    food_id: { 
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
    specialty: { type: String },
    map_link: { type: String },
    description: { type: String },
    image_url: { type: String }
});

module.exports = mongoose.model('Food', foodSchema);