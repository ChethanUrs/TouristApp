import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinations } from '../store/slices/destinationSlice';
import DestinationCard from '../components/DestinationCard';
import { Filter, Search, ChevronLeft, ChevronRight, X, Sparkles, Loader2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AiInsights from '../components/AiInsights';
import AddDestinationModal from '../components/AddDestinationModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';

const Destinations = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [showAiResults, setShowAiResults] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { destinations, loading, pages, page } = useSelector((state) => state.destinations);

  useEffect(() => {
    dispatch(fetchDestinations({ keyword, pageNumber, category, rating }));
  }, [dispatch, keyword, pageNumber, category, rating]);

  const categories = ['beach', 'mountain', 'city', 'heritage', 'adventure'];

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(1);
    // Search is handled by useEffect as keyword state updates
  };

  const clearFilters = () => {
    setKeyword('');
    setCategory('');
    setRating('');
    setPageNumber(1);
  };

  const handleAiSearch = async () => {
    if (!keyword) return;
    if (!userInfo) {
      toast.error('Please login to use AI Travel Planner');
      return;
    }

    setAiLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post('/api/ai/search-place', { keyword }, config);
      setAiData(data);
      setShowAiResults(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate travel plan');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`md:w-1/4 space-y-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl">Filters</h3>
              {(category || rating || keyword) && (
                <button onClick={clearFilters} className="text-sm text-primary-600 font-bold hover:underline">Clear All</button>
              )}
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Category</h4>
                <div className="flex flex-col gap-3">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        className="w-5 h-5 text-primary-600 border-slate-300 focus:ring-primary-500 rounded-full"
                      />
                      <span className={`capitalize ${category === cat ? 'text-primary-600 font-bold' : 'text-slate-600 group-hover:text-primary-500'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Minimum Rating</h4>
                <div className="flex flex-col gap-3">
                  {[4, 3, 2, 1].map((r) => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="rating" 
                        checked={Number(rating) === r}
                        onChange={() => setRating(r.toString())}
                        className="w-5 h-5 text-primary-600 border-slate-300 focus:ring-primary-500 rounded-full"
                      />
                      <span className={`flex items-center gap-1 ${Number(rating) === r ? 'text-primary-600 font-bold' : 'text-slate-600'}`}>
                        {r}+ Stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:w-3/4">
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-3xl font-display">All Destinations</h2>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <form onSubmit={handleSearch} className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search destinations..." 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-white border border-slate-200 py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </form>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden btn bg-white border border-slate-200 text-slate-600 p-3"
              >
                <Filter size={20} />
              </button>

              {userInfo && userInfo.role === 'admin' && (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary flex items-center gap-2 px-4 py-3 shadow-lg shadow-primary-600/20"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add Destination</span>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-xl mb-2">No Destinations Found</h3>
                <p className="text-slate-500 mb-8">We couldn't find matches in our current records.</p>
                
                {keyword && (
                  <div className="max-w-md mx-auto p-6 bg-primary-50 rounded-2xl border border-primary-100 mb-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-center gap-2 text-primary-600 mb-3">
                      <Sparkles size={20} />
                      <span className="font-bold uppercase tracking-widest text-xs">AI Power-Up</span>
                    </div>
                    <h4 className="text-lg font-display text-primary-900 mb-2">Wanderlust doesn't stop here!</h4>
                    <p className="text-sm text-primary-700 mb-6">
                      Let Gemini AI craft a professional travel profile and 3-day plan for <span className="font-bold italic">"{keyword}"</span> just for you.
                    </p>
                    <button 
                      onClick={handleAiSearch} 
                      disabled={aiLoading}
                      className="btn btn-primary w-full flex items-center justify-center gap-2 py-4 shadow-xl shadow-primary-600/20"
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Generating Dream Trip...
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          Generate Plan with AI
                        </>
                      )}
                    </button>
                  </div>
                )}

                <button onClick={clearFilters} className="text-slate-500 hover:text-primary-600 font-bold transition-colors">
                  Or Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => (
                  <DestinationCard key={dest._id} destination={dest} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPageNumber(page - 1)}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => setPageNumber(x + 1)}
                      className={`w-10 h-10 rounded-full font-bold transition-all ${
                        x + 1 === page
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {x + 1}
                    </button>
                  ))}

                  <button 
                    disabled={page === pages}
                    onClick={() => setPageNumber(page + 1)}
                    className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {showAiResults && aiData && (
        <div className="mt-16 animate-in fade-in zoom-in duration-500">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
              <Compass size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-display">AI Generated Plan: {aiData.name}</h2>
              <p className="text-slate-500">Tailored itinerary and insights for your search</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <AiInsights 
              destination={{
                name: aiData.name,
                location: aiData.location,
                category: aiData.category,
                description: aiData.description
              }} 
              userInfo={userInfo} 
              initialInsights={aiData}
            />
          </div>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setShowAiResults(false);
                setKeyword('');
              }}
              className="text-slate-400 hover:text-primary-600 transition-colors text-sm font-medium"
            >
              Close AI Plan & Return to Search
            </button>
          </div>
        </div>
      )}

      <AddDestinationModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => dispatch(fetchDestinations({ keyword, pageNumber, category, rating }))}
      />
    </div>
  );
};

export default Destinations;
