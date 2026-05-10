import React, { useState } from 'react';
import { X, Sparkles, Loader2, Save, MapPin, Globe, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AddDestinationModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    country: '',
    category: 'city',
    lat: '',
    lng: '',
    images: ['', ''],
    isFeatured: false
  });

  const { userInfo } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const fetchWithAI = async () => {
    if (!formData.name) {
      toast.error('Please enter a destination name first');
      return;
    }

    setAiLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      const { data } = await axios.post('/api/destinations/ai-fetch', { name: formData.name }, config);
      
      setFormData(prev => ({
        ...prev,
        description: data.description || prev.description,
        city: data.location?.city || prev.city,
        country: data.location?.country || prev.country,
        category: data.category || prev.category,
        lat: data.location?.coordinates?.lat || prev.lat,
        lng: data.location?.coordinates?.lng || prev.lng,
        // Suggested image keywords can be used here or just kept for manual search
      }));
      
      toast.success('✨ Destination details fetched with AI!');
    } catch (error) {
      toast.error('Failed to fetch details with AI');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };

      const submissionData = {
        name: formData.name,
        description: formData.description,
        location: {
          city: formData.city,
          country: formData.country,
          coordinates: {
            lat: Number(formData.lat),
            lng: Number(formData.lng)
          }
        },
        category: formData.category,
        images: formData.images.filter(img => img.trim() !== ''),
        isFeatured: formData.isFeatured
      };

      await axios.post('/api/destinations', submissionData, config);
      toast.success('Destination added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add destination');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display">Add Destination</h2>
              <p className="text-slate-500">Create a new gem for the world to see</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Destination Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Santorini"
                    className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  <button 
                    type="button"
                    onClick={fetchWithAI}
                    disabled={aiLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    {aiLoading ? 'Fetching...' : 'Fetch with AI'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary-500/20 capitalize"
                >
                  {['beach', 'mountain', 'city', 'heritage', 'adventure'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Latitude</label>
                <input 
                  type="number" 
                  step="any"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="0.0000"
                  className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Longitude</label>
                <input 
                  type="number" 
                  step="any"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="0.0000"
                  className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary-500/20"
              ></textarea>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">Image URLs</label>
              {formData.images.map((url, index) => (
                <div key={index} className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    required
                    placeholder={`Image URL ${index + 1}`}
                    className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-2xl border border-primary-100">
              <input 
                type="checkbox" 
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-bold text-primary-900 cursor-pointer">
                Mark as Featured Destination
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-xl shadow-primary-600/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {loading ? 'Saving Destination...' : 'Save Destination'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddDestinationModal;
