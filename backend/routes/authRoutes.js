const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const { uploadProfile } = require('../middleware/upload');

// ─── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: { id: user.id, username: user.username, email: user.email, bio: user.bio, profile_image_url: user.profile_image_url }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                user: { id: user.id, username: user.username, email: user.email, bio: user.bio, profile_image_url: user.profile_image_url }
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ─── PUT /api/auth/profile (protected) — update username & bio ───────────────
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, bio } = req.body;
        const updates = {};
        if (username) {
            const existing = await User.findOne({ username });
            if (existing && existing.id !== req.user.id) {
                return res.status(400).json({ msg: 'Username already taken' });
            }
            updates.username = username;
        }
        if (bio !== undefined) updates.bio = bio;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, select: '-password' }
        );
        res.json({ user: { id: user.id, username: user.username, email: user.email, bio: user.bio, profile_image_url: user.profile_image_url } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ─── POST /api/auth/upload/photo (protected) — upload profile photo ──────────
router.post('/upload/photo', auth, (req, res) => {
    uploadProfile(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }
        try {
            // Store the URL path that the frontend can use directly
            const imageUrl = `uploads/profiles/${req.file.filename}`;
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: { profile_image_url: imageUrl } },
                { new: true, select: '-password' }
            );
            res.json({
                user: { id: user.id, username: user.username, email: user.email, bio: user.bio, profile_image_url: user.profile_image_url }
            });
        } catch (dbErr) {
            console.error(dbErr.message);
            res.status(500).json({ msg: 'Server error saving photo' });
        }
    });
});

// ─── PUT /api/auth/password (protected) — change password ───────────────────
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ msg: 'New password must be at least 6 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// ─── GET /api/auth/me/reviews (protected) — get logged-in user's reviews ────
router.get('/me/reviews', auth, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id })
            .populate('place', 'name image_url')
            .sort({ created_at: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
