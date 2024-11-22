import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserProfile = {
  name: string;
  email: string;
  defaultLocation: string;
  date: string;
};

type SavedLocation = {
  _id: string;
  name: string;
  address: string;
  rating: number;
  phone: string;
  website: string;
};

// Edit Profile Form Component
const EditProfileForm = ({ 
  user, 
  onSave, 
  onCancel 
}: { 
  user: UserProfile; 
  onSave: (updatedUser: Partial<UserProfile>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    address: user.defaultLocation,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      
      
      // Here you would typically make an API call to update the user data
      await fetch('/api/user/update', {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      
      onSave(formData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save changes. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your name"
            className="bg-slate-800 border-slate-700 text-slate-100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-white">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Your address"
            className="bg-slate-800 border-slate-700 text-slate-100"
            required
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-slate-700 text-slate-700 hover:bg-slate-800 hover:text-white rounded-[5px]"
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-900 text-white rounded-[5px]"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        //change to db api call
        const response = await fetch('http://localhost:4040/users/profile', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json',
          },
        });

        if (!response) {
          throw new Error("Failed to fetch data");
        }

        const userData = await response.json();

        console.log(userData);

        // const [userResponse, locationsResponse] = await Promise.all([
        //   fetch('/data/user.json'),
        //   fetch('/data/saved-locations.json')
        // ]);

        // if (!userResponse.ok || !locationsResponse.ok) {
        //   throw new Error("Failed to fetch data");
        // }

        setUser(userData);
        setSavedLocations(userData.savedLocations);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = (updatedData: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
      setIsEditModalOpen(false);
      setUpdateSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-pulse text-slate-200">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "User data not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }
const handleRemoveLocation = async (locationId: string) => {
  try {
    // Send DELETE request to server
    const response = await fetch(`http://localhost:4040/location/${locationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove location");
    }

    // Update UI by removing location from state
    setSavedLocations((prev) => prev.filter((loc) => loc._id !== locationId));
  } catch (error) {
    console.error("Error removing location:", error);
  }
};

  

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col bg-background">
     
      
      {updateSuccess && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center">
          <span>Profile updated successfully!</span>
          <button 
            onClick={() => setUpdateSuccess(false)}
            className="ml-2 hover:text-emerald-100"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="bg-emerald-900/40 border-emerald-800 rounded-[5px]">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 bg-emerald-700">
                <span className="text-2xl font-semibold text-emerald-100">
                  {user.name.charAt(0)}
                </span>
              </Avatar>
              <h2 className="text-xl font-semibold text-slate-100 font-raleway">{user.name}</h2>
              <p className="text-sm text-slate-400 font-nunito">{user.email}</p>
            </CardHeader>
            <CardContent className="text-slate-300 text-center">
              <p className="text-sm mt-2 font-librefranklin">{user.defaultLocation}</p>
              <p className="text-sm text-slate-400 mt-2 font-librefranklin">
                Member Since: {user.date}
              </p>
            </CardContent>
            <CardFooter>
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="max-w-[50%] mx-auto rounded-[5px] border-emerald-600 text-black hover:bg-emerald-600 hover:text-white"
                  >
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-800">
                  <DialogHeader>
                    <DialogTitle className="text-slate-100">Edit Profile</DialogTitle>
                  </DialogHeader>
                  <EditProfileForm
                    user={user}
                    onSave={handleProfileUpdate}
                    onCancel={() => setIsEditModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          {/* Saved Locations section remains the same... */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold font-raleway text-slate-100">
              Saved Locations
            </h2>
            <Separator className="mb-6 mt-1 bg-slate-700" />
            <ScrollArea className="h-[400px] w-full rounded-[5px] border">
              <div className="space-y-4 p-4">
                {savedLocations.map((location) => (
                  <Card 
                  key={location._id} 
                  className="relative bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors rounded-[5px]"
                >
                  <button
                    onClick={() => handleRemoveLocation(location._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <X size={30} />
                  </button>
                  <CardContent className="flex items-center p-4">
                    <div className="w-20 h-20 bg-slate-700 rounded-lg mr-4 flex-shrink-0 flex items-center justify-center">
                      <span className="text-2xl text-slate-400">
                        {location.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100 font-raleway">
                        {location.name}
                      </h3>
                      <p className="text-sm text-slate-400 font-nunito">{location.address}</p>
                      <p className="text-md text-green-400 font-nunito">{location.phone}</p>
                      <p className="text-sm text-slate-300 font-nunito">{location.website}</p>
                      <p className="text-sm text-amber-400 mt-1 font-nunito">
                        {"★".repeat(location.rating)}
                        {"☆".repeat(5 - location.rating)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Profile;