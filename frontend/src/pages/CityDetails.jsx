import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from "../api";

const CityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await API.get(`http://localhost:5000/api/data/cities/${id}`);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching city details', err);
        navigate('/cities');
      }
    };
    fetchCity();
  }, [id, navigate]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  const { city, places, food } = data;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* City Hero Banner */}
      <div className="relative h-[60vh] w-full flex items-end pb-16 justify-center">
        <div className="absolute inset-0">
          <img 
            src={`/${city.image_url}`} 
            alt={city.city_name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 text-center md:text-left">
          <div className="flex items-center space-x-2 text-gold-400 text-sm font-semibold tracking-wider uppercase mb-4 justify-center md:justify-start">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>&gt;</span>
            <Link to="/cities" className="hover:text-white transition-colors">Cities</Link>
            <span>&gt;</span>
            <span className="text-white">{city.city_name}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-tight drop-shadow-xl">
            {city.city_name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 space-y-24">
        
        {/* About Section */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/40 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-50 rounded-full blur-3xl -tr-10 -mr-10"></div>
          
          <div className="mb-12 max-w-4xl relative z-10">
            <h2 className="text-sm font-bold tracking-widest text-brand-600 uppercase mb-2">The Story</h2>
            <h3 className="text-3xl font-display font-bold text-gray-900 mb-6">About {city.city_name}</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {city.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gold-300 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-plane text-xl"></i>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Air</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{city.air}</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gold-300 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-train text-xl"></i>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Train</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{city.train}</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gold-300 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-road text-xl"></i>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Road</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{city.road}</p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gold-300 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gold-500 mb-4 group-hover:scale-110 transition-transform">
                <i className="fas fa-clock text-xl"></i>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Best Time</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{city.best_time}</p>
            </div>
          </div>
        </section>

        {/* Places Section */}
        {places && places.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                <i className="fas fa-landmark"></i>
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900">Iconic Landmarks</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {places.map((place) => (
                <div key={place.place_id} className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={`/${place.image_url}`} 
                      alt={place.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-700 shadow-sm">
                      {place.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">{place.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{place.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Food Section */}
        {food && food.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
                <i className="fas fa-utensils"></i>
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900">Culinary Delights</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {food.map((item) => (
                <div key={item.food_id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-gold-300 transition-colors flex items-center gap-4 group">
                  <img src={`/${item.image_url}`} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-xs font-medium text-gold-600 mt-1">{item.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default CityDetails;
