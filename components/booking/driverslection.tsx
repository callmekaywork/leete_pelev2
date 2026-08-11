'use client';

import React from 'react';
import { DriverInfo } from '@/lib/types';
// import { getDriverRemainingSeats } from '@/lib/db';
import {
  Car,
  Star,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { getDriverRemainingSeats } from '../rideFunctions/tempFuncitons';

interface DriverSelectionTabProps {
  drivers: DriverInfo[];
  seatsBooked: number;
  selectedDate: string;
  selectedDriverId: string;
  onSelectDriverId: (driverId: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export default function DriverSelectionTab({
  drivers,
  seatsBooked,
  selectedDate,
  selectedDriverId,
  onSelectDriverId,
  onNextStep,
  onPrevStep,
}: DriverSelectionTabProps) {
  // Compute driver seat availability for the selected date
  const driverSeatAvailability = drivers.map(driver => {
    const seatsRemaining = getDriverRemainingSeats(driver, selectedDate);
    return {
      driver,
      seatsRemaining,
      hasSpace: seatsRemaining >= seatsBooked,
    };
  });

  const eligibleDrivers = driverSeatAvailability.filter(item => item.hasSpace);

  // Effective selected driver ID
  const effectiveDriverId = (() => {
    if (selectedDriverId === 'auto') return 'auto';
    const target = driverSeatAvailability.find(
      item => item.driver.id === selectedDriverId,
    );
    return target && target.hasSpace ? selectedDriverId : 'auto';
  })();

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#32BB78] uppercase tracking-wider flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5" /> Step 3: Vehicle & Driver
          </span>
          <span className="text-[11px] font-bold text-zinc-300">
            {eligibleDrivers.length}{' '}
            {eligibleDrivers.length === 1 ? 'Driver' : 'Drivers'} Available
          </span>
        </div>

        {/* Driver Selection Grid */}
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto no-scrollbar pr-0.5">
          {/* Option 1: Auto Best Match */}
          <button
            type="button"
            onClick={() => onSelectDriverId('auto')}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
              effectiveDriverId === 'auto'
                ? 'bg-[#32BB78]/15 border-[#32BB78] ring-1 ring-[#32BB78]'
                : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#32BB78] text-zinc-950 flex items-center justify-center font-black shrink-0 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">
                    Auto Best Match Shuttle
                  </span>
                  <span className="text-[9px] font-bold bg-[#32BB78]/20 text-[#32BB78] px-2 py-0.5 rounded-full border border-[#32BB78]/30">
                    Recommended
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  System automatically assigns closest available driver with{' '}
                  {seatsBooked}+ seats.
                </span>
              </div>
            </div>
            {effectiveDriverId === 'auto' && (
              <CheckCircle2 className="w-5 h-5 text-[#32BB78] shrink-0" />
            )}
          </button>

          {/* Option 2: Specific Drivers */}
          {driverSeatAvailability.map(
            ({ driver, seatsRemaining, hasSpace }) => {
              const isSelected = effectiveDriverId === driver.id;

              return (
                <button
                  key={driver.id}
                  type="button"
                  disabled={!hasSpace}
                  onClick={() => onSelectDriverId(driver.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#32BB78]/15 border-[#32BB78] ring-1 ring-[#32BB78]'
                      : hasSpace
                        ? 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
                        : 'bg-zinc-950/30 border-zinc-900 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-zinc-900 text-[#32BB78] text-[9px] font-extrabold px-1 rounded border border-zinc-700 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-[#32BB78]" />
                        {driver.rating}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {driver.name}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 shrink-0">
                          {driver.plateNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span>{driver.carModel}</span>
                        <span>•</span>
                        <span
                          className={
                            hasSpace
                              ? 'text-[#32BB78] font-bold'
                              : 'text-red-400'
                          }
                        >
                          {seatsRemaining} seats left
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-[#32BB78] shrink-0" />
                  )}
                </button>
              );
            },
          )}
        </div>

        {eligibleDrivers.length === 0 && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              No drivers have {seatsBooked} available seats on {selectedDate}.
            </span>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPrevStep}
          className="py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800 transition-colors"
        >
          Back to Seats
        </button>
        <button
          type="button"
          onClick={onNextStep}
          disabled={eligibleDrivers.length === 0}
          className="py-3 bg-[#32BB78] hover:bg-[#28a065] text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg disabled:opacity-40 flex items-center justify-center gap-1.5"
        >
          <span>Passenger Details</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
