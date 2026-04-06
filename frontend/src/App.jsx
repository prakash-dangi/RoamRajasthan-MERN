import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CitiesList from './pages/CitiesList';
import CityDetails from './pages/CityDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PlaceDetails from './pages/PlaceDetails';
import Itineraries from './pages/Itineraries';
import ItineraryDetails from './pages/ItineraryDetails';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <Header user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cities" element={<CitiesList />} />
          <Route path="/cities/:id" element={<CityDetails />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/profile" element={user ? <Profile user={user} onLogin={handleLogin} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/place/:id" element={<PlaceDetails currentUser={user} />} />
          <Route path="/itineraries" element={<Itineraries />} />
          <Route path="/itinerary/:cityId" element={<ItineraryDetails />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
