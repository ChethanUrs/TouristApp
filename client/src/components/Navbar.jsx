import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Menu, X, User, LogOut, LayoutDashboard, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <MapPin size={24} />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-slate-800">
            Tourist<span className="text-primary-600">App</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-medium text-slate-600 hover:text-primary-600 transition-colors">Home</Link>
          <Link to="/destinations" className="font-medium text-slate-600 hover:text-primary-600 transition-colors">Destinations</Link>
          
          <div className="relative">
            {userInfo ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pl-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <span className="font-medium text-slate-700">{userInfo.name}</span>
                  <img src={userInfo.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors">
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      {userInfo.role === 'admin' && (
                        <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors">
                          <LayoutDashboard size={18} />
                          <span>Dashboard</span>
                        </Link>
                      )}
                      <button 
                        onClick={logoutHandler}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="font-medium text-slate-600 hover:text-primary-600 transition-colors">Login</Link>
                <Link to="/register" className="btn btn-primary py-2 px-6">Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700">Home</Link>
              <Link to="/destinations" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700">Destinations</Link>
              <hr className="border-slate-100" />
              {userInfo ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700">Profile</Link>
                  {userInfo.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700">Admin Dashboard</Link>
                  )}
                  <button onClick={logoutHandler} className="text-left text-lg font-medium text-red-500">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-700">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn btn-primary">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
