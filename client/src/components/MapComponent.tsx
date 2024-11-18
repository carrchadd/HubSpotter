// MapComponent.tsx
import React, { useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Coordinates } from '../types';

interface MapComponentProps {
  apiKey: string;
  markers: Coordinates[];
  center?: Coordinates;
  radius: number;
  places: google.maps.places.PlaceResult[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  apiKey,
  markers,
  center,
  radius,
  places,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['geometry', 'places'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const addressMarkersRef = useRef<google.maps.Marker[]>([]);
  const placeMarkersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (loadError) {
      console.error('Error loading Google Maps API:', loadError);
      return;
    }

    if (!isLoaded) {
      return;
    }

    if (!mapRef.current) {
      return;
    }

    // Initialize InfoWindow
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    // Clear existing address markers
    addressMarkersRef.current.forEach((marker) => marker.setMap(null));
    addressMarkersRef.current = [];

    // Add markers for the input addresses
    markers.forEach((position) => {
      const marker = new google.maps.Marker({
        position,
        map: mapRef.current!,
        icon: {
          url: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_blackO.png', // Different icon for addresses
          scaledSize: new google.maps.Size(20, 30),
        },
      });
      addressMarkersRef.current.push(marker);
    });

    // Clear existing place markers
    placeMarkersRef.current.forEach((marker) => marker.setMap(null));
    placeMarkersRef.current = [];

    // Add markers for places
    places.forEach((place) => {
      if (place.geometry && place.geometry.location) {
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: mapRef.current!,
          icon: {
            url: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png', // Different icon for places
            scaledSize: new google.maps.Size(20, 25),
          },
        });

        // Attach click event to marker
        marker.addListener('click', () => {
          if (!infoWindowRef.current) return;

          const content = `
            <div style="max-width: 200px; color: black;">
              <img src="${place.icon}" alt="Place Icon" style="width: 24px; height: 24px; margin-bottom: 8px;" />
              <h3>${place.name || 'No Name Available'}</h3>
              <p>${place.formatted_address || place.vicinity || 'No Address Available'}</p>
              <p>Rating: ${place.rating !== undefined ? place.rating : 'N/A'}</p>
              ${
                place.formatted_phone_number
                  ? `<p>Phone: ${place.formatted_phone_number}</p>`
                  : '<p>Phone: Not Available</p>'
              }
              ${
                place.website
                  ? `<p>Website: <a href="${place.website}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">${new URL(place.website).hostname}</a></p>`
                  : '<p>Website: Not Available</p>'
              }
            </div>
          `;

          infoWindowRef.current.setContent(content);
          infoWindowRef.current.setPosition(marker.getPosition());
          infoWindowRef.current.open(mapRef.current, marker);
        });

        placeMarkersRef.current.push(marker);
      }
    });

    // Draw the circle
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }
    if (center) {
      circleRef.current = new google.maps.Circle({
        map: mapRef.current!,
        center: center,
        radius: radius * 1000, // Assuming radius is in kilometers
        fillColor: '#3A81EE',
        strokeColor: '#0002fe',
        fillOpacity: 0.2,
      });
    }
  }, [isLoaded, loadError, markers, places, center, radius]);

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
      zoom={center ? 12 : 2}
      options={{
        mapId: 'db095b2841434746', 
      }}
    />
  );
};

export default MapComponent;
