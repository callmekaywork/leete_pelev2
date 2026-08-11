'use client';

import React, { useState, useEffect } from 'react';
import { LocationPoint, DriverInfo } from '@/lib/types';
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
  Users,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  User,
  Phone,
  FileText,
  Calendar,
  Car,
  Star,
} from 'lucide-react';
import {
  getTodayDateString,
  getTomorrowDateString,
} from '@/lib/dateCalculations/dateCalc';
import { getDriverRemainingSeats } from './tempFuncitons';

interface RideBookingPanelProps {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  seatsBooked: number;
  onSelectSeats: (seats: number) => void;
  drivers: DriverInfo[];
  onSelectPickup: (loc: LocationPoint) => void;
  onSelectDropoff: (loc: LocationPoint) => void;
  onStartSearchOnMap: (mode: 'pickup' | 'dropoff') => void;
  onBookRide: (
    passengerName: string,
    passengerPhone: string,
    notes: string,
    bookingDate: string,
    selectedDriverId: string | null,
  ) => void;
  userLocation: [number, number] | null;
}

export default function RideBookingPanel({
  pickup,
  dropoff,
  seatsBooked,
  onSelectSeats,
  drivers,
  onSelectPickup,
  onSelectDropoff,
  onStartSearchOnMap,
  onBookRide,
  userLocation,
}: RideBookingPanelProps) {
  const [activeTab, setActiveTab] = useState<'pickup' | 'dropoff' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationPoint[]>([]);

  // Travel Date selection
  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Selected Driver ID ('auto' for system best match or explicit driver ID)
  const [selectedDriverId, setSelectedDriverId] = useState<string>('auto');

  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  // Address search debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return;

    const timer = setTimeout(async () => {
      const results = await searchAddress(searchQuery);
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Calculate distance
  const distanceKm =
    pickup && dropoff
      ? calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng)
      : 3.5;
  const estimatedTimeMin = Math.round(distanceKm * 2.8 + 3);

  // Filter matching drivers based on remaining seats ON THE SELECTED DATE
  const driverSeatAvailability = drivers.map(driver => {
    const seatsRemaining = getDriverRemainingSeats(driver, selectedDate);
    return {
      driver,
      seatsRemaining,
      hasSpace: seatsRemaining >= seatsBooked,
    };
  });

  const eligibleDrivers = driverSeatAvailability.filter(item => item.hasSpace);

  // Derive effective selected driver ID
  const effectiveDriverId = (() => {
    if (selectedDriverId === 'auto') return 'auto';
    const target = driverSeatAvailability.find(
      item => item.driver.id === selectedDriverId,
    );
    return target && target.hasSpace ? selectedDriverId : 'auto';
  })();

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
        address: 'GPS Coordinates',
        lat: userLocation[0],
        lng: userLocation[1],
      };
      if (activeTab === 'dropoff') {
        onSelectDropoff(currentLocPoint);
      } else {
        onSelectPickup(currentLocPoint);
      }
      setActiveTab(null);
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-[#f1f1f1] dark:bg-[#18181B] text-zinc-100 rounded-3xl p-5 flex flex-col gap-4 w-full lg:max-w-lg">
      {/* Date Selector Row */}
      <div className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#32BB78]" />
            Select Travel Date
          </span>
          <span className="text-[11px] font-semibold text-zinc-400">
            {selectedDate === todayStr
              ? 'Today'
              : selectedDate === tomorrowStr
                ? 'Tomorrow'
                : selectedDate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedDate === todayStr
                ? 'bg-[#32BB78] text-zinc-950 shadow-md'
                : 'bg-[#18181B] text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDate(tomorrowStr)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedDate === tomorrowStr
                ? 'bg-[#32BB78] text-zinc-950 shadow-md'
                : 'bg-[#18181B] text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
            }`}
          >
            Tomorrow
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={e => e.target.value && setSelectedDate(e.target.value)}
            className="bg-[#18181B] text-xs font-bold text-zinc-200 px-3 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-[#32BB78]"
          />
        </div>
      </div>

      {/* Pickup & Destination Inputs Container */}
      <div className="relative bg-zinc-900/90 p-3 rounded-2xl border border-zinc-800 flex flex-col gap-2.5">
        {/* Connection Line */}
        <div className="absolute left-6.25 top-6.5 bottom-6.5 w-0.5 bg-zinc-700 border-l border-dashed border-zinc-600 z-0" />

        {/* Pickup Input */}
        <div className="relative z-10 flex items-center gap-3 bg-[#18181B] p-2.5 rounded-xl border border-zinc-800 focus-within:border-[#32BB78] transition-colors">
          <div className="w-6 h-6 rounded-full bg-[#32BB78] text-zinc-950 flex items-center justify-center text-xs font-black shrink-0">
            A
          </div>
          <button
            onClick={() => setActiveTab('pickup')}
            className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#32BB78]">
              Pickup Location
            </span>
            <span className="block text-sm font-semibold text-zinc-100 truncate">
              {pickup?.name || pickup?.address || 'Choose pickup point...'}
            </span>
          </button>
          <button
            onClick={() => onStartSearchOnMap('pickup')}
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
            title="Select location on map"
          >
            <MapPin className="w-4 h-4 text-[#32BB78]" />
          </button>
        </div>

        {/* Swap Locations Button */}
        <button
          onClick={handleSwapLocations}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full shadow-md border border-zinc-700 transition-transform active:scale-90"
          title="Swap Pickup and Destination"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-[#32BB78]" />
        </button>

        {/* Dropoff Input */}
        <div className="relative z-10 flex items-center gap-3 bg-[#18181B] p-2.5 rounded-xl border border-zinc-800 focus-within:border-[#32BB78] transition-colors">
          <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-black shrink-0">
            B
          </div>
          <button
            onClick={() => setActiveTab('dropoff')}
            className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap"
          >
            <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-400">
              Destination
            </span>
            <span className="block text-sm font-semibold text-zinc-100 truncate">
              {dropoff?.name || dropoff?.address || 'Where to?'}
            </span>
          </button>
          <button
            onClick={() => onStartSearchOnMap('dropoff')}
            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
            title="Select location on map"
          >
            <MapPin className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>

      {/* Location Search Drawer when searching */}
      {activeTab && (
        <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-xl border border-zinc-800 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#32BB78]">
              Select{' '}
              {activeTab === 'pickup'
                ? 'Pickup Location (A)'
                : 'Destination (B)'}
            </span>
            <button
              onClick={() => {
                setActiveTab(null);
                setSearchQuery('');
              }}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded-lg"
            >
              Close
            </button>
          </div>

          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                const val = e.target.value;
                setSearchQuery(val);
                if (!val || val.trim().length < 2) setSearchResults([]);
              }}
              placeholder="Search station, airport, street..."
              className="w-full bg-[#18181B] text-sm text-white pl-9 pr-3 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-[#32BB78]"
              autoFocus
            />
          </div>

          {userLocation && (
            <button
              onClick={handleUseCurrentLocation}
              className="flex items-center gap-2.5 bg-[#32BB78]/10 hover:bg-[#32BB78]/20 text-[#32BB78] p-2.5 rounded-xl border border-[#32BB78]/30 text-xs font-medium transition-colors"
            >
              <Navigation className="w-4 h-4 text-[#32BB78] shrink-0" />
              <span>Use Current GPS Location</span>
            </button>
          )}

          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 no-scrollbar">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">
              {searchQuery ? 'Search Results' : 'Popular Destinations'}
            </span>
            {(searchQuery ? searchResults : PRESET_LOCATIONS).map(
              (loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (activeTab === 'pickup') onSelectPickup(loc);
                    else onSelectDropoff(loc);
                    setActiveTab(null);
                    setSearchQuery('');
                  }}
                  className="text-left p-2.5 rounded-xl hover:bg-zinc-800 transition-colors flex items-start gap-2.5 group"
                >
                  <MapPin className="w-4 h-4 text-[#32BB78] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="overflow-hidden">
                    <span className="block text-xs font-bold text-zinc-100 truncate">
                      {loc.name}
                    </span>
                    <span className="block text-[11px] text-zinc-400 truncate">
                      {loc.address}
                    </span>
                  </div>
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Seat Quantity Selector */}
      <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#32BB78]" />
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Number of Seats Needed
            </span>
          </div>
          <span className="text-xs font-bold text-[#32BB78] bg-[#32BB78]/10 px-2.5 py-0.5 rounded-full border border-[#32BB78]/20">
            {seatsBooked} {seatsBooked === 1 ? 'Seat' : 'Seats'}
          </span>
        </div>

        {/* Seat Counter Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map(num => {
            const isSelected = seatsBooked === num;
            const matchesAny = driverSeatAvailability.some(
              item => item.seatsRemaining >= num,
            );

            return (
              <button
                key={num}
                onClick={() => onSelectSeats(num)}
                disabled={!matchesAny}
                className={`py-2.5 rounded-xl font-extrabold text-sm flex flex-col items-center justify-center gap-0.5 transition-all ${
                  isSelected
                    ? 'bg-[#32BB78] text-zinc-950 shadow-md shadow-[#32BB78]/20 scale-105'
                    : matchesAny
                      ? 'bg-[#18181B] text-zinc-200 border border-zinc-700 hover:border-[#32BB78] hover:bg-zinc-800'
                      : 'bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed opacity-50'
                }`}
              >
                <span>{num}</span>
                <span className="text-[9px] font-normal tracking-tight opacity-80">
                  {num === 1 ? 'Seat' : 'Seats'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Driver & Vehicle Picker Section */}
      <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-4 h-4 text-[#32BB78]" />
            Choose Driver Vehicle
          </span>
          <span className="text-[11px] font-bold text-zinc-400">
            {eligibleDrivers.length} Available
          </span>
        </div>

        {/* Explicit Driver Vehicle List */}
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
          {driverSeatAvailability.map(
            ({ driver, seatsRemaining, hasSpace }) => {
              const isSelected = selectedDriverId === driver.id;

              return (
                <button
                  key={driver.id}
                  onClick={() => hasSpace && setSelectedDriverId(driver.id)}
                  disabled={!hasSpace}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#32BB78]/15 border-[#32BB78] text-white shadow-md'
                      : hasSpace
                        ? 'bg-[#18181B] border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80'
                        : 'bg-zinc-950/60 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className={`w-11 h-11 rounded-xl object-cover shrink-0 border ${
                        isSelected ? 'border-[#32BB78]' : 'border-zinc-700'
                      }`}
                    />
                    <div className="overflow-hidden">
                      {/* Vehicle Name Prominently Displayed */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white truncate">
                          {driver.carModel}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 shrink-0">
                          {driver.plateNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-zinc-400">
                          {driver.name}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{' '}
                          {driver.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seat Capacity Status Badge for Selected Date */}
                  <div className="text-right shrink-0">
                    {hasSpace ? (
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-[#32BB78]/20 text-[#32BB78] border border-[#32BB78]/30 block">
                        {seatsRemaining} seats left
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 block">
                        Full on{' '}
                        {selectedDate === todayStr ? 'Today' : selectedDate}
                      </span>
                    )}
                  </div>
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Optional Passenger Information Drawer */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setShowDetailsForm(!showDetailsForm)}
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center justify-between py-1 px-1"
        >
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#32BB78]" />
            Passenger Contact & Special Requests (Optional)
          </span>
          <span className="text-[#32BB78] text-[11px]">
            {showDetailsForm ? 'Hide' : 'Add Details'}
          </span>
        </button>

        {showDetailsForm && (
          <div className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 flex flex-col gap-2.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2 bg-[#18181B] px-3 py-2 rounded-xl border border-zinc-800">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={passengerName}
                onChange={e => setPassengerName(e.target.value)}
                placeholder="Passenger Name (e.g., Alex Morgan)"
                className="w-full bg-transparent text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#18181B] px-3 py-2 rounded-xl border border-zinc-800">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="tel"
                value={passengerPhone}
                onChange={e => setPassengerPhone(e.target.value)}
                placeholder="Mobile Number (for SMS updates)"
                className="w-full bg-transparent text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#18181B] px-3 py-2 rounded-xl border border-zinc-800">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Luggage notes or pickup instructions..."
                className="w-full bg-transparent text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Warning message if no driver has enough space */}
      {eligibleDrivers.length === 0 && (
        <div className="bg-amber-950/40 text-amber-300 p-3 rounded-2xl border border-amber-800/60 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            No active drivers currently have {seatsBooked} free seats available
            on {selectedDate}. Try selecting fewer seats or another date.
          </span>
        </div>
      )}

      {/* Book Ride Action Button */}
      <button
        onClick={() =>
          onBookRide(
            passengerName,
            passengerPhone,
            notes,
            selectedDate,
            effectiveDriverId === 'auto' ? null : effectiveDriverId,
          )
        }
        disabled={!pickup || !dropoff || eligibleDrivers.length === 0}
        className="w-full py-3.5 px-6 bg-[#32BB78] hover:bg-[#28a065] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-zinc-950 font-extrabold text-base rounded-2xl shadow-lg shadow-[#32BB78]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <span>
          Confirm Booking ({seatsBooked} {seatsBooked === 1 ? 'Seat' : 'Seats'})
        </span>
        <CheckCircle2 className="w-5 h-5" />
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
        <Info className="w-3.5 h-3.5 text-[#32BB78]" />
        <span>Reservation Platform • Local Seat Database Sync</span>
      </div>
    </div>
  );
}
