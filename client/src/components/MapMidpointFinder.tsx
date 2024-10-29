import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import MapComponent from './MapComponent';
import { Coordinates, Filters } from '../types';

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
    kidFriendly: false
  });

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
      [filterName]: !filters[filterName]
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Map Container - Updated height */}
      <div className="w-full h-[600px] mb-4 rounded-lg overflow-hidden">
        <MapComponent
          apiKey={apiKey}
          markers={markers}
          center={center}
          radius={radius}
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
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
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
                {(Object.entries(filters) as [keyof Filters, boolean][]).map(([key, value]) => (
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
                <h4 className="text-sm font-medium mb-2">Radius</h4>
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