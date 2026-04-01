// frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const Home = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await API.get('/api/data/cities');
                // Store only the first 6 cities
                setCities(response.data.slice(0, 6)); 
                setLoading(false);
            } catch (err) {
                console.error("Error fetching cities:", err);
                setError('Could not load cities. Please try again later.');
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    return (
        <main>
            {/* Hero Section */}
            <section className="h-[100vh] flex items-center justify-center text-center text-white bg-[linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)),url('/images/intro.jpg')] bg-cover bg-center">
                <div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                        Roam Rajasthan
                    </h1>
                    <p className="text-xl md:text-2xl font-light drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)]">
                        Welcome to the land of kings
                    </p>
                </div>
            </section>

            {/* Cities Section */}
            <section className="py-16 px-8 bg-[#f9f9f9]">
                <h2 className="text-center text-4xl mb-12 text-[#2c3e50] font-bold">
                    Explore the Cities
                </h2>
                <div className="max-w-[1200px] mx-auto">
                    
                    {loading ? (
                        <p className="text-center text-gray-600">Loading cities...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                            {cities.map((city) => {
                                const image = city.image_url ? `/${city.image_url}` : '/images/jaipur/hawaMahal.jpg';
                                
                                return (
                                    <Link 
                                        to={`/cities/${city.city_id}`} 
                                        key={city._id}
                                        className="block bg-white rounded-xl overflow-hidden text-inherit shadow-[0_4px_15px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:-translate-y-2.5 hover:shadow-[0_12px_25px_rgba(0,0,0,0.15)]" 
                                    >
                                        <img 
                                            src={image} 
                                            alt={city.city_name} 
                                            className="w-full h-[250px] object-cover" 
                                        />
                                        <div className="p-6">
                                            <h3 className="mb-2 text-[1.4rem] font-semibold text-gray-800">
                                                {city.city_name}
                                            </h3>
                                            <p className="m-0 text-gray-600 leading-relaxed">
                                                {city.description 
                                                    ? `${city.description.substring(0, 100)}...` 
                                                    : 'Experience the rich culture and heritage...'}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* View All Button */}
                    <div className="text-center mt-12">
                        <Link 
                            to="/cities" 
                            className="inline-block px-9 py-3 bg-[#e74c3c] text-white rounded-full font-bold text-[1.1rem] transition-all duration-300 ease-in-out hover:bg-[#c0392b] hover:scale-105"
                        >
                            View All Cities
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;