import { LocationPoint, DriverInfo } from './types';

// Preset popular locations in the city hub
export const PRESET_LOCATIONS: LocationPoint[] = [
  {
    name: 'Mafikeng',
    address: 'Denville',
    lat: -25.8653,
    lng: 25.6442,
  },

  {
    name: 'Johannesburg',
    address: 'MTN Rank',
    lat: -26.2041,
    lng: 28.0473,
  },
];

export const INITIAL_DRIVERS: DriverInfo[] = [
  {
    id: 'd1',
    name: 'Cynthia Madeup',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    totalTrips: 1840,
    carModel: 'Toyota Prius Hybrid',
    carColor: 'Silver Gray',
    plateNumber: '8-WPT-402',
    phone: '+1 (555) 234-5678',
    currentPos: [51.509, -0.126],
    capacity: 4,
    occupiedSeats: 1, // 3 free seats left
  },
  {
    id: 'd2',
    name: 'Kabelo Test Name',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 4.98,
    totalTrips: 2430,
    carModel: 'Tesla Model 3',
    carColor: 'Midnight Blue',
    plateNumber: 'EV-990-BO',
    phone: '+1 (555) 876-5432',
    currentPos: [51.504, -0.131],
    capacity: 4,
    occupiedSeats: 0, // 4 free seats left
  },
];

// Helper to check which driver has enough available space for requested seats
export function findAvailableDriver(
  requestedSeats: number,
  drivers: DriverInfo[],
): DriverInfo | null {
  const matchingDrivers = drivers.filter(
    driver => driver.capacity - driver.occupiedSeats >= requestedSeats,
  );

  if (matchingDrivers.length === 0) return null;

  // Pick the closest or highest rated matching driver
  return matchingDrivers.sort((a, b) => b.rating - a.rating)[0];
}

// Calculate distance in km between two lat/lng points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.max(0.8, Math.round(distance * 10) / 10); // Minimum 0.8 km
}

// Generate intermediate road-like waypoint coordinates between start and end
export function generateRoutePoints(
  start: [number, number],
  end: [number, number],
  segments = 25,
): [number, number][] {
  const points: [number, number][] = [];
  const [startLat, startLng] = start;
  const [endLat, endLng] = end;

  const midLat = (startLat + endLat) / 2;
  const midLng = (startLng + endLng) / 2;

  const deltaLat = endLat - startLat;
  const deltaLng = endLng - startLng;
  const perpOffset = 0.003;

  const curvePoint: [number, number] = [
    midLat + deltaLng * perpOffset * 10,
    midLng - deltaLat * perpOffset * 10,
  ];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat =
      Math.pow(1 - t, 2) * startLat +
      2 * (1 - t) * t * curvePoint[0] +
      Math.pow(t, 2) * endLat;
    const lng =
      Math.pow(1 - t, 2) * startLng +
      2 * (1 - t) * t * curvePoint[1] +
      Math.pow(t, 2) * endLng;
    points.push([lat, lng]);
  }

  return points;
}

// Geocode query using Nominatim OSM API or fallback preset match
export async function searchAddress(query: string): Promise<LocationPoint[]> {
  if (!query || query.trim().length < 2) return [];

  const lower = query.toLowerCase();
  const presetMatches = PRESET_LOCATIONS.filter(
    loc =>
      (loc.name && loc.name.toLowerCase().includes(lower)) ||
      loc.address.toLowerCase().includes(lower),
  );

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
    );
    if (res.ok) {
      const data = await res.json();
      const apiResults: LocationPoint[] = data.map((item: any) => ({
        name: item.display_name.split(',')[0] || query,
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));

      const combined = [...presetMatches, ...apiResults];
      const unique = combined.filter(
        (item, idx, self) =>
          idx ===
          self.findIndex(
            t =>
              Math.abs(t.lat - item.lat) < 0.001 &&
              Math.abs(t.lng - item.lng) < 0.001,
          ),
      );
      return unique.slice(0, 6);
    }
  } catch (err) {
    console.warn('Nominatim geocoding fallback to presets', err);
  }

  return presetMatches;
}
