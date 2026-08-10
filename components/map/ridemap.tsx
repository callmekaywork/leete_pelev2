'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Layers, Maximize2, Navigation, Sun, Moon } from 'lucide-react';
import { LocationPoint } from '@/lib/routeTypes';
// import { CachedRoute } from '@/lib/routeTypes';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L, { LatLng, LeafletMouseEvent } from 'leaflet';

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

interface RideMapProps {
  route: CachedRoute | null;
  mapStyle: 'light' | 'dark' | 'satellite';
  setMapStyle: (style: 'light' | 'dark' | 'satellite') => void;
}

export default function RideMap({
  route,
  mapStyle,
  setMapStyle,
}: RideMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const originMarkerRef = useRef<any>(null);
  const destMarkerRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);

  const [zoomLevel, setZoomLevel] = useState(0);

  const [isPlayingDriverAnim, setIsPlayingDriverAnim] = useState(true);
  const animFrameRef = useRef<number | null>(null);
  const animProgressRef = useRef<number>(0);

  // Handle Tile Layer updates
  const updateTileLayer = (L: any, map: any, style: string) => {
    if (!L || !map) return;
    // Remove existing tile layers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl =
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    if (style === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (style === 'satellite') {
      tileUrl =
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }

    L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = await import('leaflet');
      leafletRef.current = L;

      if (!isMounted || !mapContainerRef.current) return;

      // Default fallback center (Mafikeng)
      const defaultLat = route?.origin?.lat || -25.8653;
      const defaultLng = route?.origin?.lng || 25.6442;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 14,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Add Tile Layer based on mapStyle
      updateTileLayer(L, map, mapStyle);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mapStyle changes
  useEffect(() => {
    if (mapInstanceRef.current && leafletRef.current) {
      updateTileLayer(leafletRef.current, mapInstanceRef.current, mapStyle);
    }
  }, [mapStyle]);

  // Update Markers, Polyline & Driver animation when route changes
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;

    if (!L || !map) return;

    // Clean up previous layers
    if (routePolylineRef.current) map.removeLayer(routePolylineRef.current);
    if (originMarkerRef.current) map.removeLayer(originMarkerRef.current);
    if (destMarkerRef.current) map.removeLayer(destMarkerRef.current);

    if (!route) return;

    const coords = route.routePolyline || [
      [route.origin.lat, route.origin.lng],
      [route.destination.lat, route.destination.lng],
    ];

    // 1. Draw Route Polyline with Bolt Green line
    const polyline = L.polyline(coords, {
      color: '#32BB78',
      weight: 5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    routePolylineRef.current = polyline;

    // Fit map bounds to show full route with padding
    try {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [60, 60] });
    } catch (e) {
      console.error('Fit bounds error:', e);
    }

    // 2. Custom Bolt Pickup Dot Marker
    const pickupHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-7 h-7 rounded-full bg-[#32BB78] border-3 border-white shadow-lg flex items-center justify-center">
          <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
        </div>
      </div>
    `;

    const pickupIcon = L.divIcon({
      html: pickupHtml,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const originMarker = L.marker([route.origin.lat, route.origin.lng], {
      icon: pickupIcon,
    })
      .bindPopup(`<b>Pickup:</b> ${route.origin.name}`)
      .addTo(map);

    originMarkerRef.current = originMarker;

    // 3. Custom Destination Dot Marker
    const destHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-7 h-7 rounded-xl bg-slate-900 border-3 border-white shadow-xl flex items-center justify-center">
          <span style="font-size: 12px; color: white;">🏁</span>
        </div>
      </div>
    `;

    const destIcon = L.divIcon({
      html: destHtml,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const destMarker = L.marker(
      [route.destination.lat, route.destination.lng],
      { icon: destIcon },
    )
      .bindPopup(`<b>Dropoff:</b> ${route.destination.name}`)
      .addTo(map);

    destMarkerRef.current = destMarker;
  }, [route]);

  // Recenter map handler
  const handleRecenter = () => {
    if (!mapInstanceRef.current || !route) return;
    const L = leafletRef.current;
    if (L && route.routePolyline) {
      const bounds = L.latLngBounds(route.routePolyline);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60] });
    }
  };

  return (
    <div className="relative w-full h-full min-h-120 lg:min-h-160  overflow-hidden rounded-2xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="z-10 w-full h-full min-h-120" />

      {/* Map Floating Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Style Selector */}
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200 flex items-center gap-1">
          <button
            onClick={() => setMapStyle('light')}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              mapStyle === 'light'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Light Map"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapStyle('dark')}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              mapStyle === 'dark'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Dark Map"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              mapStyle === 'satellite'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Satellite Map"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Recenter Button */}
        {route && (
          <button
            onClick={handleRecenter}
            className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-slate-200 text-slate-800 hover:text-[#32BB78] transition-all active:scale-95 flex items-center justify-center"
            title="Recenter Route"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Live Map Legend Overlay */}
      {route && (
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-4 text-xs font-bold text-slate-800">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#32BB78]" />
            <span>Pickup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-xs bg-slate-900" />
            <span>Dropoff</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-1 rounded-full bg-[#32BB78]" />
            <span>Route</span>
          </div>
        </div>
      )}

      {/* <div className="h-200 w-full rounded-3xl">
        <MapContainer
          center={[-25.746, 28.188]} // Pretoria area
          zoom={zoomLevel}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div> */}
    </div>
  );
}
