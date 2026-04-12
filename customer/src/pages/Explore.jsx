import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import OfferCard from '../components/OfferCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const Explore = () => {
  const { location } = useLocation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [distance, setDistance] = useState(10); // km

  const fetchOffers = async () => {
    setLoading(true);
    try {
      // If we have location, use /nearby. Else fallback to / 
      let endpoint = '/offers';
      
      if (location) {
        endpoint = `/offers/nearby?lat=${location.lat}&lng=${location.lng}&distance=${distance * 1000}`;
      }
      
      const res = await api.get(endpoint);
      let data = res.data.data.offers || [];
      
      // Client side filtering for search & category if API doesn't support them natively
      if (search) {
        data = data.filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase()));
      }
      if (category) {
        data = data.filter(o => o.category === category);
      }
      
      setOffers(data);
    } catch (err) {
      console.error('Error fetching explore offers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch automatically if location changes or initially. Wait for debounce on search.
    const timeout = setTimeout(() => {
      fetchOffers();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, category, distance, location]);

  return (
    <div className="app-container" style={{ padding: 'var(--spacing-md)' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Explore Offers</h1>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: 'var(--spacing-md)' }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search pizza, spa, haircuts..." 
            style={{ paddingLeft: '3rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="card glass-panel flex-col gap-sm" style={{ padding: '1rem' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={16} /> Filters
            </span>
          </div>
          
          <div className="flex gap-md">
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</label>
              <select className="input-field" style={{ padding: '0.5rem' }} value={category} onChange={(e)=>setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Retail">Retail</option>
                <option value="Service">Service</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distance: {distance}km</label>
              <input 
                type="range" 
                min="1" max="50" step="1" 
                value={distance} 
                onChange={(e) => setDistance(e.target.value)}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <div>
        <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.1rem' }}>
          {offers.length} {offers.length === 1 ? 'Offer' : 'Offers'} Found
        </h3>
        
        {loading ? (
           <p>Searching...</p>
        ) : (
          <div className="flex flex-col gap-md">
            {offers.map(offer => (
              <OfferCard key={offer._id} offer={offer} horizontal={true} />
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Explore;
