// frontend/src/pages/PlaceDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api'; // Use the shared axios instance

const PlaceDetails = ({ currentUser }) => {
  const { id } = useParams();
  const [data, setData] = useState({ place: null, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [activeReplyBox, setActiveReplyBox] = useState(null); // ID of review being replied to

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Correct path: routes are mounted at /api/data in server.js
      const res = await API.get(`/api/data/place/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching place details:', err);
      setError('Could not load place details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      await API.post('/api/data/reviews', {
        placeId: id,
        userId: currentUser.id,
        rating: newReview.rating,
        review_text: newReview.text
      });
      setNewReview({ rating: 5, text: '' });
      fetchData();
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const handleReplySubmit = async (reviewId, replyText) => {
    if (!currentUser) return;
    try {
      await API.post(`/api/data/reviews/${reviewId}/reply`, {
        userId: currentUser.id,
        reply_text: replyText
      });
      setActiveReplyBox(null);
      fetchData();
    } catch (err) {
      console.error('Error submitting reply:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-center px-6">
        <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-6 py-2 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data.place) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500 text-lg">Place not found.</p>
      </div>
    );
  }

  const { place, reviews } = data;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Place Hero Banner */}
      <div className="relative h-[50vh] w-full flex items-end pb-12 justify-center">
        <div className="absolute inset-0">
          <img
            src={`/${place.image_url}`}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/images/jaipur/hawaMahal.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-5xl px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-xl">
            {place.name}
          </h1>
          {place.type && (
            <span className="inline-block mt-3 px-4 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30">
              {place.type}
            </span>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-12 space-y-12">

        {/* Place Details */}
        <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/40">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Place</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{place.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {place.timing && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Timing</p>
                <p className="text-gray-800 font-semibold">{place.timing}</p>
              </div>
            )}
            {place.entry_fee && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Entry Fee</p>
                <p className="text-gray-800 font-semibold">{place.entry_fee}</p>
              </div>
            )}
            {place.map_link && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Location</p>
                <a
                  href={place.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 font-semibold hover:underline"
                >
                  View on Map →
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Review Form */}
        {currentUser && (
          <section className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/40">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Leave a Review</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1–5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="w-24 border border-gray-200 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={newReview.text}
                  required
                  rows={4}
                  placeholder="Share your experience..."
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-colors shadow-md"
              >
                Submit Review
              </button>
            </form>
          </section>
        )}

        {/* Reviews List */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <strong className="text-gray-900 font-bold">
                      {review.user?.username || 'Anonymous'}
                    </strong>
                    <span className="text-sm font-semibold text-yellow-500">⭐ {review.rating}/5</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.review_text}</p>

                  {/* Replies */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="mt-4 ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                      {review.replies.map((reply, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          <strong className="text-gray-800">{reply.user?.username || 'User'}:</strong>{' '}
                          {reply.reply_text}
                        </div>
                      ))}
                    </div>
                  )}

                  {currentUser && (
                    <button
                      onClick={() => setActiveReplyBox(activeReplyBox === review._id ? null : review._id)}
                      className="mt-3 text-sm text-brand-600 font-semibold hover:underline"
                    >
                      {activeReplyBox === review._id ? 'Cancel' : 'Reply'}
                    </button>
                  )}

                  {activeReplyBox === review._id && (
                    <ReplyInput onSubmit={(text) => handleReplySubmit(review._id, text)} />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

// Helper component for reply input
const ReplyInput = ({ onSubmit }) => {
  const [text, setText] = useState('');
  return (
    <div className="mt-3 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-400"
      />
      <button
        onClick={() => { if (text.trim()) onSubmit(text); }}
        className="px-5 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors"
      >
        Post
      </button>
    </div>
  );
};

export default PlaceDetails;