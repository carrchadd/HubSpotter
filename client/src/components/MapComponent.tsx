// MapComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api';
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
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

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
    // Initialize the PlacesService with the map instance
    placesServiceRef.current = new google.maps.places.PlacesService(map);
  };

  // Handle marker click to fetch place details
  const handleMarkerClick = (place: google.maps.places.PlaceResult) => {
    if (placesServiceRef.current && place.place_id) {
      placesServiceRef.current.getDetails(
        {
          placeId: place.place_id,
          fields: [
            'name',
            'formatted_address',
            'formatted_phone_number',
            'geometry',
            'website',
            'rating',
            'icon',
            // Add any other fields you need
          ],
        },
        (details, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && details) {
            console.log('Place details:', details);
            setSelectedPlace(details);
          } else {
            console.error('Failed to get place details:', status);
            // Fallback to basic info if details not available
            setSelectedPlace(place);
          }
        }
      );
    } else {
      // If PlacesService not available or place_id missing
      setSelectedPlace(place);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedPlace(null);
  };

  return (
    <GoogleMap
      onLoad={onLoadMap}
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center || { lat: 0, lng: 0 }}
      zoom={center ? 12 : 2}
    >
      {/* Markers for the input addresses */}
      {markers.map((marker, index) => (
        <Marker key={`marker-${index}`} position={marker} />
      ))}

      {/* Markers for places of interest */}
      {places.map((place, index) => {
        if (place.geometry && place.geometry.location) {
          return (
            <Marker
              key={`place-${index}`}
              position={{
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              }}
              icon={{
                url: place.icon || '', // Ensure the icon URL is valid
                scaledSize: new google.maps.Size(25, 25),
              }}
              title={place.name}
              onClick={() => handleMarkerClick(place)}
            />
          );
        }
        return null;
      })}

      {/* InfoWindow for selected place */}
      {selectedPlace && selectedPlace.geometry && selectedPlace.geometry.location && (
  <>
    {console.log('Selected Place in Render:', selectedPlace)}
    <InfoWindow
      position={{
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
      }}
      onCloseClick={handleInfoWindowClose}
    >
      <div style={{ maxWidth: '200px', color: 'black' }}>
        <h3>{selectedPlace.name || 'No Name Available'}</h3>
        <p>{selectedPlace.formatted_address || 'No Address Available'}</p>
        <p>Rating: {selectedPlace.rating !== undefined ? selectedPlace.rating : 'N/A'}</p>
        <p>Phone: {selectedPlace.formatted_phone_number || 'N/A'}</p>
        {selectedPlace.website ? (
          <p>
            <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
              Website
            </a>
          </p>
        ) : (
          <p>No Website Available</p>
        )}
      </div>
    </InfoWindow>
  </>
)}
      
    </GoogleMap>
  );
};

export default MapComponent;
