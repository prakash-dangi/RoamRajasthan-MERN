import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const profileImage = user?.profile_image_url ? `/${user.profile_image_url}` : '/images/default_profile.png';
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  
  // Dynamic header transparency
  const headerClass = `fixed w-full z-50 transition-all duration-300 ${
    scrolled || !isHome 
      ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-4' 
      : 'bg-transparent py-6'
  }`;

  const textClass = scrolled || !isHome ? 'text-gray-800' : 'text-white';
  const logoClass = scrolled || !isHome ? 'text-brand-800' : 'text-white drop-shadow-md';

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center gap-2 group">
            <span className={`text-2xl font-display font-bold tracking-tight transition-colors ${logoClass}`}>
              Roam<span className="text-gold-500">Rajasthan</span>
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`font-medium text-sm tracking-wide hover:text-gold-500 transition-colors ${textClass}`}>Home</Link>
          <Link to="/cities" className={`font-medium text-sm tracking-wide hover:text-gold-500 transition-colors ${textClass}`}>Cities</Link>
          
          {user ? (
            <div className="flex items-center space-x-6 border-l border-gray-200/40 pl-6 border-dashed">
              <Link to="/profile" className={`font-medium text-sm hover:text-gold-500 transition-colors flex items-center gap-2 ${textClass}`}>
                <img src={profileImage} alt="Profile" className="w-8 h-8 rounded-full border-2 border-gold-400 object-cover shadow-sm" />
                <span>{user.username}</span>
              </Link>
              <button 
                onClick={onLogout} 
                className={`text-sm font-semibold flex items-center gap-1 hover:text-red-500 transition-colors ${textClass}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 pl-4">
              <Link to="/login" className={`font-medium text-sm hover:text-gold-500 transition-colors ${textClass}`}>Login</Link>
              <Link to="/register" className="px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 hover:scale-105 transform transition-all shadow-lg shadow-gold-500/20 text-white text-sm font-semibold">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
