'use client';

import { DriverFormData, fullDriverSchema } from '@/db/validationschemas';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Step1Personal } from '@/components/driverFormSteps/step1Personal';

import { Step1PersonalSchema } from '@/db/validationschemas';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/header';
import { orpc } from '@/orpc/client';

const STORAGE_KEY = 'DriverSafePoint';

export default function NewDriver() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [isCreatingAccountModalOpen, setIsCreatingAccountModalOpen] =
    useState(false);
  const [isUserAccountCreated, setIsUserAccountCreated] = useState(false);
  const [viewMode, setViewMode] = useState<
    'registration' | 'registered_portal'
  >('registration');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<DriverFormData | null>(
    null,
  );
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Initialize React Hook Form with Zod Resolver
  const form = useForm<DriverFormData>({
    resolver: zodResolver(fullDriverSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      city: '',
      address: '',
      nationalIdOrSSN: '',
      driverLicenseNumber: '',
      licenseExpiryDate: '',
      drivingExperienceYears: 1,
      hasCriminalRecord: false,
      criminalRecordExplanation: '',
      consentBackgroundCheck: false,
      consentTerms: false,
      signatureName: '',
      vehicleCategory: 'bolt_standard',
      make: '',
      model: '',
      year: 2022,
      color: '',
      licensePlate: '',
      seatsCount: 4,
      fuelType: 'electric',
      licenseFront: null,
      licenseBack: null,
      vehicleRegistration: null,
      vehicleInsurance: null,
      vehicleInspection: null,
      profilePhoto: null,
    },
  });

  const {
    watch,
    reset,
    trigger,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = form;

  const formValues = watch();

  // Load saved draft on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          reset(parsed);
          setLastSavedAt('recently');
        }
      }
    } catch (e) {
      console.error('Failed to load saved draft', e);
    }
  }, [reset]);

  // Auto-save form state changes to LocalStorage
  useEffect(() => {
    const subscription = watch((value: any) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        const now = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        setLastSavedAt(now);
      } catch (e) {
        // storage quota fallback
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Validate individual step state
  const isStep1Valid = Step1PersonalSchema.safeParse(formValues).success;
  //   const isStep2Valid = step2BackgroundCheckSchema.safeParse(formValues).success;
  //   const isStep3Valid = step3VehicleSchema.safeParse(formValues).success;
  //   const isStep4Valid = step4DocumentsSchema.safeParse(formValues).success;

  const stepValidityMap: Record<number, boolean> = {
    1: isStep1Valid,
    // 2: isStep2Valid,
    // 3: isStep3Valid,
    // 4: isStep4Valid,
    5: isValid,
  };

  // // Preset Handlers
  // const handleFillValid = () => {
  //   reset({ ...getValues(), ...validDriverPreset } as DriverFormData);
  //   trigger();
  // };

  // const handleFillUnderage = () => {
  //   reset({ ...getValues(), ...underageDriverPreset } as DriverFormData);
  //   trigger();
  // };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    reset({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      city: '',
      address: '',
      nationalIdOrSSN: '',
      driverLicenseNumber: '',
      licenseExpiryDate: '',
      drivingExperienceYears: 1,
      hasCriminalRecord: false,
      criminalRecordExplanation: '',
      consentBackgroundCheck: false,
      consentTerms: false,
      signatureName: '',
      vehicleCategory: 'bolt_standard',
      make: '',
      model: '',
      year: 2022,
      color: '',
      licensePlate: '',
      seatsCount: 4,
      fuelType: 'electric',
      licenseFront: null,
      licenseBack: null,
      vehicleRegistration: null,
      vehicleInsurance: null,
      vehicleInspection: null,
      profilePhoto: null,
    });
    setCurrentStep(1);
    setIsSubmitted(false);
    setIsUserAccountCreated(false);
    setLastSavedAt(null);
  };

  // Callback when User Account Creation Modal succeeds
  const handleAccountCreationSuccess = () => {
    setIsCreatingAccountModalOpen(false);
    setIsUserAccountCreated(true);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step Navigation Logic with Zod Field Triggering & Account Creation Modal
  const handleNextStep = async () => {
    const currentValues = form.getValues();

    if (currentStep === 1) {
      const step1Fields: any[] = [
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmPassword',
        'role',
        'phone',
        'dateOfBirth',
        'city',
        'address',
      ];

      const isStep1Valid = await trigger(step1Fields);

      if (isStep1Valid) {
        // Log validated Step 1 driver registration data to console
        console.log('✅ [Step 1 Validated - Driver Identity & Credentials]:', {
          firstName: currentValues.firstName,
          lastName: currentValues.lastName,
          email: currentValues.email,
          phone: currentValues.phone,
          dateOfBirth: currentValues.dateOfBirth,
          city: currentValues.city,
          address: currentValues.address,
        });

        await orpc.driver.create({
          firstName: currentValues.firstName,
          lastName: currentValues.lastName,
          email: currentValues.email,
          password: currentValues.confirmPassword,
          confirmPassword: currentValues.confirmPassword,
          phone: currentValues.phone,
          dateOfBirth: currentValues.dateOfBirth,
          city: currentValues.city,
          address: currentValues.address,
        });

        // Trigger account creation popup modal
        setIsCreatingAccountModalOpen(true);
      }
      return;
    }

    let fieldsToValidate: any[] = [];

    if (currentStep === 2) {
      fieldsToValidate = [
        'nationalIdOrSSN',
        'driverLicenseNumber',
        'licenseExpiryDate',
        'drivingExperienceYears',
        'hasCriminalRecord',
        'criminalRecordExplanation',
        'consentBackgroundCheck',
        'consentTerms',
        'signatureName',
      ];
    } else if (currentStep === 3) {
      fieldsToValidate = [
        'vehicleCategory',
        'make',
        'model',
        'year',
        'color',
        'licensePlate',
        'seatsCount',
        'fuelType',
      ];
    } else if (currentStep === 4) {
      fieldsToValidate = [
        'licenseFront',
        'licenseBack',
        'vehicleRegistration',
        'vehicleInsurance',
        'vehicleInspection',
        'profilePhoto',
      ];
    }

    const isStepValid = await trigger(fieldsToValidate);

    if (isStepValid) {
      if (currentStep === 2) {
        console.log('✅ [Step 2 Validated - Background Check & License]:', {
          nationalIdOrSSN: currentValues.nationalIdOrSSN,
          driverLicenseNumber: currentValues.driverLicenseNumber,
          licenseExpiryDate: currentValues.licenseExpiryDate,
          drivingExperienceYears: currentValues.drivingExperienceYears,
          hasCriminalRecord: currentValues.hasCriminalRecord,
          criminalRecordExplanation: currentValues.criminalRecordExplanation,
          consentBackgroundCheck: currentValues.consentBackgroundCheck,
          consentTerms: currentValues.consentTerms,
          signatureName: currentValues.signatureName,
        });
      } else if (currentStep === 3) {
        console.log('✅ [Step 3 Validated - Vehicle Specifications]:', {
          vehicleCategory: currentValues.vehicleCategory,
          make: currentValues.make,
          model: currentValues.model,
          year: currentValues.year,
          color: currentValues.color,
          licensePlate: currentValues.licensePlate,
          seatsCount: currentValues.seatsCount,
          fuelType: currentValues.fuelType,
        });
      } else if (currentStep === 4) {
        console.log('✅ [Step 4 Validated - Uploaded Documents]:', {
          licenseFront: currentValues.licenseFront?.name,
          licenseBack: currentValues.licenseBack?.name,
          vehicleRegistration: currentValues.vehicleRegistration?.name,
          vehicleInsurance: currentValues.vehicleInsurance?.name,
          vehicleInspection: currentValues.vehicleInspection?.name,
          profilePhoto: currentValues.profilePhoto?.name,
        });
      }

      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Click handler for progress bar
  const handleStepClick = (targetStep: number) => {
    if (targetStep > 1 && !isUserAccountCreated) {
      // Must trigger user registration check on step 1 first
      handleNextStep();
      return;
    }
    setCurrentStep(targetStep);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Form Submission
  const handleFinalSubmit = form.handleSubmit(data => {
    setSubmittedData(data);
    setIsSubmitted(true);
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  return (
    <div>
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Badge Preview Drawer Toggle */}
        <div className="lg:hidden mb-4">
          {/* {showMobilePreview && (
            <div className="mt-3">
              <DriverCardPreview
                formData={formValues}
                errors={errors}
                isValid={isValid}
              />
            </div>
          )} */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Input Area (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            {/* Step Components */}
            <form onSubmit={handleFinalSubmit}>
              {currentStep === 1 && <Step1Personal form={form} />}
              {/* {currentStep === 2 && <Step2BackgroundCheck form={form} />}
              {currentStep === 3 && <Step3VehicleInfo form={form} />}
              {currentStep === 4 && <Step4Documents form={form} />}
              {currentStep === 5 && (
                <Step5Review
                  form={form}
                  onJumpToStep={s => setCurrentStep(s)}
                  isSubmitting={isSubmitting}
                  onSubmit={handleFinalSubmit}
                />
              )} */}

              {/* Navigation Footer Controls */}
              {currentStep < 5 && (
                <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className="px-5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 disabled:opacity-40 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-7 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-slate-900/10"
                    >
                      Continue to Step {currentStep + 1}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Real-time Driver Card Sidebar (4 Cols) */}
          {/* <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
            <DriverCardPreview
              formData={formValues}
              errors={errors}
              isValid={isValid}
            /> */}
        </div>
      </main>
    </div>
  );
}
