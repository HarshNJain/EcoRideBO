import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { User, CreditCard, MapPin, Settings, ChevronRight, LogOut, Bell, CircleHelp as HelpCircle, Users, Gift } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/constants/Colors';

// Mock user data
const userData = {
  name: 'Aditya Sharma',
  phone: '+91 98765 43210',
  email: 'aditya.sharma@example.com',
  profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  subscription: {
    active: true,
    plan: 'Eco Bike Monthly',
    expiresOn: '15 Jul 2025',
    remainingKm: 68,
  },
  savedAddresses: [
    { id: '1', name: 'Home', address: '123 Green Valley Apartments, Koramangala, Bengaluru' },
    { id: '2', name: 'Work', address: 'Tech Park, Whitefield, Bengaluru' },
  ],
  paymentMethods: [
    { id: '1', type: 'upi', name: 'Google Pay', isDefault: true },
    { id: '2', type: 'card', name: 'HDFC Credit Card', lastFourDigits: '4567' },
  ],
  referralCode: 'ADITY4R21',
  referralCredits: 15, // km
};

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  
  const handleSignOut = () => {
    signOut();
    router.replace('/onboarding');
  };
  
  const handleSubscription = () => {
    router.push('/subscription');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: userData.profileImage }}
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profilePhone}>{userData.phone}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        {userData.subscription.active && (
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTitle}>Current Subscription</Text>
              <TouchableOpacity onPress={handleSubscription}>
                <Text style={styles.viewDetailsText}>View Plans</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.subscriptionDetails}>
              <Text style={styles.subscriptionPlan}>{userData.subscription.plan}</Text>
              <Text style={styles.subscriptionExpiry}>
                Expires on {userData.subscription.expiresOn}
              </Text>
              
              <View style={styles.kmRemainingContainer}>
                <Text style={styles.kmRemainingLabel}>Remaining kilometers</Text>
                <View style={styles.kmProgressBar}>
                  <View
                    style={[
                      styles.kmProgressFill,
                      { width: `${(userData.subscription.remainingKm / 100) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.kmRemainingValue}>
                  {userData.subscription.remainingKm} km left
                </Text>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          
          {userData.savedAddresses.map((address) => (
            <TouchableOpacity key={address.id} style={styles.sectionItem}>
              <View style={styles.sectionItemIconContainer}>
                <MapPin size={20} color={colors.primary} />
              </View>
              
              <View style={styles.sectionItemContent}>
                <Text style={styles.sectionItemTitle}>{address.name}</Text>
                <Text style={styles.sectionItemSubtitle} numberOfLines={1}>
                  {address.address}
                </Text>
              </View>
              
              <ChevronRight size={20} color="#BDBDBD" />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          {userData.paymentMethods.map((method) => (
            <TouchableOpacity key={method.id} style={styles.sectionItem}>
              <View style={styles.sectionItemIconContainer}>
                <CreditCard size={20} color={colors.primary} />
              </View>
              
              <View style={styles.sectionItemContent}>
                <Text style={styles.sectionItemTitle}>
                  {method.name}
                  {method.isDefault && <Text style={styles.defaultLabel}> (Default)</Text>}
                </Text>
                {method.lastFourDigits && (
                  <Text style={styles.sectionItemSubtitle}>
                    **** **** **** {method.lastFourDigits}
                  </Text>
                )}
              </View>
              
              <ChevronRight size={20} color="#BDBDBD" />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Refer & Earn</Text>
          
          <View style={styles.referralContainer}>
            <View style={styles.referralInfo}>
              <Text style={styles.referralDescription}>
                Share your code with friends and get 5km free ride credits for each successful referral
              </Text>
              
              <View style={styles.referralCodeContainer}>
                <Text style={styles.referralCodeLabel}>Your Code:</Text>
                <View style={styles.referralCode}>
                  <Text style={styles.referralCodeText}>{userData.referralCode}</Text>
                </View>
                <TouchableOpacity style={styles.referralCopyButton}>
                  <Text style={styles.referralCopyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.referralCreditsContainer}>
              <Gift size={24} color={colors.accent} />
              <Text style={styles.referralCreditsValue}>{userData.referralCredits} km</Text>
              <Text style={styles.referralCreditsLabel}>Credits</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.shareButton}>
            <Users size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.shareButtonText}>Invite Friends</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.sectionItemIconContainer}>
                <Bell size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingsItemText}>Push Notifications</Text>
            </View>
            
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
              thumbColor={notificationsEnabled ? colors.primary : '#BDBDBD'}
            />
          </View>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.sectionItemIconContainer}>
                <MapPin size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingsItemText}>Location Services</Text>
            </View>
            
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
              thumbColor={locationEnabled ? colors.primary : '#BDBDBD'}
            />
          </View>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.sectionItemIconContainer}>
                <HelpCircle size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingsItemText}>Help & Support</Text>
            </View>
            
            <ChevronRight size={20} color="#BDBDBD" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={styles.sectionItemIconContainer}>
                <Settings size={20} color={colors.primary} />
              </View>
              <Text style={styles.settingsItemText}>App Settings</Text>
            </View>
            
            <ChevronRight size={20} color="#BDBDBD" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleSignOut}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  editButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#757575',
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  subscriptionDetails: {},
  subscriptionPlan: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 4,
  },
  subscriptionExpiry: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 16,
  },
  kmRemainingContainer: {
    marginTop: 8,
  },
  kmRemainingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 8,
  },
  kmProgressBar: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginBottom: 8,
  },
  kmProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  kmRemainingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 16,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionItemContent: {
    flex: 1,
  },
  sectionItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  sectionItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  defaultLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.primary,
  },
  addButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  referralContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  referralInfo: {
    flex: 3,
  },
  referralDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 16,
    lineHeight: 20,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referralCodeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginRight: 8,
  },
  referralCode: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  referralCodeText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  referralCopyButton: {
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  referralCopyButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  referralCreditsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 8,
    marginLeft: 16,
  },
  referralCreditsValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.accent,
    marginTop: 4,
  },
  referralCreditsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.accent,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212121',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.error,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
});