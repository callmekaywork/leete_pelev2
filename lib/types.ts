export interface LocationPoint {
  lat: number;
  lng: number;
  address: string;
  name?: string;
}

export type RideStatus =
  | 'idle'
  | 'searching'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'in_progress'
  | 'arrived'
  | 'no_driver_available';

export interface DriverInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalTrips: number;
  carModel: string;
  carColor: string;
  plateNumber: string;
  phone: string;
  currentPos: [number, number];
  capacity: number; // Total seat capacity
  occupiedSeats: number; // Currently occupied seats
}

export interface RideDetails {
  id: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  seatsBooked: number;
  bookingDate: string; // YYYY-MM-DD
  distanceKm: number;
  durationMinutes: number;
  status: RideStatus;
  driver: DriverInfo | null;
  createdAt: Date;
  routeCoordinates: [number, number][];
  passengerName?: string;
  passengerPhone?: string;
  notes?: string;
}

export interface BookingRecord {
  id: string;
  driverId: string;
  driverName: string;
  carModel: string;
  plateNumber: string;
  bookingDate: string; // YYYY-MM-DD
  passengerName: string;
  passengerPhone: string;
  notes?: string;
  seatsBooked: number;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  createdAt: string;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}
