import React, { useState } from 'react';
import API from "../api";
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('http://localhost:5000/api/auth/register', { username, email, password });
      onLogin(res.data.user, res.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-gold-200 rounded-full mix-blend-multiply blur-3xl opacity-30"></div>

      <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-2xl font-display font-bold text-brand-900 mb-6 tracking-tight">
            Roam<span className="text-gold-500">Rajasthan</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">Join our community of explorers</p>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-user text-gray-400"></i>
              </div>
              <input 
                type="text" 
                placeholder="Username" 
                required 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="input-field"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-envelope text-gray-400"></i>
              </div>
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="input-field"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="input-field"
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary w-full py-3.5 text-lg font-bold">
            Sign Up
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
