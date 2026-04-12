import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import api from '../utils/api';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/businesses/pending');
      // Adjusting based on standard JSend or simple array returns
      setBusinesses(res.data?.data?.businesses || res.data || []);
    } catch (err) {
      toast.error('Failed to load pending businesses');
      // For presentation purposes, load mock data if backend fails
      setBusinesses([
        { _id: '1', businessName: 'TechCorp Solutions', category: 'Service', createdAt: '2023-10-12T10:00:00Z', isVerified: false },
        { _id: '2', businessName: 'Local Eats Market', category: 'Restaurant', createdAt: '2023-10-14T14:30:00Z', isVerified: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await api.patch(`/businesses/${id}/approve`);
      toast.success('Business approved successfully');
      setBusinesses(businesses.filter(b => b._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this business?")) return;
    try {
      setActionLoading(id);
      // Assuming rejection means delete for now, or use a specific endpoint if exists
      await api.delete(`/businesses/${id}`);
      toast.success('Business rejected');
      setBusinesses(businesses.filter(b => b._id !== id));
    } catch (err) {
      toast.error('Failed to reject business (Endpoint might be missing)');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Pending Approvals</h2>
          <p className="text-sm text-slate-500">Review and verify new business registrations.</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg flex items-center text-sm font-medium">
          <Clock size={16} className="mr-2" />
          {businesses.length} Pending
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Business Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Submitted On</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center mb-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                    Loading data...
                  </td>
                </tr>
              ) : businesses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No pending businesses to review.
                  </td>
                </tr>
              ) : (
                businesses.map((business) => (
                  <tr key={business._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 flex items-center">
                      {business.businessName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {business.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(business.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1 rounded-md w-max">
                        <Clock size={14} className="mr-1" /> Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleApprove(business._id)}
                        disabled={actionLoading === business._id}
                        className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={14} className="mr-1.5" /> Approve
                      </button>
                      <button 
                        onClick={() => handleReject(business._id)}
                        disabled={actionLoading === business._id}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <XCircle size={14} className="mr-1.5" /> Reject
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

export default Businesses;
