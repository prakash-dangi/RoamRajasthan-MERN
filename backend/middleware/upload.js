// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// ── Storage factory ──────────────────────────────────────────────────────────
const makeStorage = (folder) => multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../uploads', folder);
        ensureDir(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // userId_timestamp.ext  (safe, unique)
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// ── File type filter ─────────────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|avif/;
    const extOk  = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error('Only image files are allowed (jpg, png, gif, webp, avif)'));
};

// ── Exported uploaders ───────────────────────────────────────────────────────
// Profile photo — single file, max 5 MB
const uploadProfile = multer({
    storage: makeStorage('profiles'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter
}).single('photo');

// Review photos — up to 4 images, max 8 MB each
const uploadReview = multer({
    storage: makeStorage('reviews'),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: imageFilter
}).array('photos', 4);

module.exports = { uploadProfile, uploadReview };
