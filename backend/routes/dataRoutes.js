// backend/routes/dataRoutes.js
const express = require('express');
const router = express.Router();

// Import our new, individual Mongoose models
const City = require('../models/City');
const Place = require('../models/Place');
const Food = require('../models/Food');
const Shopping = require('../models/Shopping');
// Note: If you still have Nature or Itinerary models, you would import them here too!

// 1. Get all cities
router.get('/cities', async (req, res) => {
    try {
        // Sort alphabetically by city name
        const cities = await City.find().sort({ city_name: 1 });
        res.json(cities);
    } catch (err) {
        console.error("Error fetching cities:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 2. Get a single city by its custom 'city_id' (e.g., 'C01')
router.get('/cities/:id', async (req, res) => {
    try {
        const city = await City.findOne({ city_id: req.params.id });
        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }
        res.json(city);
    } catch (err) {
        console.error(`Error fetching city ${req.params.id}:`, err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 3. Get Places for a specific city
// We first find the city, then use its MongoDB _id to find the related places
router.get('/places/city/:cityId', async (req, res) => {
    try {
        const city = await City.findOne({ city_id: req.params.cityId });
        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }
        // Use the city's _id to find places
        const places = await Place.find({ city_id: city._id });
        res.json(places);
    } catch (err) {
        console.error("Error fetching places:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 4. Get Food for a specific city
router.get('/food/city/:cityId', async (req, res) => {
    try {
        const city = await City.findOne({ city_id: req.params.cityId });
        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }
        const food = await Food.find({ city_id: city._id });
        res.json(food);
    } catch (err) {
        console.error("Error fetching food:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 5. Get Shopping for a specific city
router.get('/shopping/city/:cityId', async (req, res) => {
    try {
        const city = await City.findOne({ city_id: req.params.cityId });
        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }
        const shopping = await Shopping.find({ city_id: city._id });
        res.json(shopping);
    } catch (err) {
        console.error("Error fetching shopping:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;