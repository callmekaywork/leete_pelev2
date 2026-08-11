import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  numeric,
  primaryKey,
  foreignKey,
  unique,
  check,
  boolean,
  uuid,
  json,
  date,
  jsonb,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import type { AdapterAccountType } from 'next-auth/adapters';
import { relations, sql } from 'drizzle-orm';

const id = nanoid(50);

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => id)
    .unique(),
  firstname: text('firstname'),
  lastname: text('lastname'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role')
    .$type<'admin' | 'staff' | 'user' | 'driver'>()
    .notNull()
    .default('staff'),
  image: text('image'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  account => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  verificationToken => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ],
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  authenticator => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ],
);

export const drivers = pgTable('drivers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => id)
    .unique(),

  // Link to base user record
  userId: varchar('user_id', { length: 50 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Personal info (beyond users table)
  phone: varchar('phone', { length: 20 }).notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  address: text('address').notNull(),

  // Background check
  nationalIdOrSSN: varchar('national_id_or_ssn', { length: 50 }).notNull(),
  driverLicenseNumber: varchar('driver_license_number', {
    length: 50,
  }).notNull(),
  licenseExpiryDate: date('license_expiry_date').notNull(),
  drivingExperienceYears: integer('driving_experience_years').notNull(),
  hasCriminalRecord: boolean('has_criminal_record').notNull(),
  criminalRecordExplanation: text('criminal_record_explanation'),
  consentBackgroundCheck: boolean('consent_background_check').notNull(),
  consentTerms: boolean('consent_terms').notNull(),
  signatureName: varchar('signature_name', { length: 100 }).notNull(),

  // Vehicle info
  vehicleCategory: varchar('vehicle_category', { length: 50 }).notNull(),
  make: varchar('make', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  year: integer('year').notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  licensePlate: varchar('license_plate', { length: 20 }).notNull(),
  seatsCount: integer('seats_count').notNull(),
  fuelType: varchar('fuel_type', { length: 50 }).notNull(),

  // Documents (store as URLs or file references)
  licenseFront: text('license_front').notNull(),
  licenseBack: text('license_back').notNull(),
  vehicleRegistration: text('vehicle_registration').notNull(),
  vehicleInsurance: text('vehicle_insurance').notNull(),
  vehicleInspection: text('vehicle_inspection').notNull(),
  profilePhoto: text('profile_photo').notNull(),

  // Operational metadata
  avatar: text('avatar'),
  rating: numeric('rating', { precision: 4, scale: 2 }).default('0'),
  totalTrips: integer('total_trips').default(0),
  currentPos: jsonb('current_pos').$type<[number, number]>(),
  capacity: integer('capacity').default(4),
  occupiedSeats: integer('occupied_seats').default(0),
});

export const driversRelations = relations(drivers, ({ one, many }) => ({
  user: one(users, {
    fields: [drivers.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

// Bookings table
export const bookings = pgTable('bookings', {
  id: varchar('id', { length: 50 }).primaryKey(),
  // Link to base user record
  driverId: varchar('driverId', { length: 50 })
    .notNull()
    .references(() => drivers.id, { onDelete: 'cascade' }),

  driverName: text('driver_name').notNull(),
  carModel: text('car_model').notNull(),
  plateNumber: varchar('plate_number', { length: 20 }).notNull(),
  bookingDate: varchar('booking_date', { length: 20 }).notNull(), // ISO string
  passengerName: text('passenger_name').notNull(),
  passengerPhone: varchar('passenger_phone', { length: 20 }).notNull(),
  notes: text('notes'),
  seatsBooked: integer('seats_booked').notNull(),
  pickup: text('pickup').notNull(),
  dropoff: text('dropoff').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull(),
  status: varchar('status', { length: 20 }).notNull(), // e.g., confirmed, pending, cancelled
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  driver: one(drivers, {
    fields: [bookings.driverId],
    references: [drivers.id],
  }),
}));
