import React from 'react';
import MapMidpointFinder from "./MapMidpointFinder";
import UserNavbar from './UserNavbar';


// If you need to type the environment variable
declare global {
  interface Window {
    VITE_GOOGLE_MAPS_API_KEY?: string;
  }
}

const App: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

 
  console.log("import mode:", import.meta.env.MODE)
  console.log("Environment:", import.meta.env);
  console.log("Google Maps API Key:", apiKey);
   
  return (
    <div className="min-h-screen bg-gray-50">
       < UserNavbar/>
      <main className="py-6">
        <MapMidpointFinder apiKey={apiKey} />
      </main>
    </div>
  );
};

export default App;