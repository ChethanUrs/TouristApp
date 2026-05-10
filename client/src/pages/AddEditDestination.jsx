import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationById } from '../store/slices/destinationSlice';
import { ArrowLeft, Upload, Plus, X, MapPin, Tag, Info } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AddEditDestination = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { destination, loading } = useSelector((state) => state.destinations);
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    country: '',
    lat: '',
    lng: '',
    category: 'beach',
    isFeatured: false,
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      if (!destination || destination._id !== id) {
        dispatch(fetchDestinationById(id));
      } else {
        setFormData({
          name: destination.name,
          description: destination.description,
          city: destination.location.city,
          country: destination.location.country,
          lat: destination.location.coordinates?.lat || '',
          lng: destination.location.coordinates?.lng || '',
          category: destination.category,
          isFeatured: destination.isFeatured,
        });
        setImages(destination.images);
      }
    }
  }, [dispatch, id, destination, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    const uploadData = new FormData();
    
    files.forEach(file => {
      uploadData.append('images', file);
    });

    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('http://localhost:5000/api/upload/multiple', uploadData, config);

      setImages((prev) => [...prev, ...data]);
      setUploading(false);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Image upload failed');
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const destinationData = {
      name: formData.name,
      description: formData.description,
      location: {
        city: formData.city,
        country: formData.country,
        coordinates: {
          lat: Number(formData.lat),
          lng: Number(formData.lng),
        },
      },
      category: formData.category,
      images,
      isFeatured: formData.isFeatured,
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/destinations/${id}`, destinationData, config);
        toast.success('Destination updated');
      } else {
        await axios.post('http://localhost:5000/api/destinations', destinationData, config);
        toast.success('Destination created');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <Link to="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
          <h2 className="text-3xl">{isEditMode ? 'Edit Destination' : 'Add New Destination'}</h2>
        </div>

        <form onSubmit={submitHandler} className="p-8 space-y-10">
          {/* Basic Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-sm">
              <Info size={16} />
              <span>Basic Information</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Destination Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. Grand Canyon"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input bg-white"
                >
                  <option value="beach">Beach</option>
                  <option value="mountain">Mountain</option>
                  <option value="city">City</option>
                  <option value="heritage">Heritage</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="input py-3 resize-none"
                placeholder="Describe this amazing place..."
                required
              ></textarea>
            </div>
          </section>

          {/* Location */}
          <section className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-sm">
              <MapPin size={16} />
              <span>Location Details</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">City</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. Arizona"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Country</label>
                <input 
                  type="text" 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. USA"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Latitude</label>
                <input 
                  type="number" 
                  step="any"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. 36.0544"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Longitude</label>
                <input 
                  type="number" 
                  step="any"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. -112.1401"
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-widest text-sm">
              <Upload size={16} />
              <span>Images</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all text-slate-400 hover:text-primary-600">
                <Plus size={32} />
                <span className="text-xs font-bold mt-2">Add Image</span>
                <input 
                  type="file" 
                  multiple
                  onChange={uploadFileHandler}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
            {uploading && <p className="text-primary-600 text-sm font-medium">Uploading images...</p>}
          </section>

          {/* Extra Options */}
          <section className="pt-6 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-6 h-6 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
              />
              <span className="font-bold text-slate-700">Mark as Featured Destination</span>
            </label>
          </section>

          <div className="pt-10 flex gap-4">
            <button 
              type="submit" 
              className="btn btn-primary flex-1 py-4 text-lg rounded-2xl"
              disabled={loading || uploading}
            >
              {isEditMode ? 'Update Destination' : 'Create Destination'}
            </button>
            <Link to="/admin/dashboard" className="btn btn-outline py-4 px-10 rounded-2xl">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditDestination;
