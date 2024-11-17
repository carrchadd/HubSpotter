import React from 'react';
import MapMidpointFinder from "./MapMidpointFinder";



// If you need to type the environment variable
declare global {
  interface Window {
    VITE_GOOGLE_MAPS_API_KEY?: string;
  }
}

const App: React.FC = () => {
  // You can store your API key in an environment variable
  // Make sure to add VITE_GOOGLE_MAPS_API_KEY to your .env file
  //const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const apiKey ='AIzaSyALxCkhSB_wFQj4xlG6Z_yYmLw0h91KEEQ'
  console.log("import mode:", import.meta.env.MODE)
  console.log("Environment:", import.meta.env);
  console.log("Google Maps API Key:", apiKey);
   
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Hub Spotter</h1>
        </div>
      </header>

      <main className="py-6">
      
        <MapMidpointFinder apiKey={apiKey} />
      </main>
    </div>
  );
};

export default App;