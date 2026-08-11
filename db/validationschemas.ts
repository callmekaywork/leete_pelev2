import { calculateAge } from '@/components/rideFunctions/tempFuncitons';
import { z } from 'zod';

export const RequestSchema = z.object({
  name: z.string().min(3), // "A"
  email: z.string().email(), // "CWECSDF@mynwu.ac.za"
  company: z.string(), // "0" (could be z.number() if numeric)
  services: z.array(z.string()), // ["Market Positioning", "Digital Systems"]
  status: z.enum(['new', 'in_progress', 'completed', 'cancelled']), // "new"
  totalPrice: z.number().int().nonnegative(), // 7500
  date: z.coerce.date().optional(), // "2026-05-03T22:39:02.743Z"
});

export const ConsultFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(7, 'Mobile number is required'),

  contactMethod: z.enum(['Phone Call', 'Email', 'WhatsApp']).default('Email'),

  hasBusiness: z.boolean(),
  businessName: z.string().min(2).optional(),
  industry: z.string().optional(),
  businessStage: z.string().optional(),
  website: z.string('Invalid website URL').optional(),

  challenge: z.string().min(10, 'Please describe your challenge'),
  clarityGoal: z.string().min(2, 'Please describe your clarity goal'),
  implementationReady: z
    .string()
    .min(2, 'Implementation readiness is required'),

  status: z.enum(['pending', 'confirmed', 'cancelled']),
  preferredDateTime: z.string().min(2, 'Preferred date/time is required'),
  date: z.string().min(2, 'Date is required'),
});

export const applicationFormSchema = z.object({
  personName: z.string().min(3).max(255),
  personSurname: z.string().min(3).max(255),

  businessName: z.string().min(3).max(255),
});

export const StartupFormSchema = z.object({
  // Personal Info
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.email('Invalid email address'),
  role: z.string().min(2, 'Role is required'),
  linkedin: z.string('Invalid LinkedIn URL').optional(),

  // Startup Info
  startupName: z.string().min(2, 'Startup name is required'),
  industry: z.string().min(2, 'Industry is required'),
  stage: z.enum(['Idea', 'MVP', 'Early Traction', 'Scaling', 'Established']),
  teamSize: z.coerce.number().min(1, 'Team size must be at least 1'),
  website: z.string('Invalid website URL').optional(),

  // Business Details
  description: z.string().min(10, 'Description must be at least 10 characters'),
  currentChallenges: z.string().min(10, 'Please describe your challenges'),
  revenueModel: z.string().min(2, 'Revenue model is required'),

  // Mentorship Goals
  goals: z.string().min(10, 'Please describe your goals'),
  preferredExpertise: z
    .array(z.string())
    .min(1, 'Select at least one area of expertise'),
  commitmentLevel: z.string().min(2, 'Commitment level is required').optional(),
});

export const CorporateFormSchema = z.object({
  // Personal Info
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role is required'),
  linkedin: z.string('Invalid LinkedIn URL').optional(),

  // Corporate Info
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  size: z.coerce.number().min(1, 'Company size must be at least 1'),
  website: z.string('Invalid website URL').optional(),

  // Business Details
  description: z.string().min(10, 'Description must be at least 10 characters'),
  currentChallenges: z.string().min(10, 'Please describe your challenges'),
  revenueModel: z.string().min(2, 'Revenue model is required'),

  // Mentorship Goals
  goals: z.string().min(10, 'Please describe your goals'),
  preferredExpertise: z
    .array(z.string())
    .min(1, 'Select at least one area of expertise'),
  commitmentLevel: z.string().min(2, 'Commitment level is required').optional(),
});

export const personSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(2, 'Role is required'),
  linkedin: z.string().url('Invalid LinkedIn URL').or(z.string().length(0)),
});

export const startupSchema = z.object({
  id: z.number().int().optional(),
  personId: z.number().int(), // FK to person
  startupName: z.string().max(150),
  industry: z.string().max(100),
  stage: z.string().max(50),
  teamSize: z.number().int(),
  website: z.string().url().max(255).optional(),
});

export const corporateSchema = z.object({
  id: z.number().int().optional(),
  personId: z.number().int(), // FK to person
  companyName: z.string().max(150),
  industry: z.string().max(100),
  size: z.number().int(),
  website: z.string().url().max(255).optional(),
});

export const individualSchema = z.object({
  id: z.number().int().optional(),
  personId: z.number().int(), // FK to person
  occupation: z.string().max(100).optional(),
  skills: z.array(z.string()).optional(),
});

export const postSchema = z.object({
  id: z.string().optional().default(''),
  authorId: z.string(),
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be URL-friendly (lowercase, hyphens)',
    }),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.preprocess(val => {
    if (!val) return undefined;
    const d = new Date(val as string);
    return isNaN(d.getTime()) ? undefined : d;
  }, z.date().optional()),
  endDate: z.preprocess(val => {
    if (!val) return undefined;
    const d = new Date(val as string);
    return isNaN(d.getTime()) ? undefined : d;
  }, z.date().optional()),

  updatedAt: z.date().optional(),
});

export const driverSchema = z.object({
  id: z.string(),
  userId: z.string(), // references users.id
  avatar: z.string().url(),
  rating: z.number().min(0).max(5),
  totalTrips: z.number().int().nonnegative(),
  carModel: z.string().min(1),
  carColor: z.string().min(1),
  plateNumber: z.string().min(1),
  phone: z.string().min(7),
  currentPos: z.tuple([z.number(), z.number()]),
  capacity: z.number().int().positive(),
  occupiedSeats: z.number().int().min(0),
});

// Zod schema
export const bookingSchema = z.object({
  id: z.string(),
  driverId: z.string(),
  driverName: z.string().min(1),
  carModel: z.string().min(1),
  plateNumber: z.string().min(1),
  bookingDate: z.string(), // ISO date string
  passengerName: z.string().min(1),
  passengerPhone: z.string().min(7),
  notes: z.string().optional(),
  seatsBooked: z.number().int().positive(),
  pickup: z.string().min(1),
  dropoff: z.string().min(1),
  createdAt: z.string().datetime(), // ISO timestamp
  status: z.enum(['confirmed', 'pending', 'cancelled']),
});

export type FileDocument = z.infer<typeof fileDocumentSchema>;

// Single File Object Schema
export const fileDocumentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'File name is required'),
  size: z.number().max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
  type: z
    .string()
    .refine(
      val =>
        ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(
          val,
        ),
      'Supported formats: JPG, PNG, WEBP, or PDF',
    ),
  url: z.string().min(1, 'Document file preview is required'),
  uploadedAt: z.string(),
  status: z.enum(['pending', 'verified', 'rejected']),
  ocrData: z
    .object({
      extractedText: z.string().optional(),
      confidence: z.number().optional(),
    })
    .optional(),
});

const requiredFileField = (errorMessage: string) =>
  fileDocumentSchema
    .nullable()
    .refine((file): file is FileDocument => file !== null, {
      message: errorMessage,
    });

// STEP 1: Personal Details & Age Verification
export const Step1PersonalSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long'),
  email: z
    .string()
    .email('Please enter a valid email address (e.g. driver@bolt.com)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*[0-9])/,
      'Password must contain at least one letter and one number',
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z
    .enum(['admin', 'staff', 'user'], {
      message: 'Role must be staff, or user or driver',
    })
    .default('user'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(
      /^\+?[0-9\s\-()]{10,20}$/,
      'Please enter a valid phone number format',
    ),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(dob => {
      const age = calculateAge(dob);
      return age >= 21;
    }, 'Bolt requires drivers to be at least 21 years of age'),
  city: z.string().min(2, 'Please select or enter your primary operating city'),
  address: z.string().min(5, 'Please enter your full home address'),
});

export const step1PersonalSchema = Step1PersonalSchema.refine(
  data => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  },
);

// STEP 2 Raw Object Shape
const step2Fields = z.object({
  nationalIdOrSSN: z
    .string()
    .min(8, 'National ID / SSN / Tax Number must be at least 8 characters')
    .regex(
      /^[A-Za-z0-9\-]+$/,
      'ID number must contain alphanumeric characters',
    ),
  driverLicenseNumber: z
    .string()
    .min(6, "Driver's license number must be at least 6 characters"),
  licenseExpiryDate: z
    .string()
    .min(1, 'License expiration date is required')
    .refine(dateStr => {
      const exp = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return exp > today;
    }, "Your driver's license has expired or expires today"),
  drivingExperienceYears: z
    .number({ message: 'Driving experience must be a number' })
    .min(1, 'Minimum 1 year of active driving experience required'),
  hasCriminalRecord: z.boolean().default(false),
  criminalRecordExplanation: z.string().optional(),
  consentBackgroundCheck: z.boolean().refine(val => val === true, {
    message: 'You must consent to a full background check to drive with Bolt',
  }),
  consentTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept Bolt Driver Partner terms and safety policies',
  }),
  signatureName: z
    .string()
    .min(3, 'Please type your full legal name as a signature'),
});

// STEP 2 Schema with Refinement
export const step2BackgroundCheckSchema = step2Fields.refine(
  data => {
    if (data.hasCriminalRecord) {
      return (
        data.criminalRecordExplanation &&
        data.criminalRecordExplanation.trim().length >= 10
      );
    }
    return true;
  },
  {
    message: 'Please provide details regarding driving history or prior record',
    path: ['criminalRecordExplanation'],
  },
);

// STEP 3: Vehicle Information
const currentYear = new Date().getFullYear();
export const step3VehicleSchema = z.object({
  vehicleCategory: z.enum(
    [
      'bolt_standard',
      'bolt_comfort',
      'bolt_green',
      'bolt_executive',
      'bolt_xl',
    ],
    {
      message: 'Please select a valid Bolt vehicle category',
    },
  ),
  make: z.string().min(2, 'Vehicle make is required (e.g. Toyota, Tesla)'),
  model: z.string().min(1, 'Vehicle model is required (e.g. Prius, Model 3)'),
  year: z
    .number({ message: 'Model year must be a number' })
    .min(2014, 'Vehicle must be model year 2014 or newer for Bolt service')
    .max(currentYear + 1, 'Invalid vehicle model year'),
  color: z.string().min(2, 'Vehicle color is required'),
  licensePlate: z.string().min(4, 'License plate is required'),
  seatsCount: z
    .number()
    .min(4, 'Vehicle must have at least 4 passenger seats')
    .max(9, 'Maximum 9 seats supported'),
  fuelType: z.enum(['electric', 'hybrid', 'gasoline', 'diesel'], {
    message: 'Please select vehicle fuel type',
  }),
});

// STEP 4: Dynamic Document Uploads
export const step4DocumentsSchema = z.object({
  licenseFront: requiredFileField(
    "Driver's License (Front) document is required",
  ),
  licenseBack: requiredFileField(
    "Driver's License (Back) document is required",
  ),
  vehicleRegistration: requiredFileField(
    'Vehicle Registration Logbook (V5C / Title) is required',
  ),
  vehicleInsurance: requiredFileField(
    'Commercial Vehicle Insurance Certificate is required',
  ),
  vehicleInspection: requiredFileField(
    'Vehicle Inspection / Safety Certificate is required',
  ),
  profilePhoto: requiredFileField(
    'Clear driver headshot photo is required for ride profile',
  ),
});

// Full Combined Registration Schema
export const fullDriverSchema = z
  .object({
    // Personal
    firstName: Step1PersonalSchema.shape.firstName,
    lastName: Step1PersonalSchema.shape.lastName,
    email: Step1PersonalSchema.shape.email,
    password: Step1PersonalSchema.shape.password,
    confirmPassword: Step1PersonalSchema.shape.confirmPassword,
    phone: Step1PersonalSchema.shape.phone,
    dateOfBirth: Step1PersonalSchema.shape.dateOfBirth,
    city: Step1PersonalSchema.shape.city,
    address: Step1PersonalSchema.shape.address,

    // Background Check
    nationalIdOrSSN: step2Fields.shape.nationalIdOrSSN,
    driverLicenseNumber: step2Fields.shape.driverLicenseNumber,
    licenseExpiryDate: step2Fields.shape.licenseExpiryDate,
    drivingExperienceYears: step2Fields.shape.drivingExperienceYears,
    hasCriminalRecord: step2Fields.shape.hasCriminalRecord,
    criminalRecordExplanation: step2Fields.shape.criminalRecordExplanation,
    consentBackgroundCheck: step2Fields.shape.consentBackgroundCheck,
    consentTerms: step2Fields.shape.consentTerms,
    signatureName: step2Fields.shape.signatureName,

    // Vehicle
    vehicleCategory: step3VehicleSchema.shape.vehicleCategory,
    make: step3VehicleSchema.shape.make,
    model: step3VehicleSchema.shape.model,
    year: step3VehicleSchema.shape.year,
    color: step3VehicleSchema.shape.color,
    licensePlate: step3VehicleSchema.shape.licensePlate,
    seatsCount: step3VehicleSchema.shape.seatsCount,
    fuelType: step3VehicleSchema.shape.fuelType,

    // Documents
    licenseFront: step4DocumentsSchema.shape.licenseFront,
    licenseBack: step4DocumentsSchema.shape.licenseBack,
    vehicleRegistration: step4DocumentsSchema.shape.vehicleRegistration,
    vehicleInsurance: step4DocumentsSchema.shape.vehicleInsurance,
    vehicleInspection: step4DocumentsSchema.shape.vehicleInspection,
    profilePhoto: step4DocumentsSchema.shape.profilePhoto,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    data => {
      if (data.hasCriminalRecord) {
        return (
          data.criminalRecordExplanation &&
          data.criminalRecordExplanation.trim().length >= 10
        );
      }
      return true;
    },
    {
      message:
        'Please provide details regarding driving history or prior record',
      path: ['criminalRecordExplanation'],
    },
  );

export type DriverFormData = z.input<typeof fullDriverSchema>;
