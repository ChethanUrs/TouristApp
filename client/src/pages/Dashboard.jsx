import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinations } from '../store/slices/destinationSlice';
import { Edit, Trash2, Plus, ExternalLink, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { destinations, loading, error } = useSelector((state) => state.destinations);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDestinations({}));
  }, [dispatch]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/destinations/${id}`, config);
        toast.success('Destination deleted');
        dispatch(fetchDestinations({}));
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl mb-2">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your destinations and travel picks</p>
        </div>
        <Link to="/admin/destination/add" className="btn btn-primary">
          <Plus size={20} /> Add Destination
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-5 font-bold text-slate-700">Image</th>
                <th className="px-6 py-5 font-bold text-slate-700">Name</th>
                <th className="px-6 py-5 font-bold text-slate-700">Category</th>
                <th className="px-6 py-5 font-bold text-slate-700">Location</th>
                <th className="px-6 py-5 font-bold text-slate-700">Rating</th>
                <th className="px-6 py-5 font-bold text-slate-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {destinations.map((dest) => (
                <tr key={dest._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <img src={dest.images[0]} alt="" className="w-16 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{dest.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-bold uppercase rounded-full">
                      {dest.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <MapPin size={14} />
                      <span>{dest.location.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{dest.rating.toFixed(1)}</span>
                      <span className="text-slate-400 text-sm">({dest.numReviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <Link 
                        to={`/destination/${dest._id}`} 
                        className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                        title="View"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link 
                        to={`/admin/destination/${dest._id}/edit`} 
                        className="p-2 text-slate-400 hover:text-amber-500 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => deleteHandler(dest._id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {destinations.length === 0 && !loading && (
          <div className="p-12 text-center text-slate-500">
            No destinations found. Start by adding one!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
