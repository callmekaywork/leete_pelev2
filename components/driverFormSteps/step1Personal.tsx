'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { DriverFormData } from '@/db/validationschemas';
import { calculateAge } from '../rideFunctions/tempFuncitons';

interface Step1Props {
  form: UseFormReturn<DriverFormData>;
}

export const Step1Personal: React.FC<Step1Props> = ({ form }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dobValue = watch('dateOfBirth');
  const calculatedAge = dobValue ? calculateAge(dobValue) : 0;
  const isAgeValid = calculatedAge >= 21;

  const passwordVal = watch('password') || '';
  const confirmPasswordVal = watch('confirmPassword') || '';
  const selectedRole = 'driver';

  // Calculate Password Strength
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[a-zA-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(passwordVal);

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          Driver Account Registration & Identity
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Create your driver account credentials and verify your identity
          details.
        </p>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800">
            First Name <span className="text-emerald-600 font-bold">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Marcus"
              {...register('firstName')}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all bg-white text-slate-900 ${
                errors.firstName
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              }`}
            />
          </div>
          {errors.firstName && (
            <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800">
            Last Name <span className="text-emerald-600 font-bold">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Vance"
            {...register('lastName')}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all bg-white text-slate-900 ${
              errors.lastName
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          />
          {errors.lastName && (
            <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            Email Address <span className="text-emerald-600 font-bold">*</span>
          </label>
          <input
            type="email"
            placeholder="m.vance@email.com"
            {...register('email')}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all bg-white text-slate-900 ${
              errors.email
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          />
          {errors.email && (
            <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Account Password & Security Section Card */}
        <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                Password <span className="text-emerald-600 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters..."
                  {...register('password')}
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-lg border text-sm font-medium transition-all bg-white text-slate-900 ${
                    errors.password
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Strength meter */}
              {passwordVal.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map(step => (
                      <div
                        key={step}
                        className={`flex-1 rounded-full transition-colors ${
                          strengthScore >= step
                            ? strengthScore <= 2
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 flex justify-between">
                    <span>
                      Strength:{' '}
                      {strengthScore >= 3
                        ? 'Strong'
                        : strengthScore === 2
                          ? 'Moderate'
                          : 'Weak'}
                    </span>
                    <span>Min 8 chars, 1 letter & 1 number</span>
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                Confirm Password{' '}
                <span className="text-emerald-600 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password..."
                  {...register('confirmPassword')}
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-lg border text-sm font-medium transition-all bg-white text-slate-900 ${
                    errors.confirmPassword
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {confirmPasswordVal && passwordVal === confirmPasswordVal && (
                <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Passwords match
                </p>
              )}

              {errors.confirmPassword && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{' '}
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* User Role Selection */}
          {/* <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>
                Account Role (
                <code className="text-slate-600 font-mono">role</code> column)
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                Default: staff
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'staff',
                  label: 'Staff Driver',
                  desc: 'Default driver role',
                },
                {
                  id: 'user',
                  label: 'Standard User',
                  desc: 'Rider/General access',
                },
                {
                  id: 'admin',
                  label: 'Fleet Admin',
                  desc: 'Full administrative access',
                },
              ].map(item => (
                <label
                  key={item.id}
                  className={`p-2.5 rounded-lg border cursor-pointer text-center transition-all ${
                    selectedRole === item.id
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 font-bold'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    value={item.id}
                    {...register('role')}
                    className="sr-only"
                  />
                  <div className="text-xs font-bold capitalize flex items-center justify-center gap-1">
                    {selectedRole === item.id && (
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                    {item.desc}
                  </div>
                </label>
              ))}
            </div>
          </div> */}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            Phone Number <span className="text-emerald-600 font-bold">*</span>
          </label>
          <input
            type="tel"
            placeholder="+27 (00) 000-0000"
            {...register('phone')}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all bg-white text-slate-900 ${
              errors.phone
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          />
          {errors.phone && (
            <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.phone.message}
            </p>
          )}
        </div>

        {/* Date of Birth & Live Age Calculation */}
        <div className="space-y-1.5 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Date of Birth{' '}
              <span className="text-emerald-600 font-bold">*</span>
            </label>

            {dobValue && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border ${
                  isAgeValid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {isAgeValid ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{' '}
                    Calculated Age: {calculatedAge} (21+ Requirement Met)
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Age:{' '}
                    {calculatedAge} (Must be at least 21)
                  </>
                )}
              </span>
            )}
          </div>

          <input
            type="date"
            {...register('dateOfBirth')}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all bg-white text-slate-900 ${
              errors.dateOfBirth
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          />

          {errors.dateOfBirth ? (
            <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errors.dateOfBirth.message}
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 font-medium">
              Must be at least 21 years old as verified by government ID.
            </p>
          )}
        </div>

        {/* Operating City */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Primary Operating City{' '}
            <span className="text-emerald-600 font-bold">*</span>
          </label>
          <select
            {...register('city')}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all bg-white text-slate-900 ${
              errors.city
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          >
            <option value="">Select city...</option>
            <option value="London">Mafikeng</option>
            <option value="Manchester">Johannesburg</option>
            <option value="Paris">Klerksdorp</option>
          </select>
          {errors.city && (
            <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.city.message}
            </p>
          )}
        </div>

        {/* Home Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            Full Residential Address{' '}
            <span className="text-emerald-600 font-bold">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 24 Mmadibogong, Mafikeng"
            {...register('address')}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium transition-all bg-white text-slate-900 ${
              errors.address
                ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          />
          {errors.address && (
            <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.address.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
