import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OfferCard = ({ offer, horizontal = false }) => {
  const navigate = useNavigate();
  // Assume a default category color map
  const catColors = {
    Restaurant: 'var(--primary)',
    Retail: 'var(--secondary)',
    Service: 'var(--success)',
    Other: 'var(--accent)'
  };
  
  const bg = catColors[offer.category] || 'var(--primary)';

  const calculateDaysLeft = (expiry) => {
    const diff = new Date(expiry) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div 
      className={`card ${horizontal ? 'flex items-center gap-sm' : ''}`} 
      style={{ 
        cursor: 'pointer', 
        padding: horizontal ? '0.75rem' : 0,
        minWidth: horizontal ? '300px' : 'auto'
      }}
      onClick={() => navigate(`/offer/${offer._id}`)}
    >
      <div style={{
        position: 'relative',
        width: horizontal ? '80px' : '100%',
        height: horizontal ? '80px' : '180px',
        borderRadius: horizontal ? 'var(--radius-md)' : '0',
        overflow: 'hidden',
        backgroundColor: 'var(--surface-alt)'
      }}>
        <img src={offer.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop'} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        
        {!horizontal && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <span className="status-pill" style={{ backgroundColor: bg, color: '#fff' }}>
              {offer.category}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: horizontal ? 0 : 'var(--spacing-md)', flex: 1 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xs)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {offer.title}
        </h3>
        {!horizontal && (
           <p style={{ fontSize: '0.85rem', marginBottom: 'var(--spacing-sm)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
             {offer.description}
           </p>
        )}
        
        <div className="flex justify-between items-center" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-xs">
            <MapPin size={14} />
            <span>Nearby</span>
          </div>
          <div className="flex items-center gap-xs" style={{ color: 'var(--accent)' }}>
            <Clock size={14} />
            <span>{calculateDaysLeft(offer.expiryDate)} days left</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
