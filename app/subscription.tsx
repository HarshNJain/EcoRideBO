import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ChevronRight, CircleCheck as CheckCircle, Bike, Car, Info } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

const subscriptionPlans = [
  {
    id: '1',
    type: 'bike',
    name: 'Eco Bike Daily',
    price: 49,
    period: 'day',
    distance: 10,
    unlimited: false,
    features: [
      '10km included',
      'Unlimited rides',
      'Available in select cities',
      'No surge pricing',
    ],
  },
  {
    id: '2',
    type: 'bike',
    name: 'Eco Bike Weekly',
    price: 249,
    period: 'week',
    distance: 50,
    unlimited: false,
    features: [
      '50km included',
      'Unlimited rides',
      'Available in all cities',
      'No surge pricing',
      'Priority booking',
    ],
  },
  {
    id: '3',
    type: 'bike',
    name: 'Eco Bike Monthly',
    price: 499,
    period: 'month',
    distance: 100,
    unlimited: true,
    features: [
      '100km included',
      'Unlimited rides',
      'Available in all cities',
      'No surge pricing',
      'Priority booking',
      'Dedicated customer support',
    ],
    popular: true,
  },
  {
    id: '4',
    type: 'car',
    name: 'Eco Car Daily',
    price: 149,
    period: 'day',
    distance: 20,
    unlimited: false,
    features: [
      '20km included',
      'Unlimited rides',
      'Available in select cities',
      'No surge pricing',
    ],
  },
  {
    id: '5',
    type: 'car',
    name: 'Eco Car Weekly',
    price: 749,
    period: 'week',
    distance: 70,
    unlimited: false,
    features: [
      '70km included',
      'Unlimited rides',
      'Available in all cities',
      'No surge pricing',
      'Priority booking',
    ],
  },
  {
    id: '6',
    type: 'car',
    name: 'Eco Car Monthly',
    price: 1499,
    period: 'month',
    distance: 100,
    unlimited: true,
    features: [
      '100km included',
      'Unlimited rides',
      'Available in all cities',
      'No surge pricing',
      'Priority booking',
      'Dedicated customer support',
    ],
    popular: true,
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState('3');
  const [vehicleType, setVehicleType] = useState('bike');
  const [autoRenew, setAutoRenew] = useState(true);

  const toggleVehicleType = () => {
    const newType = vehicleType === 'bike' ? 'car' : 'bike';
    setVehicleType(newType);
    
    // Select the first plan of the new vehicle type
    const firstPlanOfType = subscriptionPlans.find(plan => plan.type === newType);
    if (firstPlanOfType) {
      setSelectedPlanId(firstPlanOfType.id);
    }
  };

  const filteredPlans = subscriptionPlans.filter(plan => plan.type === vehicleType);
  const selectedPlan = subscriptionPlans.find(plan => plan.id === selectedPlanId);

  const handleSubscribe = () => {
    // Simulate successful subscription
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 500);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.vehicleToggleContainer}>
        <TouchableOpacity
          style={[
            styles.vehicleOption,
            vehicleType === 'bike' && styles.vehicleOptionActive,
          ]}
          onPress={() => setVehicleType('bike')}
        >
          <Bike
            size={24}
            color={vehicleType === 'bike' ? colors.primary : '#757575'}
          />
          <Text
            style={[
              styles.vehicleOptionText,
              vehicleType === 'bike' && styles.vehicleOptionTextActive,
            ]}
          >
            Bike Plans
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.vehicleOption,
            vehicleType === 'car' && styles.vehicleOptionActive,
          ]}
          onPress={() => setVehicleType('car')}
        >
          <Car
            size={24}
            color={vehicleType === 'car' ? colors.primary : '#757575'}
          />
          <Text
            style={[
              styles.vehicleOptionText,
              vehicleType === 'car' && styles.vehicleOptionTextActive,
            ]}
          >
            Car Plans
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.plansList} showsVerticalScrollIndicator={false}>
        {filteredPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlanId === plan.id && styles.planCardSelected,
              plan.popular && styles.popularPlan,
            ]}
            onPress={() => setSelectedPlanId(plan.id)}
          >
            {plan.popular && (
              <View style={styles.popularTag}>
                <Text style={styles.popularTagText}>POPULAR</Text>
              </View>
            )}
            
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currency}>₹</Text>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.period}>/{plan.period}</Text>
              </View>
            </View>
            
            <View style={styles.planDetails}>
              <View style={styles.distanceIndicator}>
                <View style={styles.distanceBar}>
                  <View
                    style={[
                      styles.distanceFill,
                      { width: plan.unlimited ? '100%' : '60%' },
                    ]}
                  />
                </View>
                <Text style={styles.distanceText}>
                  {plan.distance}km included{plan.unlimited ? ' (Unlimited rides)' : ''}
                </Text>
              </View>
              
              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <CheckCircle size={16} color={colors.primary} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {selectedPlanId === plan.id && (
              <View style={styles.selectedIndicator}>
                <CheckCircle size={20} color={colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.subscriptionFooter}>
        <View style={styles.autoRenewContainer}>
          <Text style={styles.autoRenewText}>Auto-renew subscription</Text>
          <Switch
            value={autoRenew}
            onValueChange={setAutoRenew}
            trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
            thumbColor={autoRenew ? colors.primary : '#BDBDBD'}
          />
        </View>
        
        <View style={styles.savingsContainer}>
          <Info size={16} color={colors.secondary} />
          <Text style={styles.savingsText}>
            Save up to ₹{vehicleType === 'bike' ? '600' : '1800'} annually with this plan
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeButtonText}>
            Subscribe for ₹{selectedPlan?.price || 499}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  vehicleToggleContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  vehicleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
  },
  vehicleOptionActive: {
    backgroundColor: '#E8F5E9',
  },
  vehicleOptionText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#757575',
  },
  vehicleOptionTextActive: {
    color: colors.primary,
  },
  plansList: {
    flex: 1,
    padding: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  popularPlan: {
    borderColor: colors.accent,
  },
  popularTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  period: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 4,
    marginLeft: 2,
  },
  planDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  distanceIndicator: {
    marginBottom: 16,
  },
  distanceBar: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginBottom: 8,
  },
  distanceFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#212121',
    marginLeft: 8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  subscriptionFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 16,
  },
  autoRenewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  autoRenewText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  savingsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.secondary,
    marginLeft: 8,
  },
  subscribeButton: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginRight: 8,
  },
});