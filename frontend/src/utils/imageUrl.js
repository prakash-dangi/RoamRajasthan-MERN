// frontend/src/utils/imageUrl.js
//
// Central utility for building image URLs.
//
// Image sources in this app fall into two categories:
//   1. Static assets committed to the repo (e.g. "images/jaipur/hawaMahal.jpg")
//      → served by the Vite dev server at http://localhost:5173/
//      → accessed as  /images/jaipur/hawaMahal.jpg
//
//   2. User-uploaded files handled by Multer on the backend
//      → saved under  <repo-root>/uploads/profiles/  or  uploads/reviews/
//      → served by Express static at http://localhost:5000/uploads/...
//      → stored in the DB as  "uploads/profiles/filename.jpg"
//
// This function always returns a full, working URL for both cases.

const BACKEND_URL = 'http://localhost:5000';

export const getImageUrl = (path, fallback = '/images/default_profile.png') => {
  if (!path) return fallback;

  // Already a full URL (http:// or https://)
  if (path.startsWith('http')) return path;

  // User-uploaded file — served by the Express backend static middleware
  if (path.startsWith('uploads/')) return `${BACKEND_URL}/${path}`;

  // Static repo asset — served by the Vite dev server
  // Make sure it starts with a slash
  return path.startsWith('/') ? path : `/${path}`;
};

export default BACKEND_URL;
