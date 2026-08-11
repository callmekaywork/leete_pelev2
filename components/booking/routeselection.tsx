'use client';

import React, { useState, useEffect } from 'react';
import { LocationPoint } from '@/lib/types';
import {
  PRESET_LOCATIONS,
  searchAddress,
  calculateDistance,
} from '@/lib/routing';
import {
  MapPin,
  Navigation,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface RouteSelectionTabProps {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  onSelectPickup: (loc: LocationPoint) => void;
  onSelectDropoff: (loc: LocationPoint) => void;
  onStartSearchOnMap: (mode: 'pickup' | 'dropoff') => void;
  userLocation: [number, number] | null;
  onNextStep: () => void;
}

export default function RouteSelectionTab({
  pickup,
  dropoff,
  onSelectPickup,
  onSelectDropoff,
  onStartSearchOnMap,
  userLocation,
  onNextStep,
}: RouteSelectionTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'pickup' | 'dropoff' | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationPoint[]>([]);

  // Debounced location search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchAddress(searchQuery);
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSwapLocations = () => {
    if (pickup && dropoff) {
      const temp = pickup;
      onSelectPickup(dropoff);
      onSelectDropoff(temp);
    }
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      const currentLocPoint: LocationPoint = {
        name: 'My Current Location',
        address: 'GPS Position',
        lat: userLocation[0],
        lng: userLocation[1],
      };
      if (activeSubTab === 'dropoff') {
        onSelectDropoff(currentLocPoint);
      } else {
        onSelectPickup(currentLocPoint);
      }
      setActiveSubTab(null);
      setSearchQuery('');
    }
  };

  const distanceKm =
    pickup && dropoff
      ? calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng)
      : 3.5;
  const estimatedTimeMin = Math.round(distanceKm * 2.8 + 3);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#32BB78] uppercase tracking-wider flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5" /> Step 1: Select Locations
          </span>
          {pickup && dropoff && (
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2.5 py-0.5 rounded-full">
              ~{distanceKm.toFixed(1)} km ({estimatedTimeMin} min)
            </span>
          )}
        </div>

        {/* Pickup Location Selection Box */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab(activeSubTab === 'pickup' ? null : 'pickup');
              setSearchQuery('');
            }}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              activeSubTab === 'pickup'
                ? 'border-[#32BB78] bg-[#32BB78]/10 ring-1 ring-[#32BB78]'
                : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#32BB78]/20 text-[#32BB78] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                  Pickup Point
                </span>
                <span className="text-xs font-semibold text-white truncate block">
                  {pickup ? pickup.name : 'Select Pickup Location'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#32BB78] shrink-0 bg-[#32BB78]/10 px-2 py-1 rounded-md">
              {pickup ? 'Change' : 'Choose'}
            </span>
          </button>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={handleSwapLocations}
            disabled={!pickup || !dropoff}
            className="p-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors border border-zinc-700 disabled:opacity-40"
            title="Swap Pickup & Dropoff"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dropoff Location Selection Box */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab(activeSubTab === 'dropoff' ? null : 'dropoff');
              setSearchQuery('');
            }}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              activeSubTab === 'dropoff'
                ? 'border-[#32BB78] bg-[#32BB78]/10 ring-1 ring-[#32BB78]'
                : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-950'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                  Dropoff Destination
                </span>
                <span className="text-xs font-semibold text-white truncate block">
                  {dropoff ? dropoff.name : 'Select Destination'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#32BB78] shrink-0 bg-[#32BB78]/10 px-2 py-1 rounded-md">
              {dropoff ? 'Change' : 'Choose'}
            </span>
          </button>
        </div>

        {/* Location Dropdown Modal/Search Box */}
        {activeSubTab && (
          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Set {activeSubTab === 'pickup' ? 'Pickup' : 'Dropoff'} Location
              </span>
              <button
                type="button"
                onClick={() => onStartSearchOnMap(activeSubTab)}
                className="text-[10px] font-extrabold text-[#32BB78] hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" /> Select Pin on Map
              </button>
            </div>

            {/* GPS Current Location Button */}
            {userLocation && (
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="w-full p-2.5 rounded-xl bg-[#32BB78]/10 border border-[#32BB78]/30 hover:bg-[#32BB78]/20 transition-all flex items-center gap-2.5 text-xs text-[#32BB78] font-bold"
              >
                <Navigation className="w-3.5 h-3.5 animate-pulse" />
                Use Current Location (GPS)
              </button>
            )}

            {/* Search Address Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Type location or address name..."
                value={searchQuery}
                onChange={e => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.trim().length < 2) setSearchResults([]);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#32BB78]"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="flex flex-col gap-1 max-h-36 overflow-y-auto no-scrollbar">
                <span className="text-[10px] font-bold text-zinc-500 uppercase px-1">
                  Search Suggestions
                </span>
                {searchResults.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (activeSubTab === 'pickup') onSelectPickup(loc);
                      else onSelectDropoff(loc);
                      setActiveSubTab(null);
                      setSearchQuery('');
                    }}
                    className="p-2 rounded-lg hover:bg-zinc-800 text-left text-xs font-medium text-zinc-200 flex items-center gap-2"
                  >
                    <MapPin className="w-3 h-3 text-[#32BB78] shrink-0" />
                    <span className="truncate">{loc.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Preset Locations */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase px-1">
                Popular Hubs
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto no-scrollbar">
                {PRESET_LOCATIONS.map(loc => (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => {
                      if (activeSubTab === 'pickup') onSelectPickup(loc);
                      else onSelectDropoff(loc);
                      setActiveSubTab(null);
                      setSearchQuery('');
                    }}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-left transition-all"
                  >
                    <span className="block text-xs font-bold text-white truncate">
                      {loc.name}
                    </span>
                    <span className="block text-[10px] text-zinc-400 truncate">
                      {loc.address}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Continue to Step 2 */}
      <button
        type="button"
        onClick={onNextStep}
        disabled={!pickup || !dropoff}
        className="w-full py-3 bg-[#32BB78] hover:bg-[#28a065] text-zinc-950 font-black text-sm rounded-xl transition-all shadow-lg disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        <span>Proceed to Date & Seat Selection</span>
        <CheckCircle2 className="w-4 h-4" />
      </button>
    </div>
  );
}
