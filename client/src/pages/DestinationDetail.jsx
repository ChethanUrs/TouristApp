import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationById } from '../store/slices/destinationSlice';
import Rating from '../components/Rating';
import { MapPin, Calendar, Users, Star, ArrowLeft, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import AiInsights from '../components/AiInsights';

const DestinationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { destination, loading, error } = useSelector((state) => state.destinations);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDestinationById(id));
  }, [dispatch, id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(`http://localhost:5000/api/destinations/${id}/reviews`, { rating, comment }, config);
      toast.success('Review submitted successfully');
      setRating(0);
      setComment('');
      dispatch(fetchDestinationById(id));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!destination) return null;

  return (
    <div className="pb-20">
      {/* Header / Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/destinations" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-medium transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Destinations</span>
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200"
            >
              <img 
                src={destination.images[activeImage]} 
                alt={destination.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-2">
              {destination.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-4 transition-all ${activeImage === idx ? 'border-primary-600 ring-2 ring-primary-600/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 text-primary-600 font-bold uppercase tracking-wider text-sm mb-4">
                <span className="px-3 py-1 bg-primary-50 rounded-full">{destination.category}</span>
                {destination.isFeatured && <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full">Featured</span>}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">{destination.name}</h1>
              <div className="flex items-center gap-4 text-slate-500 text-lg">
                <div className="flex items-center gap-1">
                  <MapPin size={20} />
                  <span>{destination.location.city}, {destination.location.country}</span>
                </div>
                <div className="flex items-center gap-1 border-l pl-4 border-slate-200">
                  <Rating value={destination.rating} text={`${destination.numReviews} reviews`} />
                </div>
              </div>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed border-t border-slate-100 pt-8">
              {destination.description}
            </p>

            <AiInsights destination={destination} userInfo={userInfo} />

            <div className="grid grid-cols-2 gap-6 py-8 border-y border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary-600">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Best Time</p>
                  <p className="font-bold text-slate-800">All Year Round</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary-600">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-medium">Group Size</p>
                  <p className="font-bold text-slate-800">2 - 15 People</p>
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full py-4 text-lg rounded-2xl shadow-xl shadow-primary-600/20">
              Plan Your Trip Now
            </button>
          </div>
        </div>

        {/* Map Section */}
        <section className="mt-24">
          <h2 className="text-3xl mb-8">Location on Map</h2>
          <div className="h-[400px] rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            {destination.location.coordinates ? (
              <MapContainer center={[destination.location.coordinates.lat, destination.location.coordinates.lng]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[destination.location.coordinates.lat, destination.location.coordinates.lng]}>
                  <Popup>{destination.name}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                Map coordinates not available
              </div>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-3xl">Guest Reviews</h2>
            
            {destination.reviews.length === 0 ? (
              <p className="text-slate-500 italic">No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div className="space-y-8">
                {destination.reviews.map((review) => (
                  <div key={review._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex gap-6">
                    <img src={review.user.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-4 border-slate-50 shadow-sm" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg">{review.user.name}</h4>
                        <span className="text-sm text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Rating value={review.rating} />
                      <p className="mt-4 text-slate-600 italic">"{review.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl sticky top-32">
              <h3 className="text-2xl mb-6">Add a Review</h3>
              
              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-2 rounded-xl transition-all ${rating >= star ? 'text-yellow-400' : 'text-slate-200'}`}
                        >
                          <Star size={28} className={rating >= star ? 'fill-current' : ''} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Comment</label>
                    <textarea 
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="input py-3 resize-none"
                      placeholder="Share your thoughts about this place..."
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-full py-4 rounded-xl">
                    Submit Review <Send size={18} />
                  </button>
                </form>
              ) : (
                <div className="bg-slate-50 p-6 rounded-2xl text-center">
                  <p className="text-slate-600 mb-4">Please log in to write a review.</p>
                  <Link to="/login" className="btn btn-outline w-full">Log In</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DestinationDetail;
