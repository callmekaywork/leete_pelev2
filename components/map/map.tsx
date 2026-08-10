'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LocationPoint, RideStatus, DriverInfo } from '@/lib/types';
import { Navigation, Compass, Layers, Crosshair, MapPin } from 'lucide-react';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L, { LatLng, LeafletMouseEvent } from 'leaflet';

interface MapProps {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  routeCoordinates: [number, number][];
  rideStatus: RideStatus;
  activeDriver: DriverInfo | null;
  driverPosition: [number, number] | null;
  nearbyDrivers: DriverInfo[];
  userLocation: [number, number] | null;
  onSelectMapLocation?: (lat: number, lng: number) => void;
  selectionMode?: 'pickup' | 'dropoff' | null;
  onMarkerDragEnd?: (
    type: 'pickup' | 'dropoff',
    lat: number,
    lng: number,
  ) => void;
}

export default function Map({
  pickup,
  dropoff,
  routeCoordinates,
  rideStatus,
  activeDriver,
  driverPosition,
  nearbyDrivers,
  userLocation,
  onSelectMapLocation,
  selectionMode,
  onMarkerDragEnd,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  // Layer references
  const tileLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const dropoffMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const routeCoveredPolylineRef = useRef<any>(null);
  const activeDriverMarkerRef = useRef<any>(null);
  const nearbyDriverMarkersRef = useRef<any[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<'voyager' | 'standard'>('voyager');

  // Load Leaflet dynamically on mount
  useEffect(() => {
    // checks if the page is fully mounted
    let isMounted = true;

    // initiallize leaflet
    async function initLeaflet() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      // we import leaflet here
      const L = await import('leaflet');
      LRef.current = L;

      // if page not fully mounted return
      if (!isMounted) return;

      // i dont understand this part
      // Fix Leaflet default icon paths issues in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl:
          'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // initiallize the map location
      const initialCenter: [number, number] =
        userLocation ||
        (pickup ? [pickup.lat, pickup.lng] : [-25.8653, 25.6442]);
      //     [-25.8653, 25.6442],
      //   [-25.98, 26.22],
      //   [-26.05, 26.88],
      //   [-26.12, 27.45],
      //   [-26.2041, 28.0473],

      // add the info the map
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Add clean Voyager map tiles
      const tileUrl =
        mapStyle === 'voyager'
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 14,
        subdomains: 'abcd',
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Map Click Handler for picking locations on map
      // will this work?
      map.on('click', (e: any) => {
        if (onSelectMapLocation) {
          onSelectMapLocation(e.latlng.lat, e.latlng.lng);
        }
      });

      setMapLoaded(true);
    }

    initLeaflet();

    // this will run on the first load of the page so its cool
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Tile Style Toggle
  useEffect(() => {
    if (!mapInstanceRef.current || !LRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      mapStyle === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current = LRef.current
      .tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      })
      .addTo(mapInstanceRef.current);
  }, [mapStyle]);

  // Update User Geolocation Pulse Marker
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapInstanceRef.current;

    if (userLocation) {
      const userDivIcon = L.divIcon({
        className: 'user-pulse-marker',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng(userLocation);
      } else {
        userMarkerRef.current = L.marker(userLocation, {
          icon: userDivIcon,
          zIndexOffset: 1000,
        })
          .addTo(map)
          .bindTooltip('Your GPS Location', {
            permanent: false,
            direction: 'top',
          });
      }
    }
  }, [userLocation, mapLoaded]);

  // Update Pickup & Dropoff Markers
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapInstanceRef.current;

    // Pickup Marker (Green Pin)
    if (pickup) {
      const pickupIcon = L.divIcon({
        className: 'pickup-pin-icon',
        html: '<div style="font-size:14px; font-weight:800;">A</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setLatLng([pickup.lat, pickup.lng]);
      } else {
        pickupMarkerRef.current = L.marker([pickup.lat, pickup.lng], {
          icon: pickupIcon,
          draggable: true,
          zIndexOffset: 900,
        }).addTo(map);

        pickupMarkerRef.current.on('dragend', (e: any) => {
          const latLng = e.target.getLatLng();
          if (onMarkerDragEnd)
            onMarkerDragEnd('pickup', latLng.lat, latLng.lng);
        });
      }
      pickupMarkerRef.current.bindPopup(
        `<b>Pickup Location</b><br/>${pickup.name || pickup.address}`,
      );
    } else if (pickupMarkerRef.current) {
      map.removeLayer(pickupMarkerRef.current);
      pickupMarkerRef.current = null;
    }

    // Dropoff Marker (Red Pin)
    if (dropoff) {
      const dropoffIcon = L.divIcon({
        className: 'dropoff-pin-icon',
        html: '<div style="font-size:14px; font-weight:800;">B</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.setLatLng([dropoff.lat, dropoff.lng]);
      } else {
        dropoffMarkerRef.current = L.marker([dropoff.lat, dropoff.lng], {
          icon: dropoffIcon,
          draggable: true,
          zIndexOffset: 900,
        }).addTo(map);

        dropoffMarkerRef.current.on('dragend', (e: any) => {
          const latLng = e.target.getLatLng();
          if (onMarkerDragEnd)
            onMarkerDragEnd('dropoff', latLng.lat, latLng.lng);
        });
      }
      dropoffMarkerRef.current.bindPopup(
        `<b>Destination</b><br/>${dropoff.name || dropoff.address}`,
      );
    } else if (dropoffMarkerRef.current) {
      map.removeLayer(dropoffMarkerRef.current);
      dropoffMarkerRef.current = null;
    }

    // Auto fit bounds to pickup & dropoff if both exist and no active driver trip yet
    if (pickup && dropoff && rideStatus === 'idle') {
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ]);
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 });
    }
  }, [pickup, dropoff, mapLoaded, rideStatus]);

  // Update Polyline Route Coordinates
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapInstanceRef.current;

    // Clear previous polylines
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    if (routeCoveredPolylineRef.current) {
      map.removeLayer(routeCoveredPolylineRef.current);
      routeCoveredPolylineRef.current = null;
    }

    if (routeCoordinates && routeCoordinates.length > 1) {
      // Main sleek route line
      routePolylineRef.current = L.polyline(routeCoordinates, {
        color: '#059669',
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Fit bounds nicely to route
      if (rideStatus === 'idle' || rideStatus === 'searching') {
        map.fitBounds(routePolylineRef.current.getBounds(), {
          padding: [60, 60],
        });
      }
    }
  }, [routeCoordinates, mapLoaded]);

  // Update Nearby Drivers (when searching or idle)
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapInstanceRef.current;

    // Remove existing nearby markers
    nearbyDriverMarkersRef.current.forEach(m => map.removeLayer(m));
    nearbyDriverMarkersRef.current = [];

    if (rideStatus === 'idle' || rideStatus === 'searching') {
      nearbyDrivers.forEach(driver => {
        const carIcon = L.divIcon({
          className: 'driver-car-marker',
          html: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker(driver.currentPos, { icon: carIcon })
          .addTo(map)
          .bindTooltip(`${driver.carModel} • ${driver.rating} ★`, {
            direction: 'top',
          });

        nearbyDriverMarkersRef.current.push(marker);
      });
    }
  }, [nearbyDrivers, rideStatus, mapLoaded]);

  // Update Active Assigned Driver Position during ride
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !LRef.current) return;
    const L = LRef.current;
    const map = mapInstanceRef.current;

    if (
      activeDriver &&
      driverPosition &&
      (rideStatus === 'driver_arriving' ||
        rideStatus === 'in_progress' ||
        rideStatus === 'driver_assigned')
    ) {
      const activeCarIcon = L.divIcon({
        className: 'driver-car-marker active-driver',
        html: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5-1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      if (activeDriverMarkerRef.current) {
        activeDriverMarkerRef.current.setLatLng(driverPosition);
      } else {
        activeDriverMarkerRef.current = L.marker(driverPosition, {
          icon: activeCarIcon,
          zIndexOffset: 1200,
        })
          .addTo(map)
          .bindPopup(
            `<b>${activeDriver.name}</b><br/>${activeDriver.carModel} (${activeDriver.plateNumber})`,
          );
      }

      // Smooth pan map to track driver position during active trip
      if (rideStatus === 'in_progress' || rideStatus === 'driver_arriving') {
        map.panTo(driverPosition, { animate: true, duration: 0.5 });
      }
    } else if (activeDriverMarkerRef.current) {
      map.removeLayer(activeDriverMarkerRef.current);
      activeDriverMarkerRef.current = null;
    }
  }, [driverPosition, activeDriver, rideStatus, mapLoaded]);

  const handleCenterOnUser = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.flyTo(userLocation, 16, {
        animate: true,
        duration: 1,
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-100">
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-100" />

      {/* Floating Selection Banner when in Click-to-Pick Mode */}
      {selectionMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-400 bg-emerald-900/90 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 backdrop-blur-md border border-emerald-500/30 animate-bounce">
          <MapPin className="w-4 h-4 text-emerald-400" />
          Click anywhere on map to set{' '}
          {selectionMode === 'pickup'
            ? 'Pickup Location (A)'
            : 'Destination (B)'}
        </div>
      )}

      {/* Map Floating Control Tools */}
      <div className="absolute top-4 right-4 z-400 flex flex-col gap-2">
        <button
          onClick={handleCenterOnUser}
          className="p-3 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl shadow-lg border border-slate-200 transition-all active:scale-95 flex items-center justify-center"
          title="Center on my GPS location"
        >
          <Crosshair className="w-5 h-5 text-emerald-600" />
        </button>

        <button
          onClick={() =>
            setMapStyle(mapStyle === 'voyager' ? 'standard' : 'voyager')
          }
          className="p-3 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl shadow-lg border border-slate-200 transition-all active:scale-95 flex items-center justify-center"
          title="Toggle Map Style"
        >
          <Layers className="w-5 h-5 text-slate-700" />
        </button>
      </div>
    </div>
  );
}
