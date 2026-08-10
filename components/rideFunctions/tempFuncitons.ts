import {
  getTodayDateString,
  getTomorrowDateString,
} from '@/lib/dateCalculations/dateCalc';
import { PRESET_LOCATIONS } from '@/lib/routing';
import { BookingRecord, DriverInfo } from '@/lib/types';

const STORAGE_KEY = '2112';

export function getStoredBookings(): BookingRecord[] {
  if (typeof window === 'undefined') return DEFAULT_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKINGS));
      return DEFAULT_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse local booking database', err);
    return DEFAULT_BOOKINGS;
  }
}

export function getOccupiedSeatsForDriverOnDate(
  driverId: string,
  dateStr: string,
): number {
  const bookings = getStoredBookings();
  return bookings
    .filter(
      b =>
        b.driverId === driverId &&
        b.bookingDate === dateStr &&
        b.status !== 'cancelled',
    )
    .reduce((sum, b) => sum + b.seatsBooked, 0);
}

export function getDriverRemainingSeats(
  driver: DriverInfo,
  dateStr: string,
): number {
  const occupied = getOccupiedSeatsForDriverOnDate(driver.id, dateStr);
  return Math.max(0, driver.capacity - occupied);
}

const DEFAULT_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-890123',
    driverId: 'd1', // Alexander Novak (Prius, 8-WPT-402, capacity 4)
    driverName: 'Alexander Novak',
    carModel: 'Toyota Prius Hybrid',
    plateNumber: '8-WPT-402',
    bookingDate: getTodayDateString(),
    passengerName: 'Sarah Miller',
    passengerPhone: '+1 (555) 921-4433',
    notes: '2 suitcases, heading to airport terminal',
    seatsBooked: 2,
    pickup: PRESET_LOCATIONS[0], // Central Station
    dropoff: PRESET_LOCATIONS[1], // International Airport
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'confirmed',
  },
  {
    id: 'BK-451290',
    driverId: 'd3', // Marcus Vance (Mercedes Sprinter Shuttle, SHUTTLE-777, capacity 6)
    driverName: 'Marcus Vance',
    carModel: 'Mercedes Sprinter Shuttle',
    plateNumber: 'SHUTTLE-777',
    bookingDate: getTodayDateString(),
    passengerName: 'Tech Park Team',
    passengerPhone: '+1 (555) 880-1200',
    notes: 'Conference delegates group',
    seatsBooked: 3,
    pickup: PRESET_LOCATIONS[3], // Innovation Tech Park
    dropoff: PRESET_LOCATIONS[2], // Financial District
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'confirmed',
  },
  {
    id: 'BK-339102',
    driverId: 'd3',
    driverName: 'Marcus Vance',
    carModel: 'Mercedes Sprinter Shuttle',
    plateNumber: 'SHUTTLE-777',
    bookingDate: getTodayDateString(),
    passengerName: 'David Kim',
    passengerPhone: '+1 (555) 341-9081',
    notes: 'Single passenger with carry-on',
    seatsBooked: 1,
    pickup: PRESET_LOCATIONS[0], // Central Station
    dropoff: PRESET_LOCATIONS[5], // Beachfront Promenade
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    status: 'confirmed',
  },
  {
    id: 'BK-772109',
    driverId: 'd4', // Sarah Jenkins (Passat, VW-401-SJ, capacity 4)
    driverName: 'Sarah Jenkins',
    carModel: 'Volkswagen Passat',
    plateNumber: 'VW-401-SJ',
    bookingDate: getTodayDateString(),
    passengerName: 'Jessica Wu',
    passengerPhone: '+1 (555) 671-2390',
    notes: 'Family trip with child seat',
    seatsBooked: 3,
    pickup: PRESET_LOCATIONS[4], // Grand Plaza Mall
    dropoff: PRESET_LOCATIONS[6], // University Campus
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'confirmed',
  },
  {
    id: 'BK-551029',
    driverId: 'd2', // Elena Rostova (Tesla Model 3, EV-990-BO, capacity 4)
    driverName: 'Elena Rostova',
    carModel: 'Tesla Model 3',
    plateNumber: 'EV-990-BO',
    bookingDate: getTomorrowDateString(),
    passengerName: 'Michael Chang',
    passengerPhone: '+1 (555) 443-8821',
    notes: 'Morning flight reservation',
    seatsBooked: 2,
    pickup: PRESET_LOCATIONS[2], // Financial District
    dropoff: PRESET_LOCATIONS[1], // Airport
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'confirmed',
  },
];
