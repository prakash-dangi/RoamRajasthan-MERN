import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from "../api";

const CitiesList = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await API.get('http://localhost:5000/api/data/cities');
        setCities(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cities', err);
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 pt-10">
          <h4 className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-3">Complete Catalogue</h4>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 tracking-tight mb-6">
            Explore All Cities
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed font-light">
            From the pink hues of Jaipur to the blue skyline of Jodhpur. Dive deep into the heart of Rajasthan and discover every hidden gem it has to offer.
          </p>
        </div>

        {/* Grid Container */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city) => (
              <Link 
                to={`/cities/${city.city_id}`} 
                className="group flex flex-col rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gold-500/10 hover:border-gold-200 transform hover:-translate-y-1 transition-all duration-500 overflow-hidden" 
                key={city.city_id}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={`/${city.image_url || 'images/jaipur/hawaMahal.jpg'}`} 
                    alt={city.city_name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white pb-1">
                    <h3 className="text-2xl font-display font-bold tracking-tight">{city.city_name}</h3>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {city.description}
                  </p>
                  <div className="mt-auto flex justify-between items-center text-sm font-semibold text-brand-600 group-hover:text-gold-600 transition-colors">
                    <span>View City Guide</span>
                    <span className="w-8 h-8 rounded-full bg-brand-50 group-hover:bg-gold-50 flex items-center justify-center transition-colors">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitiesList;
