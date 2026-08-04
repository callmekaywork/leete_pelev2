import { z } from "zod";

export const RequestSchema = z.object({
  name: z.string().min(3), // "A"
  email: z.string().email(), // "CWECSDF@mynwu.ac.za"
  company: z.string(), // "0" (could be z.number() if numeric)
  services: z.array(z.string()), // ["Market Positioning", "Digital Systems"]
  status: z.enum(["new", "in_progress", "completed", "cancelled"]), // "new"
  totalPrice: z.number().int().nonnegative(), // 7500
  date: z.coerce.date().optional(), // "2026-05-03T22:39:02.743Z"
});

export const ConsultFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(7, "Mobile number is required"),

  contactMethod: z.enum(["Phone Call", "Email", "WhatsApp"]).default("Email"),

  hasBusiness: z.boolean(),
  businessName: z.string().min(2).optional(),
  industry: z.string().optional(),
  businessStage: z.string().optional(),
  website: z.string("Invalid website URL").optional(),

  challenge: z.string().min(10, "Please describe your challenge"),
  clarityGoal: z.string().min(2, "Please describe your clarity goal"),
  implementationReady: z
    .string()
    .min(2, "Implementation readiness is required"),

  status: z.enum(["pending", "confirmed", "cancelled"]),
  preferredDateTime: z.string().min(2, "Preferred date/time is required"),
  date: z.string().min(2, "Date is required"),
});

export const applicationFormSchema = z.object({
  personName: z.string().min(3).max(255),
  personSurname: z.string().min(3).max(255),

  businessName: z.string().min(3).max(255),
});

export const StartupFormSchema = z.object({
  // Personal Info
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email("Invalid email address"),
  role: z.string().min(2, "Role is required"),
  linkedin: z.string("Invalid LinkedIn URL").optional(),

  // Startup Info
  startupName: z.string().min(2, "Startup name is required"),
  industry: z.string().min(2, "Industry is required"),
  stage: z.enum(["Idea", "MVP", "Early Traction", "Scaling", "Established"]),
  teamSize: z.coerce.number().min(1, "Team size must be at least 1"),
  website: z.string("Invalid website URL").optional(),

  // Business Details
  description: z.string().min(10, "Description must be at least 10 characters"),
  currentChallenges: z.string().min(10, "Please describe your challenges"),
  revenueModel: z.string().min(2, "Revenue model is required"),

  // Mentorship Goals
  goals: z.string().min(10, "Please describe your goals"),
  preferredExpertise: z
    .array(z.string())
    .min(1, "Select at least one area of expertise"),
  commitmentLevel: z.string().min(2, "Commitment level is required").optional(),
});

export const CorporateFormSchema = z.object({
  // Personal Info
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(2, "Role is required"),
  linkedin: z.string("Invalid LinkedIn URL").optional(),

  // Corporate Info
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  size: z.coerce.number().min(1, "Company size must be at least 1"),
  website: z.string("Invalid website URL").optional(),

  // Business Details
  description: z.string().min(10, "Description must be at least 10 characters"),
  currentChallenges: z.string().min(10, "Please describe your challenges"),
  revenueModel: z.string().min(2, "Revenue model is required"),

  // Mentorship Goals
  goals: z.string().min(10, "Please describe your goals"),
  preferredExpertise: z
    .array(z.string())
    .min(1, "Select at least one area of expertise"),
  commitmentLevel: z.string().min(2, "Commitment level is required").optional(),
});

export const personSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(2, "Role is required"),
  linkedin: z.string().url("Invalid LinkedIn URL").or(z.string().length(0)),
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
  id: z.string().optional().default(""),
  authorId: z.string(),
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be URL-friendly (lowercase, hyphens)",
    }),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.preprocess((val) => {
    if (!val) return undefined;
    const d = new Date(val as string);
    return isNaN(d.getTime()) ? undefined : d;
  }, z.date().optional()),
  endDate: z.preprocess((val) => {
    if (!val) return undefined;
    const d = new Date(val as string);
    return isNaN(d.getTime()) ? undefined : d;
  }, z.date().optional()),

  updatedAt: z.date().optional(),
});
