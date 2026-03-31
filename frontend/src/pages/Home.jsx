import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from "../api";

const Home = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await API.get('/api/data/cities');
        setCities(res.data.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cities', err);
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract beautiful mesh background mimicking desert twilight */}
        <div className="absolute inset-0 z-0 bg-brand-900">
          <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-br from-gold-600/40 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 -right-1/4 w-full h-full bg-gradient-to-bl from-brand-500/40 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <img 
            src="/images/udaipur/city_palace.jpg" 
            alt="Hero Background" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" 
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-gold-500/20 backdrop-blur-md border border-gold-500/30 text-gold-300 font-semibold text-xs uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(244,162,97,0.3)] cursor-default">
            Discover Incredible India
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-extrabold text-white tracking-tight mb-6 drop-shadow-2xl">
            Roam Rajasthan
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light mb-10 max-w-2xl leading-relaxed drop-shadow-lg">
            Experience the vibrant culture, majestic forts, and timeless luxury in the land of kings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/cities" className="btn-primary hover:-translate-y-1">
              Start Exploring
              <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce text-white/50">
          <span className="text-xs uppercase tracking-widest mb-2 font-medium">Scroll down</span>
          <i className="fas fa-chevron-down border border-white/20 p-2 rounded-full backdrop-blur-sm"></i>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="py-32 bg-gray-50 relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h4 className="text-brand-600 font-bold tracking-widest uppercase text-sm mb-3">Popular Destinations</h4>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">Explore the Cities</h2>
            </div>
            <Link to="/cities" className="hidden md:flex items-center font-semibold text-brand-600 hover:text-brand-500 group transition-colors">
              View All Cities 
              <span className="ml-2 px-2 py-1 bg-brand-100 rounded-lg group-hover:bg-brand-200 transition-colors"><i className="fas fa-arrow-right text-xs"></i></span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cities.map((city, index) => (
                <Link 
                  to={`/cities/${city.city_id}`} 
                  className="group rounded-3xl overflow-hidden bg-white shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-gold-500/10 transform hover:-translate-y-2 transition-all duration-500" 
                  key={city.city_id}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={`/${city.image_url || 'images/jaipur/hawaMahal.jpg'}`} 
                      alt={city.city_name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <i className="fas fa-map-marker-alt"></i> Rajasthan
                      </div>
                      <h3 className="text-3xl font-display font-bold text-white drop-shadow-md">{city.city_name}</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-3 mb-6">
                      {city.description}
                    </p>
                    <div className="flex items-center text-brand-600 font-semibold text-sm group-hover:text-gold-600 transition-colors">
                      Discover {city.city_name} 
                      <i className="fas fa-long-arrow-alt-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/cities" className="btn-primary w-full">View All Cities</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
