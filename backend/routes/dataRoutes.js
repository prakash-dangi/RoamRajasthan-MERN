// backend/routes/dataRoutes.js
const express = require('express');
const router = express.Router();

// Import our new, individual Mongoose models
const City = require('../models/City');
const Place = require('../models/Place');
const Review = require('../models/Review');
const Food = require('../models/Food');
const Shopping = require('../models/Shopping');
const Itinerary = require('../models/Itinerary');
const { uploadReview } = require('../middleware/upload');

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

// Get a single place with its reviews
router.get('/place/:id', async (req, res) => {
  try {
    // 1. Find the place by ID
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // 2. Find all reviews linked to this place
    // We 'populate' user to get the username/image instead of just an ID
    const reviews = await Review.find({ place: req.params.id })
      .populate('user', 'username profile_image_url')
      .populate('replies.user', 'username profile_image_url')
      .sort({ created_at: -1 });

    // 3. Send both back to the frontend
    res.json({ place, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error fetching place details" });
  }
});

// Post a new review (supports optional photo uploads via multipart/form-data)
router.post('/reviews', (req, res) => {
  uploadReview(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ message: uploadErr.message });
    }
    const { placeId, userId, rating, review_text } = req.body;
    try {
      // Build array of image paths for any uploaded files
      const images = req.files ? req.files.map(f => `uploads/reviews/${f.filename}`) : [];
      const newReview = new Review({ place: placeId, user: userId, rating, review_text, images });
      await newReview.save();
      res.status(201).json(newReview);
    } catch (err) {
      console.error('Error posting review:', err);
      res.status(400).json({ message: 'Error posting review' });
    }
  });
});

// Post a reply to a review
router.post('/reviews/:id/reply', async (req, res) => {
  const { userId, reply_text } = req.body;
  try {
    const review = await Review.findById(req.params.id);
    review.replies.push({ user: userId, reply_text });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: "Error posting reply" });
  }
});

// Get all itineraries grouped by city
router.get('/itineraries', async (req, res) => {
    try {
        const itineraries = await Itinerary.find().populate('cityId', 'city_name image_url');
        res.json(itineraries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get specific itinerary for a city
router.get('/itinerary/:cityId', async (req, res) => {
    try {
        const itinerary = await Itinerary.find({ cityId: req.params.cityId }).sort('day');
        res.json(itinerary);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;