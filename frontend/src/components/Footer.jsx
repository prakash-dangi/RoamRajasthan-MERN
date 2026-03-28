import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-900 border-t border-brand-800 text-gray-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-2xl font-display font-bold text-white tracking-tight">Roam<span className="text-gold-500">Rajasthan</span></h3>
            <p className="text-gray-400 max-w-sm leading-relaxed text-sm">
              Discover the true essence of India's most vibrant state. Deep dive into the culture, forts, and food. Let's make your journey unforgettable.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Home</Link></li>
              <li><Link to="/cities" className="hover:text-gold-400 transition-colors">Explore Cities</Link></li>
              <li><Link to="/itineraries" className="hover:text-gold-400 transition-colors">Curated Itineraries</Link></li>
              <li><Link to="/login" className="hover:text-gold-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-xs">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-all transform hover:-translate-y-1">
                <i className="fab fa-facebook-f text-sm"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-all transform hover:-translate-y-1">
                <i className="fab fa-twitter text-sm"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center hover:bg-gold-600 hover:text-white transition-all transform hover:-translate-y-1">
                <i className="fab fa-instagram text-sm"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-brand-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Roam Rajasthan. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
