// MapComponent.tsx
import React, { useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Coordinates } from '../types';

interface MapComponentProps {
  apiKey: string;
  markers: Coordinates[];
  center?: Coordinates;
  radius: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  apiKey,
  markers,
  center,
  radius,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['geometry'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    // Remove the previous circle if it exists
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }

    // Add a new circle if center is defined
    if (mapRef.current && center) {
      circleRef.current = new google.maps.Circle({
        map: mapRef.current,
        center: center,
        radius: radius * 1000, // Assuming radius is in kilometers
        fillColor: '#AA0000',
        strokeColor: '#AA0000',
        fillOpacity: 0.2,
      });
    }

    // Cleanup function to remove the circle when component unmounts
    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    };
  }, [center, radius]);

  if (loadError) {
    console.error('Error loading Google Maps API:', loadError);
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  const onLoadMap = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return (
    <GoogleMap
      onLoad={onLoadMap}
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center || { lat: 0, lng: 0 }}
      zoom={center ? 10 : 2}
    >
      {markers.map((marker, index) => (
        <Marker key={index} position={marker} />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
