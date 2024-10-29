import React from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { Coordinates } from '../types';

interface MapComponentProps {
  center?: Coordinates;
  markers?: Coordinates[];
  radius?: number;
  apiKey: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  center, 
  markers = [], 
  radius,
  apiKey 
}) => {
  const mapStyles: React.CSSProperties = {
    height: "100%",
    width: "100%",
    position: "relative"
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative'
  };

  const defaultCenter: Coordinates = {
    lat: 40.7128,
    lng: -74.0060
  };

  return (
    <div style={containerStyle}>
      
      <LoadScript 
        googleMapsApiKey={apiKey}
        loadingElement={
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-gray-600">Loading Google Maps...</div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={center || defaultCenter}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker}
            />
          ))}
          {center && radius && (
            <Circle
              center={center}
              radius={radius * 1000}
              options={{
                fillColor: '#4299e1',
                fillOpacity: 0.3,
                strokeColor: '#3182ce',
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;