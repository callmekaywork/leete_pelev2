'use client';

import React from 'react';
import { LocationPoint, DriverInfo } from '@/lib/types';
import {
  User,
  Phone,
  FileText,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Navigation,
  Calendar,
  Users,
  Car,
} from 'lucide-react';

interface PassengerDetailsTabProps {
  passengerName: string;
  onChangePassengerName: (name: string) => void;
  passengerPhone: string;
  onChangePassengerPhone: (phone: string) => void;
  notes: string;
  onChangeNotes: (notes: string) => void;
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  seatsBooked: number;
  selectedDate: string;
  selectedDriverId: string;
  drivers: DriverInfo[];
  onSubmitBooking: () => void;
  onPrevStep: () => void;
}

export default function PassengerDetailsTab({
  passengerName,
  onChangePassengerName,
  passengerPhone,
  onChangePassengerPhone,
  notes,
  onChangeNotes,
  pickup,
  dropoff,
  seatsBooked,
  selectedDate,
  selectedDriverId,
  drivers,
  onSubmitBooking,
  onPrevStep,
}: PassengerDetailsTabProps) {
  const chosenDriver =
    selectedDriverId !== 'auto'
      ? drivers.find(d => d.id === selectedDriverId)
      : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#32BB78] uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Step 4: Passenger Info
          </span>
          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
            Final Step
          </span>
        </div>

        {/* Passenger Input Fields */}
        <div className="flex flex-col gap-2.5">
          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              Passenger Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Full Name (e.g. Alex Johnson)"
                value={passengerName}
                onChange={e => onChangePassengerName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#32BB78]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
              <input
                type="tel"
                placeholder="Phone Number (e.g. +1 555-019-2831)"
                value={passengerPhone}
                onChange={e => onChangePassengerPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#32BB78]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              Trip Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Luggage count, child seats, flight number..."
                value={notes}
                onChange={e => onChangeNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#32BB78]"
              />
            </div>
          </div>
        </div>

        {/* Final Booking Summary Card */}
        <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 flex flex-col gap-2 mt-1">
          <span className="text-[10px] font-bold text-[#32BB78] uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Compiled Booking Summary
          </span>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800/60">
              <span className="text-zinc-500 block text-[9px] uppercase font-bold">
                Pickup
              </span>
              <span className="text-white font-bold truncate block">
                {pickup?.name || 'Not set'}
              </span>
            </div>

            <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800/60">
              <span className="text-zinc-500 block text-[9px] uppercase font-bold">
                Dropoff
              </span>
              <span className="text-white font-bold truncate block">
                {dropoff?.name || 'Not set'}
              </span>
            </div>

            <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800/60">
              <span className="text-zinc-500 block text-[9px] uppercase font-bold">
                Seats & Date
              </span>
              <span className="text-[#32BB78] font-bold block">
                {seatsBooked} {seatsBooked === 1 ? 'Seat' : 'Seats'} on{' '}
                {selectedDate}
              </span>
            </div>

            <div className="bg-zinc-900 p-2 rounded-xl border border-zinc-800/60">
              <span className="text-zinc-500 block text-[9px] uppercase font-bold">
                Driver Choice
              </span>
              <span className="text-white font-bold truncate block">
                {chosenDriver
                  ? `${chosenDriver.name} (${chosenDriver.plateNumber})`
                  : 'Auto Best Match'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPrevStep}
          className="py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800 transition-colors"
        >
          Back to Driver
        </button>

        <button
          type="button"
          onClick={onSubmitBooking}
          id="confirm-booking-btn"
          className="py-3 bg-[#32BB78] hover:bg-[#28a065] text-zinc-950 font-black text-xs rounded-xl transition-all shadow-xl shadow-[#32BB78]/20 flex items-center justify-center gap-1.5"
        >
          <span>Confirm & Book Seats</span>
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
