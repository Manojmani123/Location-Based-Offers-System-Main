import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import OfferCard from '../components/OfferCard';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import CreateOfferModal from '../components/CreateOfferModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchOffers = async () => {
    try {
      const res = await api.get('/offers/me');
      setOffers(res.data.data.offers);
    } catch (error) {
      console.error("Failed to fetch offers", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleEdit = (offer) => {
    alert(`Edit offer: ${offer.title}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(o => o.id !== id));
    }
  };

  return (
    <div className="flex" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: 'var(--spacing-xl)' }}>
        
        {/* Header */}
        <header className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>Welcome back, {user?.name}</h1>
            <p style={{ margin: 0 }}>Here's what's happening with your business today.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={20} />
            Create Offer
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
          
          <div className="card glass-panel flex flex-col justify-center">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Offers</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{offers.length}</p>
          </div>
          
          <div className="card glass-panel flex flex-col justify-center">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Offers</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--success-color)' }}>
              {offers.filter(o => o.status === 'active').length}
            </p>
          </div>
          
          <div className="card glass-panel flex flex-col justify-center">
            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Views</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: 'var(--primary-color)' }}>
              {offers.reduce((acc, curr) => acc + curr.views, 0).toLocaleString()}
            </p>
          </div>

        </div>

        {/* Offers Section */}
        <section>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h2>Recent Offers</h2>
            <div className="flex gap-sm">
              <select className="form-control" style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 1rem' }}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
          
          {offers.length > 0 ? (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
              {offers.map(offer => (
                <OfferCard 
                  key={offer._id} 
                  offer={offer} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--surface-light)', borderRadius: '50%', marginBottom: 'var(--spacing-md)' }}>
                <Plus size={32} color="var(--primary-color)" />
              </div>
              <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>No offers yet</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto var(--spacing-lg)' }}>Create your first offer to start attracting customers to your business.</p>
              <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>Create Your First Offer</button>
            </div>
          )}
        </section>

      </main>

      <CreateOfferModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchOffers} 
      />
    </div>
  );
};

export default Dashboard;
