import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api'; // Use the shared axios instance — not raw axios

const Itineraries = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Correct path: data routes are mounted at /api/data/ in server.js
        API.get('/api/data/cities')
            .then(res => {
                setCities(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching cities for itineraries:', err);
                setError('Could not load cities. Please try again.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <p className="text-red-500 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section
                className="relative h-[50vh] flex items-center justify-center text-center text-white"
                style={{ backgroundImage: "url('/images/jaipur/AmerFort.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold drop-shadow-xl mb-4">Plan Your Perfect Trip</h1>
                    <p className="text-lg text-white/80 font-light">Choose a city and explore a curated day-by-day itinerary</p>
                </div>
            </section>

            {/* Cities Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Choose Your Destination</h2>

                {cities.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No cities available yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cities.map(city => (
                            // Link uses city._id (MongoDB ObjectId) — matches what the backend itinerary route expects
                            <Link
                                to={`/itinerary/${city._id}`}
                                key={city._id}
                                className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    {/* Correct field: image_url (not image) */}
                                    <img
                                        src={`/${city.image_url}`}
                                        alt={city.city_name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = '/images/jaipur/hawaMahal.jpg'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                </div>
                                <div className="p-6">
                                    {/* Correct field: city_name (not name) */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">
                                        {city.city_name} Itinerary
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{city.description}</p>
                                    <span className="inline-block mt-4 text-sm font-semibold text-brand-600 group-hover:text-gold-600 transition-colors">
                                        View Day-by-Day Plan →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Itineraries;