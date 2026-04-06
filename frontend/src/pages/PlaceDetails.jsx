// frontend/src/pages/PlaceDetails.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { getImageUrl } from '../utils/imageUrl';

const PlaceDetails = ({ currentUser }) => {
  const { id } = useParams();
  const [data, setData] = useState({ place: null, reviews: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [reviewPhotos, setReviewPhotos] = useState([]); // File objects chosen by user
  const [reviewPhotoPreviews, setReviewPhotoPreviews] = useState([]); // Object URLs for preview
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeReplyBox, setActiveReplyBox] = useState(null);
  const reviewFileRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  // Cleanup preview URLs when component unmounts or photos change
  useEffect(() => {
    return () => reviewPhotoPreviews.forEach(url => URL.revokeObjectURL(url));
  }, [reviewPhotoPreviews]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/api/data/place/${id}`);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching place details:', err);
      setError('Could not load place details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + reviewPhotos.length > 4) {
      alert('You can attach a maximum of 4 photos per review.');
      return;
    }
    setReviewPhotos(prev => [...prev, ...files]);
    setReviewPhotoPreviews(prev => [
      ...prev,
      ...files.map(f => URL.createObjectURL(f))
    ]);
    e.target.value = '';
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(reviewPhotoPreviews[index]);
    setReviewPhotos(prev => prev.filter((_, i) => i !== index));
    setReviewPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitLoading(true);
    try {
      // Use FormData so we can send both fields and files in one request
      const formData = new FormData();
      formData.append('placeId', id);
      formData.append('userId', currentUser.id);
      formData.append('rating', newReview.rating);
      formData.append('review_text', newReview.text);
      reviewPhotos.forEach(file => formData.append('photos', file));

      await API.post('/api/data/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewReview({ rating: 5, text: '' });
      setReviewPhotos([]);
      setReviewPhotoPreviews([]);
      fetchData();
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitLoading(false);
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
            <form onSubmit={handleReviewSubmit} className="space-y-5">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1–5)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500 self-center font-semibold">{newReview.rating}/5</span>
                </div>
              </div>

              {/* Review text */}
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

              {/* Photo upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Add Photos <span className="text-gray-400 font-normal">(optional, max 4)</span>
                </label>

                {/* Preview strip */}
                {reviewPhotoPreviews.length > 0 && (
                  <div className="flex gap-3 flex-wrap mb-3">
                    {reviewPhotoPreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={src}
                          alt={`Preview ${i + 1}`}
                          className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {reviewPhotos.length < 4 && (
                  <button
                    type="button"
                    onClick={() => reviewFileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
                  >
                    <i className="fas fa-camera"></i>
                    {reviewPhotos.length === 0 ? 'Add Photos' : `Add More (${4 - reviewPhotos.length} left)`}
                  </button>
                )}
                <input
                  type="file"
                  ref={reviewFileRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="px-8 py-3 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-colors shadow-md disabled:opacity-60 flex items-center gap-2"
              >
                {submitLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Submitting...</>
                ) : (
                  'Submit Review'
                )}
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
                  {/* Reviewer info */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={getImageUrl(review.user?.profile_image_url)}
                      alt={review.user?.username}
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
                      onError={(e) => { e.target.src = '/images/default_profile.png'; }}
                    />
                    <div className="flex-1">
                      <strong className="text-gray-900 font-bold text-sm">
                        {review.user?.username || 'Anonymous'}
                      </strong>
                      <p className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-yellow-500 flex items-center gap-0.5">
                      {'★'.repeat(review.rating)}<span className="text-gray-300">{'★'.repeat(5 - review.rating)}</span>
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{review.review_text}</p>

                  {/* Review photos */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {review.images.map((img, i) => (
                        <img
                          key={i}
                          src={getImageUrl(img)}
                          alt={`Review photo ${i + 1}`}
                          className="w-24 h-24 rounded-xl object-cover border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => window.open(getImageUrl(img), '_blank')}
                        />
                      ))}
                    </div>
                  )}

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