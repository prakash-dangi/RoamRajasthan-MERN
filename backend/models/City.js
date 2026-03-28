const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    city_id: { type: String, required: true, unique: true },
    city_name: { type: String, required: true },
    name: { type: String },
    description: { type: String },
    best_time: { type: String },
    air: { type: String },
    train: { type: String },
    road: { type: String },
    map_link: { type: String },
    image_url: { type: String }
});

module.exports = mongoose.model('City', citySchema);
