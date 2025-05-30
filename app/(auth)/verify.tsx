import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/constants/Colors';

export default function VerifyScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const { signIn } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = () => {
    if (timeLeft === 0) {
      setTimeLeft(30);
      Alert.alert('Success', 'OTP has been resent to your phone number');
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll just sign in the user
      // In a real app, you would verify the OTP with your backend
      signIn({ phoneNumber: phoneNumber || '9876543210' });
      
      // Navigate to the main app
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
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
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color="#212121" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          We've sent a 4-digit OTP to {phoneNumber || '**********'}
        </Text>
        
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
            />
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (otp.some(digit => digit === '') || isLoading) && styles.disabledButton,
          ]}
          onPress={handleVerify}
          disabled={otp.some(digit => digit === '') || isLoading}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Text>
          {!isLoading && <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>
        
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the OTP? </Text>
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={timeLeft > 0}
          >
            <Text
              style={[
                styles.resendButton,
                timeLeft > 0 && styles.resendButtonDisabled,
              ]}
            >
              {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
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
  content: {
    flex: 1,
    paddingTop: 64,
    alignItems: 'center',
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
    marginBottom: 48,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 48,
  },
  otpInput: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    textAlign: 'center',
  },
  verifyButton: {
    height: 56,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  verifyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  resendButton: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  resendButtonDisabled: {
    color: '#9E9E9E',
  },
});