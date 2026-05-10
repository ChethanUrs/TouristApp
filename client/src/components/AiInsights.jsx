import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Calendar, Map, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AiInsights = ({ destination, userInfo, initialInsights }) => {
  const [insights, setInsights] = useState(initialInsights || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post('http://localhost:5000/api/ai/insights', {
        name: destination.name,
        location: destination.location,
        category: destination.category
      }, config);
      setInsights(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get AI insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border border-blue-100 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles size={120} className="text-indigo-600" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-display font-bold text-indigo-900 flex items-center gap-3">
            <Sparkles className="text-indigo-600" />
            AI Travel Buddy
          </h2>
          <p className="text-indigo-700/70 mt-1">Advanced insights powered by Gemini AI</p>
        </div>
        
        {!insights && !loading && (
          <button 
            onClick={fetchInsights}
            className="btn bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
          >
            Generate Insights
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-12 flex flex-col items-center justify-center py-12"
          >
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-indigo-900 font-medium animate-pulse">Our AI is planning your perfect trip...</p>
          </motion.div>
        )}

        {insights && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* 3-Day Itinerary */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white">
              <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-indigo-600" />
                Suggested 3-Day Itinerary
              </h3>
              <div className="space-y-4">
                {typeof insights.itinerary === 'object' ? (
                  Object.entries(insights.itinerary).map(([day, activities]) => (
                    <div key={day} className="flex gap-4">
                      <div className="w-12 flex-shrink-0 font-bold text-indigo-400 text-sm pt-1 uppercase">{day}</div>
                      <div className="text-slate-600 text-sm leading-relaxed">{activities}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 text-sm leading-relaxed">{insights.itinerary}</p>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {/* Hidden Gems */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-4">
                  <Map size={18} className="text-indigo-600" />
                  Hidden Gems Nearby
                </h3>
                <ul className="space-y-3">
                  {insights.hiddenGems.map((gem, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                      {gem}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Local Tips & Best Time */}
              <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow-xl shadow-indigo-200">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Info size={18} />
                  Insider Knowledge
                </h3>
                <p className="text-indigo-50 text-sm mb-6 leading-relaxed">
                  <span className="font-bold">Best Time:</span> {insights.bestTimeToVisit}
                </p>
                <div className="space-y-3">
                  {insights.localTips.map((tip, i) => (
                    <p key={i} className="text-indigo-100 text-xs flex gap-2">
                      <span>•</span> {tip}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}
    </div>
  );
};

export default AiInsights;
