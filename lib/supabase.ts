import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.SUPABASE_URL as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for common database operations
export const db = {
  // User operations
  users: {
    async getProfile(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },

    async updateProfile(userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  },

  // Ride operations
  rides: {
    async create(rideData: Database['public']['Tables']['rides']['Insert']) {
      const { data, error } = await supabase
        .from('rides')
        .insert(rideData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getRideHistory(userId: string) {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver:drivers(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },

    async getCurrentRide(userId: string) {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          *,
          driver:drivers(*)
        `)
        .eq('user_id', userId)
        .in('status', ['pending', 'accepted', 'in_progress'])
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows returned
      return data;
    },
  },

  // Subscription operations
  subscriptions: {
    async getCurrentPlan(userId: string) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },

    async subscribe(subscriptionData: Database['public']['Tables']['subscriptions']['Insert']) {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  },

  // Driver operations
  drivers: {
    async getNearbyDrivers(latitude: number, longitude: number, vehicleType: 'car' | 'bike', radius = 5000) {
      const { data, error } = await supabase.rpc('get_nearby_drivers', {
        p_latitude: latitude,
        p_longitude: longitude,
        p_radius: radius,
        p_vehicle_type: vehicleType,
      });
      
      if (error) throw error;
      return data;
    },
  },
};