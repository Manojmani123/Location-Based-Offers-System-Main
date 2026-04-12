import React from 'react';
import { Edit2, Trash2, Eye, TrendingUp } from 'lucide-react';

const OfferCard = ({ offer, onEdit, onDelete }) => {
  const status = offer.isApproved ? 'active' : 'pending';
  const imageUrl = offer.image || offer.imageUrl;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* Poster Image */}
      <div style={{ position: 'relative', height: '200px', backgroundColor: 'var(--surface-light)' }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={offer.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No Image
          </div>
        )}
        
        {/* Status Badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span className={`badge ${status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ backgroundColor: status === 'active' ? 'var(--success-color)' : 'var(--surface-color)', color: status === 'active' ? '#fff' : 'var(--text-main)', boxShadow: 'var(--shadow-sm)' }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--spacing-lg)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{offer.title}</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {offer.description}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', margin: 'var(--spacing-md) 0', padding: 'var(--spacing-sm) 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <Eye size={16} />
            {offer.views || 0} Views
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--success-color)', fontSize: '0.875rem' }}>
            <TrendingUp size={16} />
            {offer.clicks || 0} Clicks
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
          <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
            {offer.discount || 'Special Offer'}
          </span>
          <div className="flex gap-sm">
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem' }}
              onClick={() => onEdit(offer)}
              title="Edit Offer"
            >
              <Edit2 size={16} />
            </button>
            <button 
              className="btn btn-danger" 
              style={{ padding: '0.5rem' }}
              onClick={() => onDelete(offer._id)}
              title="Delete Offer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default OfferCard;
