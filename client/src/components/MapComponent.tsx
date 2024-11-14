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
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

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

    // Initialize PlacesService
    placesServiceRef.current = new google.maps.places.PlacesService(mapRef.current);

    // Create a single InfoWindow instance
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add markers for the input addresses
    markers.forEach((position) => {
      const marker = new google.maps.Marker({
        position,
        map: mapRef.current!,
      });
      markersRef.current.push(marker);
    });

    // Function to create a custom icon with a colored background circle
    const createCustomIcon = (iconUrl: string) => {
      const canvas = document.createElement('canvas');
      const size = 50; // Adjust size as needed
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Draw background circle
        ctx.fillStyle = '#ffffff'; // Set the circle color (white for contrast with red background)
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2.5, 0, Math.PI * 2); // Circle shape
        ctx.fill();

        // Draw the icon image on top
        const image = new Image();
        image.src = iconUrl;
        image.onload = () => {
          ctx.drawImage(image, size / 4, size / 4, size / 2, size / 2); // Center the icon image
        };

        return canvas.toDataURL(); // Return data URL of the custom icon
      }
      return iconUrl; // Fallback to original icon URL if canvas fails
    };

    places.forEach((place) => {
      if (place.geometry && place.geometry.location) {
        // Function to create a custom icon with a colored background circle
        const createCustomIcon = (iconUrl: string, marker: google.maps.Marker) => {
          const canvas = document.createElement('canvas');
          const size = 50; // Adjust size as needed
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
    
          if (ctx) {
            // Draw background circle
            ctx.fillStyle = '#ffffff'; // Set the circle color (white for contrast with red background)
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2.5, 0, Math.PI * 2); // Circle shape
            ctx.fill();
    
            // Draw the icon image on top
            const image = new Image();
            image.src = iconUrl;
            image.onload = () => {
              ctx.drawImage(image, size / 4, size / 4, size / 2, size / 2); // Center the icon image
              marker.setIcon({
                url: canvas.toDataURL(), // Set the completed icon with background
                scaledSize: new google.maps.Size(25, 25), // Adjust size for the final icon
              });
            };
          }
        };
    
        // Create marker with temporary default icon
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: mapRef.current!,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Temporary default icon
            scaledSize: new google.maps.Size(25, 25),
          },
        });
    
        // Call function to set custom icon with background circle
        if (place.icon) {
          createCustomIcon(place.icon, marker);
        }
    
        // Attach click event to marker
        marker.addListener('click', () => {
          if (placesServiceRef.current && place.place_id) {
            placesServiceRef.current.getDetails(
              {
                placeId: place.place_id,
                fields: [
                  'name',
                  'formatted_address',
                  'formatted_phone_number', 
                  'website',                
                  'geometry',
                  'rating',
                  'icon',
                ],
              },
              (details, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && details) {
                  // Display details including phone number and website if available
                  const contentString = `
                    <div style="max-width: 200px; color: black;">
                    <img src="${details.icon}" alt="Place Icon" style="width: 24px; height: 24px; margin-bottom: 8px;" />
                      <h3>${details.name || 'No Name Available'}</h3>
                      <p>${details.formatted_address || 'No Address Available'}</p>
                      <p>Rating: ${details.rating !== undefined ? details.rating : 'N/A'}</p>
                      ${details.formatted_phone_number ? `<p>Phone: ${details.formatted_phone_number}</p>` : ''}
                      ${
                        details.website
                        ? `<p>Website: <a href="${details.website}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;" onmouseover="this.style.color='blue';" onmouseout="this.style.color='inherit';">${new URL(details.website).hostname}</a></p>`
                        : '<p>No Website Available</p>'
                      }
                    </div>
                  `;
                  infoWindowRef.current!.setContent(contentString);
                  infoWindowRef.current!.open(mapRef.current, marker);
                } else {
                  console.error('Failed to get place details:', status);
                }
              }
            );
          }
        });
    
        markersRef.current.push(marker);
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
        fillColor: '#AA0000',
        strokeColor: '#AA0000',
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
    />
  );
};

export default MapComponent;
