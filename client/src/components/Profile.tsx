import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
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
  address: string;
  memberSince: string;
};

type SavedLocation = {
  id: number;
  name: string;
  address: string;
  rating: number;
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
    address: user.address,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to update the user data
      // await fetch('/api/user/update', {
      //   method: 'PUT',
      //   body: JSON.stringify(formData),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      
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
        const [userResponse, locationsResponse] = await Promise.all([
          fetch('/data/user.json'),
          fetch('/data/saved-locations.json')
        ]);

        if (!userResponse.ok || !locationsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const userData = await userResponse.json();
        const locationsData = await locationsResponse.json();

        setUser(userData);
        setSavedLocations(locationsData);
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
              <p className="text-sm mt-2 font-librefranklin">{user.address}</p>
              <p className="text-sm text-slate-400 mt-2 font-librefranklin">
                Member Since: {user.memberSince}
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
            <div className="space-y-4">
              {savedLocations.map((location) => (
                <Card 
                  key={location.id} 
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors rounded-[5px]"
                >
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
                      <p className="text-sm text-amber-400 mt-1 font-nunito">
                        {"★".repeat(location.rating)}
                        {"☆".repeat(5 - location.rating)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Profile;