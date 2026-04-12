import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Clock, MapPin, Share2, BookmarkPlus } from 'lucide-react';

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  // We should ideally fetch by ID. Backend offerController needs a /offers/:id endpoint.
  // For now, let's fetch all (or just /offers which returns all) and find it. 
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await api.get('/offers'); // Adjust if you make a dedicated /offers/:id endpoint
        const data = res.data.data.offers;
        const found = data.find(o => o._id === id);
        setOffer(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [id]);

  if (loading) return <div className="app-container flex justify-center items-center"><p>Loading offer...</p></div>;
  if (!offer) return <div className="app-container flex justify-center items-center"><p>Offer not found.</p></div>;

  return (
    <div className="app-container" style={{ paddingBottom: '100px' }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '350px', width: '100%' }}>
        <img 
          src={offer.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80'} 
          alt={offer.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 'var(--spacing-md)', backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}>
           <button 
             onClick={() => navigate(-1)}
             className="btn-icon" 
             style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: 'none' }}
           >
             <ArrowLeft size={20} />
           </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        position: 'relative', 
        marginTop: '-30px', 
        backgroundColor: 'var(--bg-color)', 
        borderTopLeftRadius: '30px', 
        borderTopRightRadius: '30px', 
        padding: 'var(--spacing-xl) var(--spacing-md)',
        minHeight: '400px'
      }}>
        <div className="flex justify-between items-start" style={{ marginBottom: 'var(--spacing-md)' }}>
          <div>
            <span className="status-pill" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '0.5rem', display: 'inline-block' }}>
              {offer.category}
            </span>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{offer.title}</h1>
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>By {offer.createdBy?.name || 'Local Business'}</p>
          </div>
          <button className="btn-icon" style={{ flexShrink: 0, border: 'none', backgroundColor: '#f1f5f9' }}>
             <Share2 size={20} />
          </button>
        </div>

        <div className="flex gap-md" style={{ marginBottom: 'var(--spacing-xl)' }}>
           <div className="flex items-center gap-xs" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Clock size={16} />
              <span>Expires {new Date(offer.expiryDate).toLocaleDateString()}</span>
           </div>
           <div className="flex items-center gap-xs" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <MapPin size={16} />
              <span>{offer.location?.coordinates ? 
                `Loc: ${offer.location.coordinates[1].toFixed(2)}, ${offer.location.coordinates[0].toFixed(2)}` 
                : 'Various Locations'}
              </span>
           </div>
        </div>

        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>The Details</h3>
        <p style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>{offer.description}</p>
        
        {/* Placeholder map logic or instructions */}
        <div className="card" style={{ marginTop: 'var(--spacing-xl)', backgroundColor: 'var(--surface-alt)', border: 'none' }}>
           <h4 style={{ marginBottom: '0.5rem' }}>How to redeem</h4>
           <p style={{ fontSize: '0.9rem', margin: 0 }}>Visit the store location and show this offer screen to the staff before the expiry date.</p>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="glass-nav" style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        padding: '1rem var(--spacing-md)', 
        display: 'flex', gap: 'var(--spacing-md)', zIndex: 100,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.05)'
      }}>
        <button className="btn-icon" style={{ borderRadius: 'var(--radius-lg)' }}>
           <BookmarkPlus size={24} color="var(--text-main)" />
        </button>
        <button className="btn btn-primary" style={{ flex: 1, borderRadius: 'var(--radius-lg)' }}>
          Get Directions
        </button>
      </div>

    </div>
  );
};

export default OfferDetails;
