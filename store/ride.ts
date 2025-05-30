import { create } from 'zustand';
import { db } from '@/lib/supabase';
import { Database } from '@/types/database.types';

type RideStatus = Database['public']['Tables']['rides']['Row']['status'];
type Driver = Database['public']['Tables']['drivers']['Row'];
type Location = { latitude: number; longitude: number; address: string };

interface RideState {
  currentRide: Database['public']['Tables']['rides']['Row'] | null;
  nearbyDrivers: Driver[];
  pickupLocation: Location | null;
  destinationLocation: Location | null;
  estimatedFare: number | null;
  isLoading: boolean;
  error: string | null;
  
  setPickupLocation: (location: Location) => void;
  setDestinationLocation: (location: Location) => void;
  getNearbyDrivers: (vehicleType: 'car' | 'bike') => Promise<void>;
  estimateFare: (vehicleType: 'car' | 'bike') => Promise<void>;
  bookRide: (vehicleType: 'car' | 'bike') => Promise<void>;
  updateRideStatus: (status: RideStatus) => Promise<void>;
  cancelRide: () => Promise<void>;
  clearRide: () => void;
}

export const useRideStore = create<RideState>((set, get) => ({
  currentRide: null,
  nearbyDrivers: [],
  pickupLocation: null,
  destinationLocation: null,
  estimatedFare: null,
  isLoading: false,
  error: null,

  setPickupLocation: (location) => {
    set({ pickupLocation: location });
  },

  setDestinationLocation: (location) => {
    set({ destinationLocation: location });
  },

  getNearbyDrivers: async (vehicleType) => {
    const { pickupLocation } = get();
    if (!pickupLocation) return;

    try {
      set({ isLoading: true });
      const drivers = await db.drivers.getNearbyDrivers(
        pickupLocation.latitude,
        pickupLocation.longitude,
        vehicleType
      );
      set({ nearbyDrivers: drivers, error: null });
    } catch (error) {
      console.error('Error fetching nearby drivers:', error);
      set({ error: 'Failed to fetch nearby drivers' });
    } finally {
      set({ isLoading: false });
    }
  },

  estimateFare: async (vehicleType) => {
    const { pickupLocation, destinationLocation } = get();
    if (!pickupLocation || !destinationLocation) return;

    try {
      set({ isLoading: true });
      // Calculate distance and fare based on vehicle type
      const baseRate = vehicleType === 'car' ? 30 : 15;
      const perKmRate = vehicleType === 'car' ? 15 : 6;
      
      // Use Google Maps API to get accurate distance
      // This is a simplified calculation for now
      const distance = calculateDistance(
        pickupLocation.latitude,
        pickupLocation.longitude,
        destinationLocation.latitude,
        destinationLocation.longitude
      );
      
      const fare = baseRate + (distance * perKmRate);
      set({ estimatedFare: Math.round(fare), error: null });
    } catch (error) {
      console.error('Error estimating fare:', error);
      set({ error: 'Failed to estimate fare' });
    } finally {
      set({ isLoading: false });
    }
  },

  bookRide: async (vehicleType) => {
    const { pickupLocation, destinationLocation, estimatedFare } = get();
    if (!pickupLocation || !destinationLocation || !estimatedFare) return;

    try {
      set({ isLoading: true });
      const ride = await db.rides.create({
        pickup_location: {
          lat: pickupLocation.latitude,
          lng: pickupLocation.longitude,
          address: pickupLocation.address,
        },
        destination_location: {
          lat: destinationLocation.latitude,
          lng: destinationLocation.longitude,
          address: destinationLocation.address,
        },
        vehicle_type: vehicleType,
        status: 'pending',
        fare: estimatedFare,
        distance: calculateDistance(
          pickupLocation.latitude,
          pickupLocation.longitude,
          destinationLocation.latitude,
          destinationLocation.longitude
        ),
      });
      
      set({ currentRide: ride, error: null });
    } catch (error) {
      console.error('Error booking ride:', error);
      set({ error: 'Failed to book ride' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateRideStatus: async (status) => {
    const { currentRide } = get();
    if (!currentRide) return;

    try {
      set({ isLoading: true });
      const updatedRide = await db.rides.updateStatus(currentRide.id, status);
      set({ currentRide: updatedRide, error: null });
    } catch (error) {
      console.error('Error updating ride status:', error);
      set({ error: 'Failed to update ride status' });
    } finally {
      set({ isLoading: false });
    }
  },

  cancelRide: async () => {
    const { currentRide } = get();
    if (!currentRide) return;

    try {
      set({ isLoading: true });
      await db.rides.updateStatus(currentRide.id, 'cancelled');
      set({ currentRide: null, error: null });
    } catch (error) {
      console.error('Error cancelling ride:', error);
      set({ error: 'Failed to cancel ride' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearRide: () => {
    set({
      currentRide: null,
      pickupLocation: null,
      destinationLocation: null,
      estimatedFare: null,
      error: null,
    });
  },
}));

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}