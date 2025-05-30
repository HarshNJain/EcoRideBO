import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  signIn: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,

  signIn: async (phoneNumber: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  },

  verifyOTP: async (phoneNumber: string, otp: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });
      
      if (error) throw error;
      
      if (data.session) {
        await SecureStore.setItemAsync('session', JSON.stringify(data.session));
        set({ session: data.session });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      await SecureStore.deleteItemAsync('session');
      set({ session: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  refreshSession: async () => {
    try {
      set({ isLoading: true });
      
      const storedSession = await SecureStore.getItemAsync('session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession({
          refresh_token: session.refresh_token,
        });
        
        if (error) throw error;
        
        if (refreshedSession) {
          await SecureStore.setItemAsync('session', JSON.stringify(refreshedSession));
          set({ session: refreshedSession });
        }
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      await SecureStore.deleteItemAsync('session');
      set({ session: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));