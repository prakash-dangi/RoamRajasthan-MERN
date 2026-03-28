const express = require('express');
const router = express.Router();
const City = require('../models/City');
const { Place, Food, Shopping, Nature, Itinerary } = require('../models/Entities');

// Get all cities
router.get('/cities', async (req, res) => {
    try {
        const cities = await City.find().sort({ city_name: 1 });
        res.json(cities);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get city by ID and its related data
router.get('/cities/:id', async (req, res) => {
    try {
        const city_id = req.params.id;
        const city = await City.findOne({ city_id });
        if (!city) return res.status(404).json({ msg: 'City not found' });
        
        const places = await Place.find({ city_id });
        const food = await Food.find({ city_id });
        const shopping = await Shopping.find({ city_id });
        const nature = await Nature.find({ city_id });
        const itineraries = await Itinerary.find({ city_id });
        
        res.json({
            city,
            places,
            food,
            shopping,
            nature,
            itineraries
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
