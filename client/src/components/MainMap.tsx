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
   
  return (
    <div className="min-h-screen bg-background">
       < UserNavbar/>
      <main className="pt-4 pb-8">
        <MapMidpointFinder apiKey={apiKey} />
      </main>
    </div>
  );
};

export default App;