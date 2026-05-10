import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import Rating from './Rating';
import { motion } from 'framer-motion';

const DestinationCard = ({ destination }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={destination.images[0]} 
          alt={destination.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-bold uppercase tracking-wider rounded-full">
            {destination.category}
          </span>
        </div>
        {destination.isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-primary-600/20">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
          <MapPin size={12} />
          <span>{destination.location.city}, {destination.location.country}</span>
        </div>
        
        <h3 className="text-xl mb-2 group-hover:text-primary-600 transition-colors">
          <Link to={`/destination/${destination._id}`}>{destination.name}</Link>
        </h3>
        
        <div className="mb-4">
          <Rating value={destination.rating} text={`${destination.numReviews} reviews`} />
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-6">
          {destination.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <Link 
            to={`/destination/${destination._id}`}
            className="flex items-center gap-2 font-bold text-primary-600 group/link"
          >
            <span>Details</span>
            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center group-hover/link:bg-primary-600 group-hover/link:text-white transition-all">
              <ArrowRight size={16} />
            </div>
          </Link>

          <a 
            href={destination.location?.coordinates?.lat && destination.location?.coordinates?.lng 
              ? `https://www.google.com/maps?q=${destination.location.coordinates.lat},${destination.location.coordinates.lng}`
              : `https://www.google.com/maps/search/${encodeURIComponent(destination.name + ' ' + destination.location.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary-500 transition-colors"
          >
            <MapPin size={14} />
            <span>Maps</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
