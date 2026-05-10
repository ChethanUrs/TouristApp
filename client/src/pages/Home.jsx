import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedDestinations } from '../store/slices/destinationSlice';
import DestinationCard from '../components/DestinationCard';
import { Search, Map, Compass, Camera, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredDestinations, loading } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(fetchFeaturedDestinations());
  }, [dispatch]);

  const categories = [
    { name: 'Beach', icon: '🏖️' },
    { name: 'Mountain', icon: '⛰️' },
    { name: 'City', icon: '🌆' },
    { name: 'Heritage', icon: '🏛️' },
    { name: 'Adventure', icon: '🚵' },
  ];

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl mb-6 font-display font-extrabold"
          >
            Explore the <span className="text-primary-400">World</span> <br /> 
            Beyond Boundaries
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-100 mb-12 max-w-2xl mx-auto font-light"
          >
            Discover breathtaking destinations, local cultures, and hidden gems around the globe.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Where do you want to go?" 
                  className="w-full bg-white text-slate-900 py-4 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button className="w-full md:w-auto btn btn-primary py-4 px-10 rounded-xl text-lg">
                Explore Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {categories.map((cat) => (
              <div key={cat.name} className="flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-primary-50 group-hover:-translate-y-1 transition-all duration-300">
                  {cat.icon}
                </div>
                <span className="font-bold text-slate-600 group-hover:text-primary-600 transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="container mx-auto px-4 mt-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Top Picks</span>
            <h2 className="text-4xl md:text-5xl">Featured Destinations</h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
            View All <Compass size={20} />
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}
      </section>

      {/* Features/Stats */}
      <section className="bg-slate-100 mt-24 py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-6 shadow-lg">
                <Map size={32} />
              </div>
              <h4 className="text-xl mb-2">Expert Guides</h4>
              <p className="text-slate-500">Professional local guides for every location.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-6 shadow-lg">
                <Camera size={32} />
              </div>
              <h4 className="text-xl mb-2">Breathtaking Views</h4>
              <p className="text-slate-500">Handpicked locations for the best experience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-6 shadow-lg">
                <Compass size={32} />
              </div>
              <h4 className="text-xl mb-2">Easy Discovery</h4>
              <p className="text-slate-500">Find your next trip with intuitive search.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-6 shadow-lg">
                <Shield size={32} />
              </div>
              <h4 className="text-xl mb-2">Safe Travels</h4>
              <p className="text-slate-500">Verified destinations and secure booking.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
