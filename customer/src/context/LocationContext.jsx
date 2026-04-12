import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // { lat, lng }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // For testing when not on HTTPS/mobile or if user denies, we can default to [0,0] or similar
  const askForLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location');
        // Fallback dummy location for dev if needed
        setLocation({ lat: 0, lng: 0 });
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    askForLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, error, loading, retry: askForLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
