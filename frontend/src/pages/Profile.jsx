import React from 'react';

const Profile = ({ user }) => {
  const profileImage = user?.profile_image_url ? `/${user.profile_image_url}` : '/images/default_profile.png';

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -tr-20 -mr-20"></div>
          
          <div className="relative z-10 shrink-0">
            <div className="p-2 border-4 border-gold-100 rounded-full">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-md"
              />
            </div>
          </div>
          
          <div className="text-center md:text-left relative z-10 flex-1">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">{user?.username}</h1>
            <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mb-6">
              <i className="fas fa-envelope text-brand-400"></i>
              {user?.email}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="px-5 py-2.5 rounded-xl bg-gray-100 text-brand-900 text-sm font-bold border border-gray-200 hover:bg-gray-200 transition-colors shadow-sm">
                Edit Profile
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-brand-50 text-brand-700 text-sm font-bold hover:bg-brand-100 transition-colors shadow-sm">
                <i className="fas fa-camera mr-2"></i> Update Photo
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Stats Bar (Sidebar) */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-500 flex items-center justify-center text-xl">
                <i className="fas fa-heart"></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-500">Favorites</h4>
                <p className="text-2xl font-display font-bold text-gray-900">0</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl">
                <i className="fas fa-route"></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-500">Itineraries</h4>
                <p className="text-2xl font-display font-bold text-gray-900">0</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
                <i className="fas fa-star"></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-500">Reviews Output</h4>
                <p className="text-2xl font-display font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center gap-3">
                <i className="fas fa-bookmark text-gold-500"></i> My Places
              </h3>
              
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 pt-8 pb-8 text-center px-6">
                <div className="w-16 h-16 bg-gray-100 text-brand-300 rounded-full flex items-center justify-center text-2xl mb-4">
                  <i className="fas fa-map-marked-alt"></i>
                </div>
                <h4 className="text-lg font-bold text-gray-700 mb-2">No places saved yet</h4>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  You haven't added any favorite destinations to your profile. Start exploring cities!
                </p>
                <button className="text-brand-600 font-bold hover:text-brand-800 text-sm transition-colors">
                  Explore Destinations <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Profile;
