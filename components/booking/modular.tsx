'use client';

import React from 'react';
import { Navigation, Users, Car, User } from 'lucide-react';

export type BookingStep = 1 | 2 | 3 | 4;

interface BookingTabNavigationProps {
  currentStep: BookingStep;
  onSelectStep: (step: BookingStep) => void;
  maxReachedStep: number;
}

export default function BookingTabNavigation({
  currentStep,
  onSelectStep,
  maxReachedStep,
}: BookingTabNavigationProps) {
  const steps = [
    { id: 1 as BookingStep, label: 'Route', icon: Navigation },
    { id: 2 as BookingStep, label: 'Seats & Date', icon: Users },
    { id: 3 as BookingStep, label: 'Driver', icon: Car },
    { id: 4 as BookingStep, label: 'Passenger', icon: User },
  ];

  return (
    <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950 rounded-2xl border border-zinc-800/80">
      {steps.map(step => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isAllowed = step.id <= maxReachedStep || step.id === 1;

        return (
          <button
            key={step.id}
            type="button"
            disabled={!isAllowed}
            onClick={() => isAllowed && onSelectStep(step.id)}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
              isActive
                ? 'bg-[#32BB78] text-zinc-950 font-black shadow-md scale-102'
                : isAllowed
                  ? 'text-zinc-300 hover:text-white hover:bg-zinc-900 font-bold'
                  : 'text-zinc-600 cursor-not-allowed opacity-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] truncate max-w-full leading-none">
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
