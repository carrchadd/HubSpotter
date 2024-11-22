// MapMidpointFinder.tsx
import React, { useState, useEffect } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
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
  const [likedPlaces, setLikedPlaces] = useState<Set<string>>(new Set());

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

  useEffect(() => {
    if (!center) {
      setPlaces([]);
      return;
    }

    const fetchPlaces = async () => {
      const service = new google.maps.places.PlacesService(document.createElement('div'));

      const typesMap: { [key in keyof Filters]?: string[] } = {
        restaurants: ['bar', 'cafe', 'restaurant', 'winery'],
        entertainment: [
          'art_gallery',
          'casino',
          'movie_theater',
          'museum',
          'theater',
          'tourist_attraction',
          
        ],
        parks: [
          'park',
          'beach',
          'golf_course',
          'natural_feature',
          'zoo',
          'sports_complex',
          'amusement_park',
          'hiking_trail',
          'stadium',
          'boat_rental',
          'marina',
          'boat_launch',
        ],
        shopping: ['shopping_mall', 'boutique'],
        kidFriendly: ['amusement_park', 'zoo', 'playground'],
      };

      const selectedTypes: string[] = [];
      Object.entries(filters).forEach(([key, value]) => {
        if (value && typesMap[key as keyof Filters]) {
          selectedTypes.push(...typesMap[key as keyof Filters]!);
        }
      });

      if (selectedTypes.length === 0) {
        setPlaces([]);
        return;
      }

      try {
        const searchPromises = selectedTypes.map((type) => {
          const request: google.maps.places.PlaceSearchRequest = {
            location: center,
            radius: radius * 1000,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: type as any,
          };
          return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
            service.nearbySearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                resolve(results);
              } else {
                console.error(`Places search failed for type "${type}" due to`, status);
                resolve([]);
              }
            });
          });
        });

        const allResults = await Promise.all(searchPromises);
        const allPlaces: google.maps.places.PlaceResult[] = allResults.flat();

        const uniquePlacesMap: { [placeId: string]: google.maps.places.PlaceResult } = {};
        allPlaces.forEach((place) => {
          if (place.place_id && !uniquePlacesMap[place.place_id]) {
            uniquePlacesMap[place.place_id] = place;
          }
        });

        const uniquePlaces = Object.values(uniquePlacesMap);

        const detailedPlacesPromises = uniquePlaces.map(
          (place) =>
            new Promise<google.maps.places.PlaceResult | null>((resolve) => {
              if (!place.place_id) {
                resolve(null);
                return;
              }
              service.getDetails(
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
                    'photos',
                    'place_id',
                  ],
                },
                (details, status) => {
                  if (
                    status === google.maps.places.PlacesServiceStatus.OK &&
                    details
                  ) {
                    resolve(details);
                  } else {
                    console.error(
                      `Failed to get place details for ${place.place_id}:`,
                      status
                    );
                    resolve(null);
                  }
                }
              );
            })
        );

        const detailedPlaces = await Promise.all(detailedPlacesPromises);
        const validPlaces = detailedPlaces.filter(
          (place): place is google.maps.places.PlaceResult => place !== null
        );

        setPlaces(validPlaces);
      } catch (error) {
        console.error('Error fetching places:', error);
        setPlaces([]);
      }
    };

    fetchPlaces();
  }, [center, radius, filters]);

  // Helper function to save location to the database
  const saveLocation = async (place: google.maps.places.PlaceResult) => {
    try {
      const token = localStorage.getItem('authToken');

      // Construct the location data to match your backend model
      const locationData = {
        name: place.name,
        address: place.formatted_address || place.vicinity,
        rating: place.rating,
        phone: place.formatted_phone_number || '',
        website: place.website || '',
        placeId: place.place_id,
        // Add any other fields your backend requires
      };

      const response = await fetch('http://localhost:4040/location/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        throw new Error('Failed to save location');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      throw error;
    }
  };

  // Helper function to delete location from the database
  const deleteLocation = async (placeId: string) => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`http://localhost:4040/location/placeId/${placeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  };

  // Modified handleLikePlace function
  const handleLikePlace = async (placeId: string, place: google.maps.places.PlaceResult) => {
    console.log('Toggling like for placeId:', placeId);

    if (likedPlaces.has(placeId)) {
      // If the place is already liked, unliking it
      try {
        await deleteLocation(placeId);

        setLikedPlaces((prev) => {
          const newLiked = new Set(prev);
          newLiked.delete(placeId);
          return newLiked;
        });
      } catch (error) {
        // Handle error (e.g., show notification)
        console.error('Failed to unlike place:', error);
      }
    } else {
      // If the place is not liked yet, liking it
      try {
        await saveLocation(place);

        setLikedPlaces((prev) => {
          const newLiked = new Set(prev);
          newLiked.add(placeId);
          return newLiked;
        });
      } catch (error) {
        // Handle error (e.g., show notification)
        console.error('Failed to like place:', error);
      }
    }
  };

  // Fetch user's liked places on component mount
  useEffect(() => {
    const fetchLikedPlaces = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await fetch('http://localhost:4040/users/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await response.json();

        // Assuming savedLocations is an array of location objects with a placeId field
        const userLikedPlaces = new Set<string>(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userData.savedLocations.map((location: any) => location.placeId)
        );

        setLikedPlaces(userLikedPlaces);
      } catch (error) {
        console.error('Error fetching liked places:', error);
      }
    };

    fetchLikedPlaces();
  }, []);

  return (
    <div className="mx-auto max-w-[90%]">
      <div className="mx-auto min-w-[90%] min-w-6xl h-[650px] mb-10 rounded-[5px] overflow-hidden">
        <MapComponent
          apiKey={apiKey}
          markers={markers}
          center={center}
          radius={radius}
          places={places}
        />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 rounded-[5px] bg-gray-100">
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
                  className="flex-grow rounded-[5px]"
                />
                <Button type="submit" className="rounded-[5px]">
                  Add
                </Button>
              </div>
            </form>

            <div className="space-y-2">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-white shadow"
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

        <Card className="rounded-[5px] bg-gray-100">
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Filters</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                {(Object.entries(filters) as [keyof Filters, boolean][]).map(
                  ([key, value]) => (
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
                  )
                )}
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

      {/* Places List Section */}
      {places.length > 0 && (
        <div className="mt-8 max-w-6xl mx-auto">
          <h2 className="lg:text-2xl text-xl text-white text-center font-semibold mb-4">
            Places to Meet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {places.map((place, index) => {
              const placeId = place.place_id || index.toString();

              return (
                <div
                  key={placeId}
                  className="border p-4 rounded-[3px] shadow-md flex items-start bg-white relative"
                >
                  {/* Left Side: Place Info */}
                  <div className="flex-grow pr-4">
                    <h3 className="text-lg font-semibold">
                      {place.name || 'No Name Available'}
                    </h3>
                    <p>
                      {place.formatted_address ||
                        place.vicinity ||
                        'No Address Available'}
                    </p>
                    {place.formatted_phone_number ? (
                      <p>📞 Phone: {place.formatted_phone_number}</p>
                    ) : (
                      <p>📞 Phone: Not Available</p>
                    )}
                    {place.website ? (
                      <p>
                        🌐 Website:{' '}
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-500"
                        >
                          {new URL(place.website).hostname}
                        </a>
                      </p>
                    ) : (
                      <p>🌐 Website: Not Available</p>
                    )}
                    {place.rating !== undefined && <p>⭐ Rating: {place.rating}</p>}
                  </div>

                  {/* Right Side: Image(s) */}
                  <div className="w-1/3 flex flex-col items-center">
                    {place.icon && (
                      <img src={place.icon} alt="Place Icon" className="w-6 h-6 mb-2" />
                    )}
                    {place.photos && place.photos.length > 0 && (
                      <div className="grid gap-2 pt-4">
                        {place.photos.slice(0, 1).map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo.getUrl({ maxWidth: 300, maxHeight: 300 })}
                            alt={`Place ${idx + 1}`}
                            className="w-full h-auto rounded-md"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div
                    className="absolute top-2 right-2 hover:bg-gray-100 p-2 cursor-pointer rounded-full"
                    onClick={() => handleLikePlace(placeId, place)}
                  >
                    {likedPlaces.has(placeId) ? (
                      <AiFillHeart size={30} className="text-red-500" />
                    ) : (
                      <AiOutlineHeart size={30} className="text-gray-500 hover:text-red-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapMidpointFinder;
