// MapMidpointFinder.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import MapComponent from './MapComponent';
import { Coordinates, Filters } from '../types';
import { Loader } from '@googlemaps/js-api-loader';

interface MapMidpointFinderProps {
  apiKey: string;
}

const MapMidpointFinder: React.FC<MapMidpointFinderProps> = ({ apiKey }) => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [newAddress, setNewAddress] = useState<string>('');
  const [radius, setRadius] = useState<number>(50);
  const [markers, setMarkers] = useState<Coordinates[]>([]);
  const [center, setCenter] = useState<Coordinates | undefined>();
  const [filters, setFilters] = useState<Filters>({
    restaurants: false,
    entertainment: false,
    parks: false,
    shopping: false,
    kidFriendly: false,
  });
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);

  const handleAddAddress = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newAddress.trim()) {
      setAddresses([...addresses, newAddress.trim()]);
      setNewAddress('');
    }
  };

  const handleRemoveAddress = (index: number): void => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleFilterChange = (filterName: keyof Filters): void => {
    setFilters({
      ...filters,
      [filterName]: !filters[filterName],
    });
  };

  useEffect(() => {
    if (addresses.length === 0) {
      setMarkers([]);
      setCenter(undefined);
      setPlaces([]);
      return;
    }

    const geocodeAddresses = async () => {
      try {
        const geocoder = new google.maps.Geocoder();
        const geocodePromises = addresses.map(
          (address) =>
            new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
              geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results) {
                  resolve(results);
                } else {
                  reject(`Geocoding failed for address: ${address}`);
                }
              });
            })
        );

        const results = await Promise.all(geocodePromises);
        const coordinates = results.map((res) => {
          const location = res[0].geometry.location;
          return { lat: location.lat(), lng: location.lng() };
        });

        console.log('Geocoded coordinates:', coordinates);

        setMarkers(coordinates);

        if (addresses.length >= 2) {
          const directionsService = new google.maps.DirectionsService();

          directionsService.route(
            {
              origin: addresses[0],
              destination: addresses[1],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === 'OK' && result) {
                const route = result.routes[0];
                const path = google.maps.geometry.encoding.decodePath(
                  route.overview_polyline
                );

                let totalDistance = 0;
                const cumulativeDistances = [0];

                for (let i = 1; i < path.length; i++) {
                  const segmentDistance =
                    google.maps.geometry.spherical.computeDistanceBetween(
                      path[i - 1],
                      path[i]
                    );
                  totalDistance += segmentDistance;
                  cumulativeDistances.push(totalDistance);
                }

                const halfDistance = totalDistance / 2;

                let index = cumulativeDistances.findIndex(
                  (dist) => dist >= halfDistance
                );
                if (index === -1) {
                  index = cumulativeDistances.length - 1;
                }

                const prevDistance = cumulativeDistances[index - 1];
                const nextDistance = cumulativeDistances[index];
                const ratio =
                  (halfDistance - prevDistance) / (nextDistance - prevDistance);

                const lat =
                  path[index - 1].lat() +
                  ratio * (path[index].lat() - path[index - 1].lat());
                const lng =
                  path[index - 1].lng() +
                  ratio * (path[index].lng() - path[index - 1].lng());

                const midpoint = { lat, lng };

                setCenter(midpoint);
              } else {
                console.error('Directions request failed due to ' + status);
              }
            }
          );
        } else {
          // If only one address, do not set center
          setCenter(undefined);
          setPlaces([]);
        }
      } catch (error) {
        console.error('Error during geocoding:', error);
      }
    };

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    loader.load().then(() => {
      geocodeAddresses();
    });
  }, [addresses, apiKey]);

  // Use effect to search for places when center or radius or filters change
  useEffect(() => {
    if (!center) {
      setPlaces([]);
      return;
    }

    const fetchPlaces = () => {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      // Determine the types to search for based on filters
      const types: string[] = [];

      if (filters.restaurants) types.push('restaurant');
      if (filters.entertainment) types.push('movie_theater', 'night_club');
      if (filters.parks) types.push('park');
      if (filters.shopping) types.push('shopping_mall');
      if (filters.kidFriendly) types.push('amusement_park', 'zoo');

      if (types.length === 0) {
        // If no filters are selected, clear places
        setPlaces([]);
        return;
      }

      const request: google.maps.places.PlaceSearchRequest = {
        location: center,
        radius: radius * 1000, // Convert to meters
        type: types as any, // Type can be a single type or an array
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setPlaces(results);
        } else {
          console.error('Places search failed due to ' + status);
          setPlaces([]);
        }
      });
    };

    fetchPlaces();
  }, [center, radius, filters]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Map Container */}
      <div className="w-full h-[600px] mb-4 rounded-lg overflow-hidden">
        <MapComponent
          apiKey={apiKey}
          markers={markers}
          center={center}
          radius={radius}
          places={places}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Address Input Section */}
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <form onSubmit={handleAddAddress} className="mb-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewAddress(e.target.value)
                  }
                  placeholder="Enter address"
                  className="flex-grow"
                />
                <Button type="submit">Add</Button>
              </div>
            </form>

            <div className="space-y-2">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span>{address}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAddress(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters Section */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Filters</h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                {(
                  Object.entries(filters) as [keyof Filters, boolean][]
                ).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleFilterChange(key)}
                      className="rounded"
                    />
                    <span className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Radius (km)</h4>
                <Slider
                  value={[radius]}
                  onValueChange={(value) => setRadius(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapMidpointFinder;