// backend/models/Shopping.js
const mongoose = require('mongoose');

const shoppingSchema = new mongoose.Schema({
    shop_id: { 
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
    map_link: { type: String },
    famous_for: { type: String },
    best_time: { type: String }, // From your SQL file snippet
    image_url: { type: String }
});

module.exports = mongoose.model('Shopping', shoppingSchema);