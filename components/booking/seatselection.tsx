'use client';

import React from 'react';
import { DriverInfo } from '@/lib/types';

import {
  Users,
  Calendar,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  getTodayDateString,
  getTomorrowDateString,
} from '@/lib/dateCalculations/dateCalc';
import { getDriverRemainingSeats } from '../rideFunctions/tempFuncitons';

interface SeatSelectionTabProps {
  seatsBooked: number;
  onSelectSeats: (seats: number) => void;
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  drivers: DriverInfo[];
  onNextStep: () => void;
  onPrevStep: () => void;
}

export default function SeatSelectionTab({
  seatsBooked,
  onSelectSeats,
  selectedDate,
  onSelectDate,
  drivers,
  onNextStep,
  onPrevStep,
}: SeatSelectionTabProps) {
  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();

  // Check max remaining capacity across drivers for selected date
  const driverCapacities = drivers.map(d =>
    getDriverRemainingSeats(d, selectedDate),
  );
  const maxAvailableSeatsOnDate = Math.max(...driverCapacities, 0);

  // Maximum seats allowed
  const seatOptions = [1, 2, 3, 4, 5, 6];

  return (
    <div className="flex flex-col gap-4">
      {/* Date & Seat Header */}
      <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800/80 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#32BB78] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Step 2: Date & Seat Count
          </span>
          <span className="text-[11px] font-bold text-[#32BB78] bg-[#32BB78]/10 px-2 py-0.5 rounded-full border border-[#32BB78]/20">
            {maxAvailableSeatsOnDate} Seats Max Free
          </span>
        </div>

        {/* Date Selection Options */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#32BB78]" />
            Travel Date
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSelectDate(todayStr)}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                selectedDate === todayStr
                  ? 'bg-[#32BB78] text-zinc-950 border-[#32BB78] shadow-md'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => onSelectDate(tomorrowStr)}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                selectedDate === tomorrowStr
                  ? 'bg-[#32BB78] text-zinc-950 border-[#32BB78] shadow-md'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              Tomorrow
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={e => e.target.value && onSelectDate(e.target.value)}
              className="py-1.5 px-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white text-center focus:outline-none focus:border-[#32BB78]"
            />
          </div>
        </div>

        {/* Seat Quantity Picker */}
        <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#32BB78]" />
              Select Number of Seats
            </label>
            <span className="text-xs font-mono font-extrabold text-white bg-zinc-800 px-2 py-0.5 rounded-md">
              {seatsBooked} {seatsBooked === 1 ? 'Seat' : 'Seats'}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {seatOptions.map(num => {
              const isAvailable = num <= maxAvailableSeatsOnDate;
              return (
                <button
                  key={num}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onSelectSeats(num)}
                  className={`py-2.5 rounded-xl font-extrabold text-xs transition-all border flex flex-col items-center justify-center gap-0.5 ${
                    seatsBooked === num
                      ? 'bg-[#32BB78] text-zinc-950 border-[#32BB78] shadow-md scale-105'
                      : isAvailable
                        ? 'bg-zinc-950 text-white border-zinc-800 hover:border-[#32BB78]/50'
                        : 'bg-zinc-950/40 text-zinc-600 border-zinc-900 cursor-not-allowed'
                  }`}
                >
                  <span>{num}</span>
                  <span className="text-[9px] font-normal opacity-80">
                    {num === 1 ? 'Seat' : 'Seats'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Visual Vehicle Seat Map */}
          <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 flex flex-col gap-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Interactive Seat Layout Preview
            </span>
            <div className="flex items-center justify-center gap-3 py-2 bg-zinc-900/60 rounded-xl border border-zinc-800/60">
              {Array.from({
                length: Math.min(6, Math.max(seatsBooked, 4)),
              }).map((_, idx) => {
                const isSelected = idx < seatsBooked;
                return (
                  <div
                    key={idx}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#32BB78] text-zinc-950 border-[#32BB78] font-black shadow-md ring-2 ring-[#32BB78]/30 scale-105'
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-zinc-400 text-center">
              Reserving{' '}
              <strong className="text-white">
                {seatsBooked} {seatsBooked === 1 ? 'seat' : 'seats'}
              </strong>{' '}
              for date{' '}
              <strong className="text-[#32BB78]">{selectedDate}</strong>.
            </p>
          </div>
        </div>

        {maxAvailableSeatsOnDate < seatsBooked && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              No driver has {seatsBooked} seats available on {selectedDate}. Try
              selecting fewer seats or another date.
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
          Back to Locations
        </button>
        <button
          type="button"
          onClick={onNextStep}
          disabled={maxAvailableSeatsOnDate < seatsBooked}
          className="py-3 bg-[#32BB78] hover:bg-[#28a065] text-zinc-950 font-black text-xs rounded-xl transition-all shadow-lg disabled:opacity-40 flex items-center justify-center gap-1.5"
        >
          <span>Select Vehicle Driver</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
