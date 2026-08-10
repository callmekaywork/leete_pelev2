import { CachedRoute, CacheStats, LocationPoint } from './routeTypes';

// Pre-seeded popular routes to demonstrate immediate cache hits
export const INITIAL_PRESEEDED_ROUTES: CachedRoute[] = [
  {
    id: 'mafikeng, south africa|johannesburg, south africa',
    origin: {
      name: 'Mahikeng (Mafikeng)',
      formattedAddress: 'Mahikeng, North West, 2745, South Africa',
      lat: -25.8653,
      lng: 25.6442,
    },
    destination: {
      name: 'Johannesburg',
      formattedAddress: 'Johannesburg, Gauteng, 2000, South Africa',
      lat: -26.2041,
      lng: 28.0473,
    },
    distanceMeters: 298000,
    distanceKm: 298.0,
    distanceMiles: 185.1,
    durationSeconds: 11700,
    durationMinutes: 195,
    durationText: '3 hrs 15 mins',
    distanceText: '298.0 km',
    routePolyline: [
      [-25.8653, 25.6442],
      [-25.98, 26.22],
      [-26.05, 26.88],
      [-26.12, 27.45],
      [-26.2041, 28.0473],
    ],
    source: 'cached_db',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastAccessedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    hitCount: 42,
    costUSD: 0.005,
    latencyMs: 2,
  },
  {
    id: 'jfk airport, new york|times square, new york',
    origin: {
      name: 'JFK International Airport',
      formattedAddress: 'Jamaica, Queens, NY 11430, USA',
      lat: 40.6413,
      lng: -73.7781,
    },
    destination: {
      name: 'Times Square',
      formattedAddress: 'Manhattan, NY 10036, USA',
      lat: 40.758,
      lng: -73.9855,
    },
    distanceMeters: 28400,
    distanceKm: 28.4,
    distanceMiles: 17.6,
    durationSeconds: 2220,
    durationMinutes: 37,
    durationText: '37 mins',
    distanceText: '28.4 km',
    routePolyline: [
      [40.6413, -73.7781],
      [40.665, -73.792],
      [40.692, -73.835],
      [40.718, -73.892],
      [40.742, -73.945],
      [40.758, -73.9855],
    ],
    source: 'cached_db',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastAccessedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    hitCount: 14,
    costUSD: 0.005,
    latencyMs: 3,
  },
  {
    id: 'london heathrow airport|piccadilly circus, london',
    origin: {
      name: 'Heathrow Airport (LHR)',
      formattedAddress: 'Longford TW6, London, UK',
      lat: 51.47,
      lng: -0.4543,
    },
    destination: {
      name: 'Piccadilly Circus',
      formattedAddress: 'Westminster, London W1D 7ET, UK',
      lat: 51.51,
      lng: -0.1342,
    },
    distanceMeters: 25200,
    distanceKm: 25.2,
    distanceMiles: 15.6,
    durationSeconds: 2700,
    durationMinutes: 45,
    durationText: '45 mins',
    distanceText: '25.2 km',
    routePolyline: [
      [51.47, -0.4543],
      [51.485, -0.382],
      [51.492, -0.285],
      [51.498, -0.21],
      [51.505, -0.16],
      [51.51, -0.1342],
    ],
    source: 'cached_db',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastAccessedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    hitCount: 28,
    costUSD: 0.005,
    latencyMs: 2,
  },
  {
    id: 'eiffel tower, paris|charles de gaulle airport, paris',
    origin: {
      name: 'Eiffel Tower',
      formattedAddress: '5 Avenue Anatole France, 75007 Paris, France',
      lat: 48.8584,
      lng: 2.2945,
    },
    destination: {
      name: 'Charles de Gaulle Airport (CDG)',
      formattedAddress: '95700 Roissy-en-France, France',
      lat: 49.0097,
      lng: 2.5479,
    },
    distanceMeters: 33100,
    distanceKm: 33.1,
    distanceMiles: 20.5,
    durationSeconds: 2520,
    durationMinutes: 42,
    durationText: '42 mins',
    distanceText: '33.1 km',
    routePolyline: [
      [48.8584, 2.2945],
      [48.875, 2.33],
      [48.91, 2.38],
      [48.96, 2.46],
      [49.0097, 2.5479],
    ],
    source: 'cached_db',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastAccessedAt: new Date(Date.now() - 1800000).toISOString(),
    hitCount: 9,
    costUSD: 0.005,
    latencyMs: 4,
  },
  {
    id: 'san francisco international airport|union square, san francisco',
    origin: {
      name: 'San Francisco Int Airport (SFO)',
      formattedAddress: 'San Francisco, CA 94128, USA',
      lat: 37.6213,
      lng: -122.379,
    },
    destination: {
      name: 'Union Square',
      formattedAddress: '333 Post St, San Francisco, CA 94108, USA',
      lat: 37.7879,
      lng: -122.4074,
    },
    distanceMeters: 22800,
    distanceKm: 22.8,
    distanceMiles: 14.1,
    durationSeconds: 1380,
    durationMinutes: 23,
    durationText: '23 mins',
    distanceText: '22.8 km',
    routePolyline: [
      [37.6213, -122.379],
      [37.665, -122.41],
      [37.712, -122.405],
      [37.755, -122.408],
      [37.7879, -122.4074],
    ],
    source: 'cached_db',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastAccessedAt: new Date(Date.now() - 7200000).toISOString(),
    hitCount: 31,
    costUSD: 0.005,
    latencyMs: 2,
  },
  {
    id: 'berlin hauptbahnhof|alexanderplatz, berlin',
    origin: {
      name: 'Berlin Hauptbahnhof',
      formattedAddress: 'Europaplatz 1, 10557 Berlin, Germany',
      lat: 52.5251,
      lng: 13.3694,
    },
    destination: {
      name: 'Alexanderplatz',
      formattedAddress: '10178 Berlin, Germany',
      lat: 52.5219,
      lng: 13.4132,
    },
    distanceMeters: 3800,
    distanceKm: 3.8,
    distanceMiles: 2.3,
    durationSeconds: 660,
    durationMinutes: 11,
    durationText: '11 mins',
    distanceText: '3.8 km',
    routePolyline: [
      [52.5251, 13.3694],
      [52.522, 13.385],
      [52.521, 13.4],
      [52.5219, 13.4132],
    ],
    source: 'cached_db',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastAccessedAt: new Date(Date.now() - 600000).toISOString(),
    hitCount: 18,
    costUSD: 0.005,
    latencyMs: 3,
  },
];

// Helper to normalize location query strings for consistent cache key lookup
export function normalizeLocationKey(locationStr: string): string {
  if (!locationStr) return '';
  return locationStr
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s,.]/gi, '');
}

export function generateRouteKey(origin: string, destination: string): string {
  const normOrigin = normalizeLocationKey(origin);
  const normDest = normalizeLocationKey(destination);
  return `${normOrigin}|${normDest}`;
}

// In-Memory Server Store
let serverMemoryCache: Map<string, CachedRoute> = new Map();

// Initialize server memory cache
INITIAL_PRESEEDED_ROUTES.forEach(route => {
  serverMemoryCache.set(route.id, route);
});

export function getServerCache(): Map<string, CachedRoute> {
  return serverMemoryCache;
}

export function findRouteInCache(
  originStr: string,
  destStr: string,
): CachedRoute | undefined {
  const key = generateRouteKey(originStr, destStr);
  const directMatch = serverMemoryCache.get(key);
  if (directMatch) return directMatch;

  // Fuzzy or reverse match fallback
  const normOrigin = normalizeLocationKey(originStr);
  const normDest = normalizeLocationKey(destStr);

  for (const [existingKey, route] of serverMemoryCache.entries()) {
    if (
      existingKey === key ||
      (existingKey.includes(normOrigin) && existingKey.includes(normDest))
    ) {
      return route;
    }
  }

  return undefined;
}

export function saveRouteToCache(route: CachedRoute): CachedRoute {
  serverMemoryCache.set(route.id, route);
  return route;
}

export function calculateStatsFromRoutes(
  routes: CachedRoute[],
  totalQueries: number,
  totalHits: number,
  totalMisses: number,
): CacheStats {
  const GOOGLE_MAPS_COST_PER_CALL = 0.005; // $0.005 per Distance Matrix call
  const AVG_API_LATENCY_SEC = 0.45; // ~450ms per API call

  const hitRatePercent =
    totalQueries > 0 ? Math.round((totalHits / totalQueries) * 100) : 0;
  const totalCostSavedUSD = totalHits * GOOGLE_MAPS_COST_PER_CALL;
  const googleMapsApiCostUSD = totalMisses * GOOGLE_MAPS_COST_PER_CALL;
  const totalLatencySavedSeconds =
    Math.round(totalHits * AVG_API_LATENCY_SEC * 10) / 10;

  return {
    totalQueries,
    cacheHits: totalHits,
    cacheMisses: totalMisses,
    hitRatePercent,
    totalCostSavedUSD,
    googleMapsApiCostUSD,
    totalLatencySavedSeconds,
    cachedRoutesCount: routes.length,
  };
}
