const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    day: {
        type: Number, // duration (Day 1, Day 2, etc.)
        required: true
    },
    title: {
        type: String, // e.g., "Exploring the Pink City"
        required: true
    },
    activities: [{
        time: String,
        location: String,
        description: String
    }],
    tips: [String]
});

module.exports = mongoose.model('Itinerary', itinerarySchema);