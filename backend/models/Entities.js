const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    place_id: { type: String, required: true, unique: true },
    city_id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String },
    description: { type: String },
    timing: { type: String },
    entry_fee: { type: String },
    map_link: { type: String },
    image_url: { type: String }
});

const foodSchema = new mongoose.Schema({
    food_id: { type: String, required: true, unique: true },
    city_id: { type: String, required: true },
    name: { type: String, required: true },
    specialty: { type: String },
    map_link: { type: String },
    description: { type: String },
    image_url: { type: String }
});

const shoppingSchema = new mongoose.Schema({
    shop_id: { type: String, required: true, unique: true },
    city_id: { type: String, required: true },
    name: { type: String },
    map_link: { type: String },
    famous_for: { type: String },
    best_time: { type: String },
    description: { type: String },
    image_url: { type: String }
});

const natureSchema = new mongoose.Schema({
    nature_id: { type: String, required: true, unique: true },
    city_id: { type: String, required: true },
    name: { type: String },
    activity: { type: String },
    best_time: { type: String },
    map_link: { type: String },
    description: { type: String },
    image_url: { type: String }
});

const itinerarySchema = new mongoose.Schema({
    itinerary_id: { type: String, required: true, unique: true },
    city_id: { type: String, required: true },
    duration: { type: String },
    morning: { type: String },
    afternoon: { type: String },
    evening: { type: String },
    notes: { type: String }
});

module.exports = {
    Place: mongoose.model('Place', placeSchema),
    Food: mongoose.model('Food', foodSchema),
    Shopping: mongoose.model('Shopping', shoppingSchema),
    Nature: mongoose.model('Nature', natureSchema),
    Itinerary: mongoose.model('Itinerary', itinerarySchema)
};
