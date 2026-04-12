import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2, CheckCircle, Search, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/offers');
      setOffers(res.data?.data?.offers || res.data || []);
    } catch (err) {
      toast.error('Failed to load offers');
      // Mock data in case DB is unreachable
      setOffers([
        { _id: '1', title: '50% off all Services', business: { businessName: 'TechCorp' }, isActive: false, isApproved: false },
        { _id: '2', title: 'Free Dessert with Meal', business: { businessName: 'Local Eats Market' }, isActive: true, isApproved: true },
        { _id: '3', title: 'Buy 1 Get 1 Free', business: { businessName: 'Store XYZ' }, isActive: true, isApproved: true, flagged: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await api.patch(`/offers/${id}/approve`);
      toast.success('Offer approved successfully');
      setOffers(offers.map(o => o._id === id ? { ...o, isApproved: true, isActive: true } : o));
    } catch (err) {
      toast.error('Failed to approve offer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this content? This action cannot be undone.")) return;
    try {
      setActionLoading(id);
      await api.delete(`/offers/${id}`);
      toast.success('Content deleted');
      setOffers(offers.filter(o => o._id !== id));
    } catch (err) {
      toast.error('Failed to delete offer');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Content Moderation & Offers</h2>
          <p className="text-sm text-slate-500">Approve new offers or remove inappropriate content.</p>
        </div>
        <div className="relative w-64 hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search offers..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Offer Title</th>
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center mb-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                    Loading data...
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No offers found.
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer._id} className={`transition-colors ${offer.flagged ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-slate-50/50'}`}>
                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center">
                      {offer.flagged && <AlertCircle size={14} className="text-red-500 mr-2" />}
                      {offer.title}
                    </td>
                    <td className="px-6 py-4">
                      {offer.business?.businessName || 'Unknown Business'}
                    </td>
                    <td className="px-6 py-4">
                      {offer.isApproved ? (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium border border-emerald-100">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-md text-xs font-medium border border-amber-100">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {!offer.isApproved && (
                        <button 
                          onClick={() => handleApprove(offer._id)}
                          disabled={actionLoading === offer._id}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={14} className="mr-1.5" /> Approve
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(offer._id)}
                        disabled={actionLoading === offer._id}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                        title="Delete Content"
                      >
                        <Trash2 size={14} className="mr-1.5" /> {offer.flagged ? 'Force Delete' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Offers;
