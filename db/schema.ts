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
  id: text('uID')
    .primaryKey()
    .$defaultFn(() => id)
    .unique(),
  firstname: text('firstname'),
  lastname: text('lastname'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role')
    .$type<'admin' | 'staff' | 'user'>()
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

// Drivers table
export const drivers = pgTable('drivers', {
  id: varchar('id', { length: 50 }).primaryKey(),
  userId: varchar('user_id', { length: 50 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }), // FK to users table
  avatar: text('avatar').notNull(),
  rating: numeric('rating', { precision: 4, scale: 2 }).notNull(),
  totalTrips: integer('total_trips').notNull(),
  carModel: text('car_model').notNull(),
  carColor: text('car_color').notNull(),
  plateNumber: varchar('plate_number', { length: 20 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  currentPos: jsonb('current_pos').$type<[number, number]>(),
  capacity: integer('capacity').notNull(),
  occupiedSeats: integer('occupied_seats').notNull(),
});

// Relations
export const driversRelations = relations(drivers, ({ one }) => ({
  user: one(users, {
    fields: [drivers.userId],
    references: [users.id],
  }),
}));

// Bookings table
export const bookings = pgTable('bookings', {
  id: varchar('id', { length: 50 }).primaryKey(),
  driverId: varchar('driver_id', { length: 50 }).notNull(),
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
