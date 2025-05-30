import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  phoneNumber: string;
  token?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (userData: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from AsyncStorage on startup
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (userData: User) => {
    try {
      // In a real app, you would validate the user's credentials with your backend
      // and get a token back
      
      // For demo purposes, we'll just store the user data
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to sign in', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear user data from state and storage
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};