import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { getImageUrl } from '../utils/imageUrl';

const Profile = ({ user, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ── State ────────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');

  // Photo upload
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  // Edit profile fields
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');

  // Change password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const profileImage = getImageUrl(user?.profile_image_url);

  // ── Fetch user's reviews ──────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    API.get('/api/auth/me/reviews', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReviews(res.data))
      .catch(err => console.error('Error fetching reviews:', err))
      .finally(() => setReviewsLoading(false));
  }, []);

  // ── Edit profile submit ──────────────────────────────────────────────────
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await API.put('/api/auth/profile',
        { username: editUsername, bio: editBio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update localStorage and parent state so header/username reflect the change instantly
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onLogin(updatedUser, token);
      setEditSuccess('Profile updated successfully!');
    } catch (err) {
      setEditError(err.response?.data?.msg || 'Could not update profile');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Change password submit ────────────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters');
      return;
    }
    setPassLoading(true);
    try {
      const token = localStorage.getItem('token');
      await API.put('/api/auth/password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.response?.data?.msg || 'Could not change password');
    } finally {
      setPassLoading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    setPhotoError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo', file);
      const res = await API.post('/api/auth/upload/photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      // Update localStorage and parent state so avatar refreshes everywhere immediately
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onLogin(updatedUser, token);
    } catch (err) {
      setPhotoError(err.response?.data?.msg || 'Photo upload failed. Please try again.');
    } finally {
      setPhotoLoading(false);
      // Reset file input so the same file can be re-selected
      e.target.value = '';
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const tabs = [
    { id: 'reviews', label: 'My Reviews', icon: 'fa-star' },
    { id: 'edit', label: 'Edit Profile', icon: 'fa-pen' },
    { id: 'password', label: 'Change Password', icon: 'fa-lock' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* ── Profile Card ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {/* Avatar */}
          <div className="relative shrink-0 z-10">
            <div className="p-1 bg-gradient-to-br from-gold-400 to-brand-500 rounded-full shadow-xl relative">
              <img
                src={profileImage}
                alt="Profile"
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white"
                onError={(e) => { e.target.src = '/images/default_profile.png'; }}
              />
              {/* Spinner overlay while uploading */}
              {photoLoading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button
              onClick={handlePhotoClick}
              disabled={photoLoading}
              title="Update photo"
              className="absolute bottom-1 right-1 bg-white border border-gray-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center hover:bg-brand-50 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-camera text-brand-600 text-sm"></i>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Info */}
          <div className="text-center md:text-left relative z-10 flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{user?.username}</h1>
            <p className="text-gray-400 font-medium flex items-center justify-center md:justify-start gap-2 mb-2 text-sm">
              <i className="fas fa-envelope text-brand-400"></i>
              {user?.email}
            </p>
            {user?.bio && (
              <p className="text-gray-500 text-sm italic mb-3">"{user.bio}"</p>
            )}

            {/* Stats inline */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-start mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Favorites</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="absolute top-6 right-6 text-sm text-gray-400 hover:text-red-500 font-semibold transition-colors flex items-center gap-1"
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>

        {/* Photo upload error */}
        {photoError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-semibold flex items-center justify-between">
            <span><i className="fas fa-exclamation-circle mr-2"></i>{photoError}</span>
            <button onClick={() => setPhotoError('')} className="text-red-400 hover:text-red-600 ml-4">✕</button>
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
                ${activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: My Reviews ──────────────────────────────────────────── */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <i className="fas fa-star text-gold-500"></i> My Reviews
            </h2>

            {reviewsLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-600"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-2xl text-center px-6">
                <div className="w-16 h-16 bg-gray-100 text-gray-300 rounded-full flex items-center justify-center text-2xl mb-4">
                  <i className="fas fa-star"></i>
                </div>
                <h4 className="text-lg font-bold text-gray-700 mb-2">No reviews yet</h4>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  You haven't reviewed any places yet. Start exploring and share your experiences!
                </p>
                <Link
                  to="/cities"
                  className="px-6 py-2.5 bg-brand-600 text-white rounded-full text-sm font-bold hover:bg-brand-700 transition-colors shadow-md"
                >
                  Explore Destinations <i className="fas fa-arrow-right ml-1"></i>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-brand-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {review.place?.name || 'Unknown Place'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(review.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-yellow-500 flex items-center gap-1">
                        <i className="fas fa-star"></i> {review.rating}/5
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.review_text}</p>
                    {/* Review photo thumbnails */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {review.images.map((img, i) => (
                          <img
                            key={i}
                            src={getImageUrl(img)}
                            alt={`Review photo ${i + 1}`}
                            className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => window.open(getImageUrl(img), '_blank')}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Edit Profile ────────────────────────────────────────── */}
        {activeTab === 'edit' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <i className="fas fa-pen text-brand-600"></i> Edit Profile
            </h2>

            {editSuccess && (
              <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold">
                <i className="fas fa-check-circle mr-2"></i>{editSuccess}
              </div>
            )}
            {editError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
                <i className="fas fa-exclamation-circle mr-2"></i>{editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-5 max-w-lg">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-800 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email <span className="text-gray-400 font-normal">(cannot be changed)</span></label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-100 rounded-xl text-gray-400 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="Tell others a bit about yourself..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-800 bg-gray-50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={editLoading}
                className="px-8 py-3 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-colors shadow-md disabled:opacity-60 flex items-center gap-2"
              >
                {editLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : (
                  <><i className="fas fa-save"></i> Save Changes</>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── Tab: Change Password ─────────────────────────────────────── */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <i className="fas fa-lock text-brand-600"></i> Change Password
            </h2>

            {passSuccess && (
              <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold">
                <i className="fas fa-check-circle mr-2"></i>{passSuccess}
              </div>
            )}
            {passError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-semibold">
                <i className="fas fa-exclamation-circle mr-2"></i>{passError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-lg">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-800 bg-gray-50"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    <i className={`fas ${showCurrent ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password <span className="text-gray-400 font-normal">(min. 6 characters)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-key text-gray-400"></i>
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-800 bg-gray-50"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                    <i className={`fas ${showNew ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-key text-gray-400"></i>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-gray-800 bg-gray-50
                      ${confirmPassword && confirmPassword !== newPassword
                        ? 'border-red-300 focus:ring-red-300'
                        : 'border-gray-200 focus:ring-brand-400'}`}
                  />
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">Passwords don't match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passLoading || (confirmPassword && confirmPassword !== newPassword)}
                className="px-8 py-3 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-colors shadow-md disabled:opacity-60 flex items-center gap-2"
              >
                {passLoading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div> Changing...</>
                ) : (
                  <><i className="fas fa-shield-alt"></i> Update Password</>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
