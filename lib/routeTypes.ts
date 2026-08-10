export interface LocationPoint {
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  placeId?: string;
}

export interface CachedRoute {
  id: string; // key e.g. "san francisco|oakland"
  origin: LocationPoint;
  destination: LocationPoint;
  distanceMeters: number;
  distanceKm: number;
  distanceMiles: number;
  durationSeconds: number;
  durationMinutes: number;
  durationText: string;
  distanceText: string;
  routePolyline: [number, number][]; // Array of [lat, lng] coordinates
  source: 'cached_db' | 'google_maps' | 'fallback_osrm';
  createdAt: string;
  lastAccessedAt: string;
  hitCount: number;
  costUSD: number; // cost logged ($0.005 for Google Maps matrix)
  latencyMs: number;
  trafficDelayMinutes?: number;
}

export interface DistanceRequest {
  origin: string;
  destination: string;
  originCoords?: { lat: number; lng: number };
  destCoords?: { lat: number; lng: number };
  bypassCache?: boolean;
}

export interface DistanceResponse {
  route: CachedRoute;
  cacheHit: boolean;
  latencyMs: number;
  costSavedUSD: number;
  message: string;
}

export interface CacheStats {
  totalQueries: number;
  cacheHits: number;
  cacheMisses: number;
  hitRatePercent: number;
  totalCostSavedUSD: number;
  googleMapsApiCostUSD: number;
  totalLatencySavedSeconds: number;
  cachedRoutesCount: number;
}

export interface RideOption {
  id: string;
  name: string;
  tagline: string;
  iconName: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  etaMinutes: number;
  seats: number;
  badge?: string;
  multiplier: number;
  isEco?: boolean;
}

export interface CarSpec {
  makeModel: string;
  year: number;
  type:
    | 'Executive Sedan'
    | 'Electric SUV'
    | 'Comfort Saloon'
    | 'Minivan / XL'
    | 'Budget Compact';
  comfortScore: number; // e.g. 9.8 / 10
  comfortRatingLabel:
    | 'Luxury VIP'
    | 'Premium Comfort'
    | 'Standard Plus'
    | 'Budget Friendly'
    | 'Eco Electric';
  fuelType: 'Electric' | 'Gasoline' | 'Hybrid' | 'Diesel';
  fuelEfficiency: string; // e.g. "6.5 L / 100 km" or "16 kWh / 100 km"
  fuelPricePerUnitUSD: number;
  consumptionRatePerKm: number;
  seats: number;
  luggageCapacity: string;
  features: string[];
  imagePlaceholder?: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalTrips: number;
  yearsActive: number;
  isVerified: boolean;
  phone: string;
  languages: string[];
  car: CarSpec;
  isCheapOffer?: boolean;
  specialOfferBadge?: string;
  customRatePerKm: number;
  baseServiceFee: number;
  departureEtaMins: number;
  driverNote?: string;
}

export interface CalculatedDriverPricing {
  driver: DriverProfile;
  distanceKm: number;
  estimatedFuelCostUSD: number;
  driverFareUSD: number;
  totalTripPriceUSD: number;
  isCheapOffer: boolean;
  savingsVsAvgUSD?: number;
}
