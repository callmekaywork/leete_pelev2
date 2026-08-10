'use client';

import React, { useEffect, useState } from 'react';

import Map from '@/components/map/map';
import {
  DriverInfo,
  LocationPoint,
  RideDetails,
  RideStatus,
} from '@/lib/types';
import {
  calculateDistance,
  findAvailableDriver,
  generateRoutePoints,
  INITIAL_DRIVERS,
  PRESET_LOCATIONS,
} from '@/lib/routing';
import { getTodayDateString } from '@/lib/dateCalculations/dateCalc';
import RideBookingPanel from '@/components/rideFunctions/ridebookingpanel';

export default function Navigation() {
  // App Mode: Passenger vs Driver
  const [appMode, setAppMode] = useState<'rider' | 'driver'>('rider');

  // Location selection state
  const [userLocation, setUserLocation] = useState<[number, number] | null>([
    51.5074, -0.1278,
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

  // Driver Console State
  const [driverConsoleState, setDriverConsoleState] = useState<
    | 'offline'
    | 'online'
    | 'requested'
    | 'driving_to_pickup'
    | 'driving_to_dropoff'
  >('online');

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

  // Recalculate route coordinates when pickup or dropoff changes
  useEffect(() => {
    if (!pickup || !dropoff) return;
    const timer = setTimeout(() => {
      const points = generateRoutePoints(
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
        30,
      );
      setRouteCoordinates(points);
    }, 0);
    return () => clearTimeout(timer);
  }, [pickup, dropoff]);

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

  // Map Click Handler
  const handleSelectMapLocation = (lat: number, lng: number) => {
    const loc: LocationPoint = {
      lat,
      lng,
      name: `Custom Map Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      address: 'Selected on map',
    };

    if (selectionMode === 'pickup') {
      setPickup(loc);
      setSelectionMode(null);
    } else if (selectionMode === 'dropoff') {
      setDropoff(loc);
      setSelectionMode(null);
    }
  };

  const handleMarkerDragEnd = (
    type: 'pickup' | 'dropoff',
    lat: number,
    lng: number,
  ) => {
    const loc: LocationPoint = {
      lat,
      lng,
      name: `${type === 'pickup' ? 'Pickup' : 'Dropoff'} (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      address: 'Adjusted pin location',
    };
    if (type === 'pickup') setPickup(loc);
    else setDropoff(loc);
  };

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

  // Ride Animation Simulation
  useEffect(() => {
    if (
      isPaused ||
      (rideStatus !== 'driver_arriving' && rideStatus !== 'in_progress')
    )
      return;
    if (!routeCoordinates || routeCoordinates.length === 0) return;

    const intervalTime = 800 / simSpeed;

    const timer = setInterval(() => {
      setRouteIndex(prevIdx => {
        const nextIdx = prevIdx + 1;

        if (nextIdx < routeCoordinates.length) {
          setDriverPosition(routeCoordinates[nextIdx]);
          return nextIdx;
        }

        // Reached end of current leg
        if (rideStatus === 'driver_arriving') {
          // Arrived at pickup -> start route to dropoff
          setRideStatus('in_progress');
          if (pickup && dropoff) {
            const tripPoints = generateRoutePoints(
              [pickup.lat, pickup.lng],
              [dropoff.lat, dropoff.lng],
              30,
            );
            setRouteCoordinates(tripPoints);
            setDriverPosition([pickup.lat, pickup.lng]);
          }
          return 0;
        } else if (rideStatus === 'in_progress') {
          // Trip completed
          setRideStatus('arrived');
          playSoundEffect('arrived');
          clearInterval(timer);
          return routeCoordinates.length - 1;
        }

        return prevIdx;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [rideStatus, routeCoordinates, isPaused, simSpeed, pickup, dropoff]);

  const progressPercent =
    routeCoordinates.length > 1
      ? (routeIndex / (routeCoordinates.length - 1)) * 100
      : 0;

  const handleInstantComplete = () => {
    if (rideStatus === 'driver_arriving' || rideStatus === 'in_progress') {
      setRideStatus('arrived');
      playSoundEffect('arrived');
      if (dropoff) setDriverPosition([dropoff.lat, dropoff.lng]);
    }
  };

  const handleResetRide = () => {
    setRideStatus('idle');
    setActiveDriver(null);
    setDriverPosition(null);
    setActiveRide(null);
    setRouteIndex(0);
    setIsPaused(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950 font-sans flex flex-col text-zinc-100">
      {/* Main Container: Map Background + Overlay Panels */}
      <div className="relative w-full h-full flex-1">
        {/* Leaflet Map Layer */}
        <Map
          pickup={pickup}
          dropoff={dropoff}
          routeCoordinates={routeCoordinates}
          rideStatus={rideStatus}
          activeDriver={activeDriver}
          driverPosition={driverPosition}
          nearbyDrivers={drivers}
          userLocation={userLocation}
          onSelectMapLocation={handleSelectMapLocation}
          selectionMode={selectionMode}
          onMarkerDragEnd={handleMarkerDragEnd}
        />

        {/* Floating Side Panel Overlay */}
        <div className="absolute top-20 left-4 z-400 max-w-md w-full max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar pb-6 pointer-events-auto">
          {/* {appMode === 'rider' ? ( */}
          {/* rideStatus === 'idle' ? ( */}
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
          {/* ) : activeRide ? (
              <LiveTrackingPanel
                rideDetails={activeRide}
                progressPercent={progressPercent}
                simSpeed={simSpeed}
                isPaused={isPaused}
                onTogglePause={() => setIsPaused(!isPaused)}
                onChangeSimSpeed={setSimSpeed}
                onInstantComplete={handleInstantComplete}
                onCancelRide={handleResetRide}
              />
            ) : null
          ) : (
            <DriverViewPanel
              driverState={driverConsoleState}
              pickup={pickup}
              dropoff={dropoff}
              seatsRequested={seatsBooked}
              onAcceptDriverTrip={() => setDriverConsoleState('driving_to_pickup')}
              onArrivePickup={() => setDriverConsoleState('driving_to_dropoff')}
              onCompleteDriverTrip={() => setDriverConsoleState('online')}
            />
          )} */}
        </div>
      </div>
    </div>
  );
}
