export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone_number: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone_number?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone_number?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      rides: {
        Row: {
          id: string;
          user_id: string;
          driver_id: string | null;
          pickup_location: { lat: number; lng: number; address: string };
          destination_location: { lat: number; lng: number; address: string };
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          vehicle_type: 'car' | 'bike';
          distance: number;
          fare: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          driver_id?: string | null;
          pickup_location: { lat: number; lng: number; address: string };
          destination_location: { lat: number; lng: number; address: string };
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          vehicle_type: 'car' | 'bike';
          distance: number;
          fare: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          driver_id?: string | null;
          updated_at?: string;
        };
      };
      drivers: {
        Row: {
          id: string;
          user_id: string;
          vehicle_type: 'car' | 'bike';
          vehicle_model: string;
          vehicle_color: string;
          license_plate: string;
          current_location: { lat: number; lng: number };
          is_active: boolean;
          rating: number;
          total_rides: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_type: 'car' | 'bike';
          vehicle_model: string;
          vehicle_color: string;
          license_plate: string;
          current_location: { lat: number; lng: number };
          is_active?: boolean;
          rating?: number;
          total_rides?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          current_location?: { lat: number; lng: number };
          is_active?: boolean;
          rating?: number;
          total_rides?: number;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: 'daily' | 'weekly' | 'monthly';
          vehicle_type: 'car' | 'bike';
          distance_included: number;
          distance_used: number;
          start_date: string;
          end_date: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type: 'daily' | 'weekly' | 'monthly';
          vehicle_type: 'car' | 'bike';
          distance_included: number;
          distance_used?: number;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          distance_used?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}