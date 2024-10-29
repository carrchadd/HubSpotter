export interface Coordinates {
    lat: number;
    lng: number;
  }
  
  export interface LocationData {
    address: string;
    coordinates?: Coordinates;
  }
  
  export interface Filters {
    restaurants: boolean;
    entertainment: boolean;
    parks: boolean;
    shopping: boolean;
    kidFriendly: boolean;
  }
  
  export interface MapSettings {
    zoom: number;
    radius: number;
  }