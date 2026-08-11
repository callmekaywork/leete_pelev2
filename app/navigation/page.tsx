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

import {
  DriverInfo,
  LocationPoint,
  RideDetails,
  RideStatus,
} from '@/lib/types';

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
import {
  calculateDistance,
  findAvailableDriver,
  generateRoutePoints,
  INITIAL_DRIVERS,
  PRESET_LOCATIONS,
} from '@/lib/routing';
import RideBookingPanel from '@/components/rideFunctions/ridebookingpanel';
import { getTodayDateString } from '@/lib/dateCalculations/dateCalc';

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

  // Location selection state
  const [userLocation, setUserLocation] = useState<[number, number] | null>([
    -25.8653, 25.6442,
  ]);
  const [pickup, setPickup] = useState<LocationPoint | null>(
    PRESET_LOCATIONS[0],
  ); // Central Station
  const [dropoff, setDropoff] = useState<LocationPoint | null>(
    PRESET_LOCATIONS[1],
  ); // Airport
  const [selectionMode, setSelectionMode] = useState<
    'pickup' | 'dropoff' | null
  >(null);

  // Seat Booking selection (default 1 seat, can book up to driver capacity)
  const [seatsBooked, setSeatsBooked] = useState<number>(1);

  // Drivers Fleet State
  const [drivers, setDrivers] = useState<DriverInfo[]>(INITIAL_DRIVERS);

  // Active Ride State
  const [rideStatus, setRideStatus] = useState<RideStatus>('idle');
  const [activeDriver, setActiveDriver] = useState<DriverInfo | null>(null);
  const [driverPosition, setDriverPosition] = useState<[number, number] | null>(
    null,
  );

  // Route & Simulation State
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    [],
  );
  const [routeIndex, setRouteIndex] = useState(0);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Active Ride Record
  const [activeRide, setActiveRide] = useState<RideDetails | null>(null);

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

  // Audio chimes
  const playSoundEffect = (type: 'driver_found' | 'arrived' | 'click') => {
    try {
      const ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'driver_found') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'arrived') {
        osc.frequency.setValueAtTime(659.25, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      // Audio fallback
    }
  };

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

  // Real Geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        pos => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        err => {
          console.warn(
            'Geolocation warning / permission restricted, using central station',
            err,
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 },
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

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

  // Handle Booking Request Flow with Date & Selected Driver
  const handleBookRide = (
    passengerName: string,
    passengerPhone: string,
    notes: string,
    bookingDate: string = getTodayDateString(),
    selectedDriverId: string | null = null,
  ) => {
    if (!pickup || !dropoff) return;

    setRideStatus('searching');
    playSoundEffect('click');

    const distance = calculateDistance(
      pickup.lat,
      pickup.lng,
      dropoff.lat,
      dropoff.lng,
    );
    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRide: RideDetails = {
      id: bookingId,
      pickup,
      dropoff,
      seatsBooked,
      bookingDate,
      distanceKm: distance,
      durationMinutes: Math.round(distance * 2.8 + 3),
      status: 'searching',
      driver: null,
      createdAt: new Date(),
      routeCoordinates,
      passengerName: passengerName || 'Passenger',
      passengerPhone: passengerPhone || '+1 (555) 019-2831',
      notes,
    };

    setActiveRide(newRide);

    // Simulate system checking driver seat availability
    setTimeout(() => {
      let assignedDriver: DriverInfo | null = null;

      if (selectedDriverId) {
        assignedDriver = drivers.find(d => d.id === selectedDriverId) || null;
      }

      if (!assignedDriver) {
        assignedDriver = findAvailableDriver(seatsBooked, drivers);
      }

      if (!assignedDriver) {
        setRideStatus('no_driver_available');
        setActiveRide(prev =>
          prev ? { ...prev, status: 'no_driver_available' } : null,
        );
        return;
      }

      // Record booking into local database
      //   const dbRecord: BookingRecord = {
      //     id: bookingId,
      //     driverId: assignedDriver.id,
      //     driverName: assignedDriver.name,
      //     carModel: assignedDriver.carModel,
      //     plateNumber: assignedDriver.plateNumber,
      //     bookingDate,
      //     passengerName: passengerName || 'Passenger',
      //     passengerPhone: passengerPhone || '+1 (555) 019-2831',
      //     notes,
      //     seatsBooked,
      //     pickup,
      //     dropoff,
      //     createdAt: new Date().toISOString(),
      //     status: 'confirmed',
      //   };

      //   saveBookingRecord(dbRecord);

      // Update driver's occupied seats state
      setDrivers(prevDrivers =>
        prevDrivers.map(d =>
          d.id === assignedDriver!.id
            ? { ...d, occupiedSeats: d.occupiedSeats + seatsBooked }
            : d,
        ),
      );

      setActiveDriver(assignedDriver);
      setRideStatus('driver_assigned');
      playSoundEffect('driver_found');

      // Approach path to pickup
      const approachPoints = generateRoutePoints(
        assignedDriver.currentPos,
        [pickup.lat, pickup.lng],
        15,
      );

      setActiveRide(prev =>
        prev
          ? { ...prev, status: 'driver_arriving', driver: assignedDriver }
          : null,
      );
      setRideStatus('driver_arriving');
      setRouteCoordinates(approachPoints);
      setRouteIndex(0);
      setDriverPosition(assignedDriver.currentPos);
    }, 1800);
  };

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
    <div className="h-auto w-full flex py-5 dark:bg-black">
      <div className="md:px-10 md:h-220 w-full flex flex-col md:flex-row md:gap-2 gap-10 items-center justify-center">
        <div className="px-2 md:min-w-140 flex justify-center">
          <RideBookingPanel
            pickup={pickup}
            dropoff={dropoff}
            seatsBooked={seatsBooked}
            onSelectSeats={setSeatsBooked}
            drivers={drivers}
            onSelectPickup={setPickup}
            onSelectDropoff={setDropoff}
            onStartSearchOnMap={mode => setSelectionMode(mode)}
            onBookRide={handleBookRide}
            userLocation={userLocation}
          />
        </div>
        {/* Right Column: Interactive Leaflet Map View */}
        <div className=" h-full px-2.5 w-full flex justify-start">
          <RideMap
            route={currentResponse?.route || null}
            mapStyle={mapStyle}
            setMapStyle={setMapStyle}
          />
        </div>
        {/* <Map /> */}
      </div>
    </div>
  );
}
