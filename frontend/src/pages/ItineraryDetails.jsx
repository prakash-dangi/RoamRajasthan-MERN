import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api'; // Use the shared axios instance — not raw axios

const ItineraryDetails = () => {
    const { cityId } = useParams();
    const [itinerary, setItinerary] = useState([]);
    const [cityName, setCityName] = useState('');
    const [activeDay, setActiveDay] = useState(0); // Open first day by default
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Correct path: data routes are mounted at /api/data/ in server.js
        API.get(`/api/data/itinerary/${cityId}`)
            .then(res => {
                setItinerary(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching itinerary:', err);
                setError('Could not load itinerary. Please try again.');
                setLoading(false);
            });
    }, [cityId]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 gap-4">
                <p className="text-red-500 text-lg font-semibold">{error}</p>
                <Link to="/itineraries" className="text-brand-600 font-bold hover:underline">← Back to Itineraries</Link>
            </div>
        );
    }

    if (itinerary.length === 0) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 gap-4 text-center px-6">
                <p className="text-gray-500 text-xl font-semibold">No itinerary available for this city yet.</p>
                <Link to="/itineraries" className="text-brand-600 font-bold hover:underline">← Back to Itineraries</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100 pt-24 pb-10 text-center">
                <Link to="/itineraries" className="text-sm text-brand-600 font-semibold hover:underline block mb-4">
                    ← Back to All Itineraries
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Your Itinerary</h1>
                <p className="text-gray-500 mt-2">{itinerary.length} day{itinerary.length > 1 ? 's' : ''} planned</p>
            </div>

            {/* Accordion Days */}
            <div className="max-w-3xl mx-auto px-6 md:px-12 mt-12 space-y-4">
                {itinerary.map((item, index) => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <button
                            className={`w-full text-left px-6 py-5 flex items-center justify-between font-bold text-lg transition-colors
                                ${activeDay === index
                                    ? 'bg-brand-600 text-white'
                                    : 'text-gray-900 hover:bg-gray-50'}`}
                            onClick={() => setActiveDay(activeDay === index ? null : index)}
                        >
                            <span>Day {item.day}: {item.title}</span>
                            <span className="text-xl">{activeDay === index ? '−' : '+'}</span>
                        </button>

                        {activeDay === index && (
                            <div className="px-6 py-5 space-y-4">
                                {item.activities && item.activities.length > 0 ? (
                                    item.activities.map((act, i) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="shrink-0 w-20 text-xs font-bold text-brand-600 pt-1">{act.time}</div>
                                            <div>
                                                {act.location && (
                                                    <p className="font-semibold text-gray-800 mb-0.5">{act.location}</p>
                                                )}
                                                <p className="text-gray-600 text-sm">{act.description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm">No activities listed for this day.</p>
                                )}

                                {item.tips && item.tips.length > 0 && (
                                    <div className="mt-4 p-4 bg-gold-50 rounded-xl border border-gold-100">
                                        <p className="text-xs font-bold text-gold-600 uppercase tracking-widest mb-2">💡 Tips</p>
                                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                            {item.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItineraryDetails;