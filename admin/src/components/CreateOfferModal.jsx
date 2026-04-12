import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { X } from 'lucide-react';
import api from '../utils/axios';

const CreateOfferModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Restaurant',
    expiryDate: '',
    address: ''
  });
  // Coordinates: [lng, lat] for MongoDB, [lat, lng] for map
  const [coordinates, setCoordinates] = useState(null); // [lat, lng]
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Map click handler
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setCoordinates([e.latlng.lat, e.latlng.lng]);
      }
    });
    return coordinates ? (
      <Marker position={coordinates} />
    ) : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let coords = coordinates;
      // If no map click, geocode address
      if (!coords && formData.address) {
        const query = encodeURIComponent(formData.address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en' }
        });
        const data = await res.json();
        if (data && data.length > 0) {
          coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        } else {
          setError('Could not find location for the given address.');
          setIsLoading(false);
          return;
        }
      }
      if (!coords) {
        setError('Please provide an address or pick a location on the map.');
        setIsLoading(false);
        return;
      }
      // MongoDB expects [lng, lat]
      const mongoCoords = [coords[1], coords[0]];
      const payload = {
        ...formData,
        location: {
          type: 'Point',
          coordinates: mongoCoords
        }
      };

      await api.post('/offers', payload);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        image: '',
        category: 'Restaurant',
        expiryDate: '',
        address: ''
      });
      setCoordinates(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create offer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--spacing-lg)'
    }}>
      <div className="card glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Create New Offer</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 'var(--spacing-md)' }}>
            <label className="form-label" htmlFor="address">Address / Place</label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="e.g. 123 Main St, City or Business Name"
              value={formData.address}
              onChange={handleChange}
            />
            <small>Type an address and/or pick a location on the map below.</small>
          </div>

          {/* Map Picker */}
          <div style={{ height: 250, marginBottom: 'var(--spacing-md)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <MapContainer
              center={coordinates || [20.5937, 78.9629]} // Default: India
              zoom={coordinates ? 15 : 5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
            </MapContainer>
          </div>
          <div className="form-group" style={{ marginBottom: 'var(--spacing-md)' }}>
            <label className="form-label" htmlFor="title">Offer Title</label>
            <input 
              required
              id="title"
              name="title"
              type="text" 
              className="form-control" 
              placeholder="e.g. 50% Off Premium Coffee"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--spacing-md)' }}>
            <label className="form-label" htmlFor="description">Description</label>
            <textarea 
              required
              id="description"
              name="description"
              className="form-control" 
              rows="3"
              placeholder="Describe the offer details and conditions..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--spacing-md)' }}>
            <label className="form-label" htmlFor="image">Image URL</label>
            <input 
              required
              id="image"
              name="image"
              type="url" 
              className="form-control" 
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="category">Category</label>
              <select 
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Retail">Retail</option>
                <option value="Service">Service</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="expiryDate">Expiry Date</label>
              <input 
                required
                id="expiryDate"
                name="expiryDate"
                type="date" 
                className="form-control" 
                value={formData.expiryDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-sm">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOfferModal;
