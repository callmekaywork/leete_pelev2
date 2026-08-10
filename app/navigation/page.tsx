'use client';

import RideMap from '@/components/map/ridemap';
import {
  calculateStatsFromRoutes,
  INITIAL_PRESEEDED_ROUTES,
} from '@/lib/cacheStore';
import {
  CachedRoute,
  CacheStats,
  CalculatedDriverPricing,
  DistanceResponse,
  RideOption,
} from '@/lib/routeTypes';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import Map from '@/components/map/testMap';
import Header from '@/components/header';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  Sparkles,
  Users,
} from 'lucide-react';
import { INITIAL_DRIVERS } from '@/lib/routing';

const DEFAULT_RIDE_OPTION: RideOption = {
  id: 'bolt_standard',
  name: 'Bolt',
  tagline: 'Fast and affordable rides',
  iconName: 'car',
  baseFare: 2.5,
  perKmRate: 1.15,
  perMinuteRate: 0.2,
  etaMinutes: 2,
  seats: 4,
  multiplier: 1.0,
};

export default function page() {
  const [activeTab, setActiveTab] = useState('ride');
  const [origin, setOrigin] = useState('Mahikeng, South Africa');
  const [destination, setDestination] = useState('Johannesburg, South Africa');

  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] =
    useState<DistanceResponse | null>(null);

  const [cachedRoutes, setCachedRoutes] = useState<CachedRoute[]>(
    INITIAL_PRESEEDED_ROUTES,
  );
  const [totalQueriesCount, setTotalQueriesCount] = useState(12);
  const [cacheHitsCount, setCacheHitsCount] = useState(10);
  const [cacheMissesCount, setCacheMissesCount] = useState(2);

  const [selectedRide, setSelectedRide] =
    useState<RideOption>(DEFAULT_RIDE_OPTION);
  const [chosenDriverPricing, setChosenDriverPricing] =
    useState<CalculatedDriverPricing | null>(null);
  const [panelMode, setPanelMode] = useState<'instant' | 'drivers'>('instant');
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isRideModalOpen, setIsRideModalOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'light' | 'dark' | 'satellite'>(
    'light',
  );

  // Sync panelMode with activeTab
  const currentPanelMode = activeTab === 'drivers' ? 'drivers' : panelMode;

  const handleSelectDriver = (driverPricing: CalculatedDriverPricing) => {
    setChosenDriverPricing(driverPricing);
    setIsRideModalOpen(true);
  };

  const hasApiKey = Boolean(
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLATFORM_KEY ||
    process.env.GOOGLE_MAPS_PLATFORM_KEY,
  );

  // Compute live cache statistics
  const cacheStats: CacheStats = calculateStatsFromRoutes(
    cachedRoutes,
    totalQueriesCount,
    cacheHitsCount,
    cacheMissesCount,
  );

  // Fetch initial cached routes list from server
  const fetchCacheList = useCallback(async () => {
    try {
      const res = await fetch('/api/distance');
      if (res.ok) {
        const data = await res.json();
        if (data.cachedRoutes && Array.isArray(data.cachedRoutes)) {
          setCachedRoutes(data.cachedRoutes);
        }
      }
    } catch (e) {
      console.error('Failed to fetch cache list:', e);
    }
  }, []);

  // Perform Route Distance Calculation with Caching
  const handleCalculateRoute = useCallback(
    async (bypassCache: boolean = false) => {
      if (!origin || !destination) return;
      setIsLoading(true);

      try {
        const res = await fetch('/api/distance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin,
            destination,
            bypassCache,
          }),
        });

        if (res.ok) {
          const data: DistanceResponse = await res.json();
          setCurrentResponse(data);

          // Update query metrics
          setTotalQueriesCount(prev => prev + 1);
          if (data.cacheHit) {
            setCacheHitsCount(prev => prev + 1);
          } else {
            setCacheMissesCount(prev => prev + 1);
          }

          // Refresh cached list
          await fetchCacheList();
        }
      } catch (err) {
        console.error('Calculate distance error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [origin, destination, fetchCacheList],
  );

  // Load initial route on mount
  useEffect(() => {
    let active = true;
    const init = async () => {
      if (active) {
        await fetchCacheList();
        await handleCalculateRoute(false);
      }
    };
    init();
    return () => {
      active = false;
    };
  }, [fetchCacheList, handleCalculateRoute]);

  // Handler when user selects a cached route chip to test instant hit
  const handleSelectCachedRouteToTest = (route: CachedRoute) => {
    setOrigin(route.origin.name);
    setDestination(route.destination.name);
    // Instant calculate
    setTimeout(() => {
      handleCalculateRoute(false);
    }, 100);
  };

  const handleClearCache = () => {
    setCachedRoutes([]);
    setCacheHitsCount(0);
    setCacheMissesCount(0);
    setTotalQueriesCount(0);
    setCurrentResponse(null);
  };

  const handlePreseedRoutes = () => {
    setCachedRoutes(INITIAL_PRESEEDED_ROUTES);
    setCacheHitsCount(10);
    setCacheMissesCount(2);
    setTotalQueriesCount(12);
  };
  return (
    <div className="relative h-auto w-full">
      {/* <main className="flex flex-1 w-full flex-col items-center justify-center bg-white dark:bg-black sm:items-start  "> */}
      {/* Right Column: Interactive Leaflet Map View */}
      <div className="lg:col-span-7 h-130 py-5 px-2.5 w-full lg:h-180 sticky top-20 z-10 ">
        <RideMap
          route={currentResponse?.route || null}
          mapStyle={mapStyle}
          setMapStyle={setMapStyle}
        />
      </div>
      {/* <Map /> */}
    </div>
  );
}
