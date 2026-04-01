// backend/models/Entities.js
// NOTE: The models in this file have been split into separate files:
//   Place    → models/Place.js
//   Food     → models/Food.js
//   Shopping → models/Shopping.js
//
// This file is kept only as a convenience re-export so that any old code
// that imports from Entities.js still works without crashing.
// Do NOT register new mongoose.model() calls here — they live in their own files.

const Place    = require('./Place');
const Food     = require('./Food');
const Shopping = require('./Shopping');

// Nature and Itinerary have not been split out yet — kept inline here
const mongoose = require('mongoose');

const natureSchema = new mongoose.Schema({
    nature_id: { type: String, required: true, unique: true },
    city_id:   { type: String, required: true },
    name:      { type: String },
    activity:  { type: String },
    best_time: { type: String },
    map_link:  { type: String },
    description: { type: String },
    image_url: { type: String }
});

const itinerarySchema = new mongoose.Schema({
    itinerary_id: { type: String, required: true, unique: true },
    city_id:      { type: String, required: true },
    duration:     { type: String },
    morning:      { type: String },
    afternoon:    { type: String },
    evening:      { type: String },
    notes:        { type: String }
});

const Nature    = mongoose.model('Nature', natureSchema);
const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = { Place, Food, Shopping, Nature, Itinerary };
