/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    // Add other env variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }