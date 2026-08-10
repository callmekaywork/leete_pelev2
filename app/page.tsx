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

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center  bg-zinc-50 font-sans dark:bg-black">
      <Header />

      {/* </main> */}

      {/* Main Hero Content */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-12 md:py-16 flex flex-col items-center text-center gap-8">
        {/* Hero Title */}
        <div className="flex flex-col gap-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Reserve Your Shuttle Seats in{' '}
            <span className="text-[#32BB78]">Real-Time</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed">
            Select your preferred driver, check vehicle license plates, inspect
            live seat availability for any date, and track your trip on an
            interactive map.
          </p>
        </div>

        {/* Primary CTA Button: "Book first ride" */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mt-2">
          <Link
            href={'/navigation'}
            id="book-first-ride-btn"
            className="w-full sm:w-auto px-8 py-4 bg-[#32BB78] hover:bg-[#28a065] text-zinc-950 font-black text-lg rounded-2xl shadow-xl shadow-[#32BB78]/25 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span>Book first ride</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button className="w-full sm:w-auto px-6 py-4 bg-[#18181B] hover:bg-zinc-800 text-zinc-200 font-bold text-sm rounded-2xl border border-zinc-800 transition-all flex items-center justify-center gap-2">
            <Car className="w-4 h-4 text-[#32BB78]" />
            <span>Driver Portal</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-8 text-left">
          {/* Card 1 */}
          <div className="bg-[#18181B] p-6 rounded-3xl border border-zinc-800/80 hover:border-[#32BB78]/40 transition-colors flex flex-col gap-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#32BB78]/10 text-[#32BB78] border border-[#32BB78]/20 flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Choose Driver & Vehicle
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Browse drivers with vehicle model details, license plate numbers,
              and verified passenger ratings before booking.
            </p>
            <div className="mt-auto pt-2 flex items-center gap-2 text-[11px] font-bold text-[#32BB78]">
              <CheckCircle2 className="w-3.5 h-3.5" /> License Plate
              Verification
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#18181B] p-6 rounded-3xl border border-zinc-800/80 hover:border-[#32BB78]/40 transition-colors flex flex-col gap-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#32BB78]/10 text-[#32BB78] border border-[#32BB78]/20 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Date & Seat Capacity
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Book exact seat counts for today or future dates. See live updates
              on how many seats remain available per vehicle.
            </p>
            <div className="mt-auto pt-2 flex items-center gap-2 text-[11px] font-bold text-[#32BB78]">
              <Calendar className="w-3.5 h-3.5" /> Local Database Seat Guarantee
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#18181B] p-6 rounded-3xl border border-zinc-800/80 hover:border-[#32BB78]/40 transition-colors flex flex-col gap-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#32BB78]/10 text-[#32BB78] border border-[#32BB78]/20 flex items-center justify-center">
              {/* <Navigation className="w-6 h-6" /> */}
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Live Route & Driver View
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Follow driver approach and trip routes on an interactive map.
              Drivers can also view passenger manifests in real-time.
            </p>
            <div className="mt-auto pt-2 flex items-center gap-2 text-[11px] font-bold text-[#32BB78]">
              <Sparkles className="w-3.5 h-3.5" /> GPS Routing & Animation
            </div>
          </div>
        </div>

        {/* Fleet Preview Row */}
        <div className="w-full bg-[#18181B] p-6 rounded-3xl border border-zinc-800 mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left max-w-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#32BB78] block">
              Available Vehicles
            </span>
            <h4 className="text-base font-extrabold text-white">
              Ready for Instant Reservation
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Our fleet drivers are online with guaranteed seat tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            {INITIAL_DRIVERS.slice(0, 3).map(driver => (
              <div
                key={driver.id}
                className="bg-zinc-900 px-3.5 py-2.5 rounded-2xl border border-zinc-800 flex items-center gap-3 text-left"
              >
                <img
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-9 h-9 rounded-xl object-cover border border-[#32BB78]"
                />
                <div>
                  <span className="block text-xs font-extrabold text-white">
                    {driver.carModel}
                  </span>
                  <span className="block text-[10px] font-mono font-bold text-[#32BB78]">
                    {driver.plateNumber}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
