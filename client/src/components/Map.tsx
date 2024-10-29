import React, { useEffect, useRef } from 'react';

const GoogleMap = ({ apiKey, center = { lat: 40.7128, lng: -74.0060 }, zoom = 12 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [], // Add custom styles here if needed
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });
      }
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        // Clean up map instance if needed
      }
    };
  }, [apiKey, center, zoom]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-lg shadow-md"
      style={{ minHeight: '400px' }}
    />
  );
};

export default GoogleMap;
