import React from 'react';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                <MapPin size={24} />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">
                Tourist<span className="text-primary-500">App</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Discover the world's most beautiful destinations with us. Your journey starts here.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><a href="/" className="hover:text-primary-500 transition-colors">Home</a></li>
              <li><a href="/destinations" className="hover:text-primary-500 transition-colors">Destinations</a></li>
              <li><a href="/login" className="hover:text-primary-500 transition-colors">Join Us</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Featured Locations</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary-500" />
                <span>info@touristapp.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary-500" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-primary-500" />
                <span>123 Travel St, Wanderlust City</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TouristApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
