import React, { useEffect, useState } from 'react';
import { useLocation } from '../context/LocationContext';
import api from '../utils/api';
import OfferCard from '../components/OfferCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Fix typical leaflet marker icon issue in React (ESM compatible)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RecenterCenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return null;
};

const CustomMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Home = () => {
  const { location, loading: locLoading, error: locError } = useLocation();
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNearby = async () => {
      if (!location) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/offers/nearby?lat=${location.lat}&lng=${location.lng}&distance=10000`);
        setOffers(res.data.data.offers || []);
      } catch (err) {
        console.error('Error fetching nearby offers', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNearby();
  }, [location]);

  return (
    <div className="app-container">
      {/* Top Bar Glass */}
      <header className="glass-nav" style={{
        position: 'sticky', top: 0, zIndex: 'var(--z-header)',
        padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-xs">
          <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.5rem', borderRadius: '50%' }}>
            <MapPin size={20} color="var(--primary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Discover</h1>
            <p style={{ fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Navigation size={10} /> {location ? 'Location Active' : 'Locating...'}
            </p>
          </div>
        </div>
      </header>

      {/* Map Section */}
      <div style={{ height: '300px', width: '100%', position: 'relative', zIndex: 'var(--z-map)' }}>
        {locLoading ? (
           <div className="flex justify-center items-center" style={{ height: '100%', backgroundColor: 'var(--surface-alt)' }}>
             <div className="spinner" style={{ border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
           </div>
        ) : locError ? (
           <div className="flex justify-center items-center" style={{ height: '100%', backgroundColor: 'var(--surface-light)', padding: '1rem', textAlign: 'center' }}>
             <p>{locError}</p>
           </div>
        ) : location ? (
          <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterCenter lat={location.lat} lng={location.lng} />
            <Marker position={[location.lat, location.lng]}>
              <Popup>You are here</Popup>
            </Marker>
            
            {offers.map(offer => {
               if(offer.location && offer.location.coordinates) {
                 // MongoDB geo coordinates are [lng, lat]
                 const [lng, lat] = offer.location.coordinates;
                 return (
                   <Marker key={offer._id} position={[lat, lng]} icon={CustomMarker}>
                     <Popup>
                       <b>{offer.title}</b><br/>{offer.category}
                     </Popup>
                   </Marker>
                 );
               }
               return null;
            })}
          </MapContainer>
        ) : null}
      </div>

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>

      {/* Horizontal Carousel Section */}
      <div style={{ padding: 'var(--spacing-md) 0' }}>
        <div className="flex justify-between items-center" style={{ padding: '0 var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
           <h2>Top Nearby Picks</h2>
           <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>See All</span>
        </div>
        
        {isLoading ? (
           <p style={{ padding: '0 var(--spacing-md)' }}>Loading offers...</p>
        ) : offers.length > 0 ? (
          <div className="scroll-x" style={{ padding: '0 var(--spacing-md)', gap: 'var(--spacing-md)' }}>
            {offers.map(offer => (
              <OfferCard key={offer._id} offer={offer} horizontal={false} />
            ))}
          </div>
        ) : (
          <p style={{ padding: '0 var(--spacing-md)' }}>No offers found nearby. Try increasing the radius.</p>
        )}
      </div>

      {/* Categories */}
      <div style={{ padding: 'var(--spacing-md)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Browse Categories</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-sm)' }}>
           {['Restaurant', 'Retail', 'Service', 'Entertainment'].map((cat, i) => (
             <div key={i} className="card glass-panel flex flex-col items-center justify-center" style={{ padding: '1.5rem 1rem', cursor: 'pointer' }}>
               <h3 style={{ fontSize: '1rem', margin: 0 }}>{cat}</h3>
             </div>
           ))}
        </div>
      </div>
      
    </div>
  );
};

export default Home;
