import { db } from '@/db';
import { bookings, drivers, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  // 1. Create two users
  const user1 = await db
    .insert(users)
    .values({
      firstname: 'Alice',
      lastname: 'Driver',
      email: 'alice@example.com',
      password: 'hashedpassword1',
      role: 'driver',
    })
    .returning();

  const [user2] = await db
    .insert(users)
    .values({
      firstname: 'Bob',
      lastname: 'Driver',
      email: 'bob@example.com',
      password: 'hashedpassword2',
      role: 'driver',
    })
    .returning();

  // 2. Create two drivers linked to those users
  const [driver1] = await db
    .insert(drivers)
    .values({
      id: 'driver_1',
      userId: '2121121',
      phone: '1234567890',
      dateOfBirth: new Date('1990-01-01'),
      city: 'Cape Town',
      address: '123 Main Street',
      nationalIdOrSSN: 'ID12345',
      driverLicenseNumber: 'DL12345',
      licenseExpiryDate: new Date('2030-01-01'),
      drivingExperienceYears: 10,
      hasCriminalRecord: false,
      consentBackgroundCheck: true,
      consentTerms: true,
      signatureName: 'Alice Driver',
      vehicleCategory: 'Sedan',
      make: 'Toyota',
      model: 'Corolla',
      year: 2018,
      color: 'Blue',
      licensePlate: 'CA123456',
      seatsCount: 4,
      fuelType: 'Petrol',
      licenseFront: '/docs/alice/license-front.png',
      licenseBack: '/docs/alice/license-back.png',
      vehicleRegistration: '/docs/alice/registration.png',
      vehicleInsurance: '/docs/alice/insurance.png',
      vehicleInspection: '/docs/alice/inspection.png',
      profilePhoto: '/docs/alice/profile.png',
      avatar: '/avatars/alice.png',
    })
    .returning();

  const [driver2] = await db
    .insert(drivers)
    .values({
      id: 'driver_2',
      userId: user2.id,
      phone: '9876543210',
      dateOfBirth: new Date('1985-05-05'),
      city: 'Johannesburg',
      address: '456 Side Street',
      nationalIdOrSSN: 'ID67890',
      driverLicenseNumber: 'DL67890',
      licenseExpiryDate: new Date('2032-05-05'),
      drivingExperienceYears: 15,
      hasCriminalRecord: false,
      consentBackgroundCheck: true,
      consentTerms: true,
      signatureName: 'Bob Driver',
      vehicleCategory: 'SUV',
      make: 'Ford',
      model: 'Everest',
      year: 2020,
      color: 'Black',
      licensePlate: 'JHB987654',
      seatsCount: 7,
      fuelType: 'Diesel',
      licenseFront: '/docs/bob/license-front.png',
      licenseBack: '/docs/bob/license-back.png',
      vehicleRegistration: '/docs/bob/registration.png',
      vehicleInsurance: '/docs/bob/insurance.png',
      vehicleInspection: '/docs/bob/inspection.png',
      profilePhoto: '/docs/bob/profile.png',
      avatar: '/avatars/bob.png',
    })
    .returning();

  // 3. Create bookings for each driver
  await db.insert(bookings).values([
    {
      id: 'booking_1',
      driverId: driver1.id,
      driverName: 'Alice Driver',
      carModel: 'Toyota Corolla',
      plateNumber: 'CA123456',
      bookingDate: new Date().toISOString(),
      passengerName: 'Charlie Passenger',
      passengerPhone: '555111222',
      notes: 'Pickup at airport',
      seatsBooked: 2,
      pickup: 'Cape Town Airport',
      dropoff: 'City Center',
      createdAt: new Date(),
      status: 'confirmed',
    },
    {
      id: 'booking_2',
      driverId: driver2.id,
      driverName: 'Bob Driver',
      carModel: 'Ford Everest',
      plateNumber: 'JHB987654',
      bookingDate: new Date().toISOString(),
      passengerName: 'Dana Passenger',
      passengerPhone: '555333444',
      notes: 'Evening ride',
      seatsBooked: 3,
      pickup: 'Sandton',
      dropoff: 'OR Tambo Airport',
      createdAt: new Date(),
      status: 'pending',
    },
  ]);

  console.log('Seed complete: 2 users, 2 drivers, 2 bookings.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
