import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just navigate to verify screen
      router.push({
        pathname: '/(auth)/verify',
        params: { phoneNumber },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#212121" />
        </TouchableOpacity>
        
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/7516544/pexels-photo-7516544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.headerImage}
          />
          
          <Text style={styles.title}>Welcome to Eco Ride</Text>
          <Text style={styles.subtitle}>
            India's first all-electric ride-hailing platform
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Enter your phone number</Text>
          
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            
            <TextInput
              style={styles.phoneInput}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          
          <Text style={styles.disclaimer}>
            We'll send you a one-time password to verify your phone number
          </Text>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              (phoneNumber.length < 10 || isLoading) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={phoneNumber.length < 10 || isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Sending OTP...' : 'Continue'}
            </Text>
            {!isLoading && <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />}
          </TouchableOpacity>
        </View>
        
        <View style={styles.alternativeLoginContainer}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 48,
  },
  headerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countryCode: {
    height: 56,
    width: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  phoneInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212121',
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 24,
  },
  submitButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  alternativeLoginContainer: {
    marginTop: 'auto',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    paddingHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
});