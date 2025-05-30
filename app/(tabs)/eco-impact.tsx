import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Leaf, Calendar, TrendingUp, TreePine } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Mock data for eco impact
const ecoImpactData = {
  totalCO2Saved: 28.5, // in kg
  totalRides: 17,
  totalDistance: 237, // in km
  treesEquivalent: 1.4,
  monthlyData: [
    { month: 'Jan', co2Saved: 0 },
    { month: 'Feb', co2Saved: 0 },
    { month: 'Mar', co2Saved: 0 },
    { month: 'Apr', co2Saved: 5.2 },
    { month: 'May', co2Saved: 8.7 },
    { month: 'Jun', co2Saved: 14.6 },
    { month: 'Jul', co2Saved: 0 },
    { month: 'Aug', co2Saved: 0 },
    { month: 'Sep', co2Saved: 0 },
    { month: 'Oct', co2Saved: 0 },
    { month: 'Nov', co2Saved: 0 },
    { month: 'Dec', co2Saved: 0 },
  ],
  recentRides: [
    {
      id: '1',
      date: '12 Jun 2025',
      from: 'Home',
      to: 'Office',
      distance: 12.5,
      co2Saved: 1.5,
    },
    {
      id: '2',
      date: '10 Jun 2025',
      from: 'Office',
      to: 'Home',
      distance: 13.2,
      co2Saved: 1.58,
    },
    {
      id: '3',
      date: '8 Jun 2025',
      from: 'Home',
      to: 'Mall',
      distance: 7.8,
      co2Saved: 0.94,
    },
    {
      id: '4',
      date: '5 Jun 2025',
      from: 'Office',
      to: 'Restaurant',
      distance: 3.2,
      co2Saved: 0.38,
    },
  ],
};

const timeRanges = ['Weekly', 'Monthly', 'Yearly'];

export default function EcoImpactScreen() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('Monthly');
  
  // Find max CO2 saved to scale the chart
  const maxCO2 = Math.max(...ecoImpactData.monthlyData.map(d => d.co2Saved));
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Eco Impact</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Leaf size={32} color="#FFFFFF" />
          </View>
          
          <Text style={styles.summaryTitle}>Total CO₂ Emissions Saved</Text>
          <Text style={styles.summaryValue}>{ecoImpactData.totalCO2Saved} kg</Text>
          
          <View style={styles.summaryDetails}>
            <View style={styles.summaryDetailItem}>
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.summaryDetailText}>{ecoImpactData.totalRides} rides</Text>
            </View>
            
            <View style={styles.summaryDetailItem}>
              <TrendingUp size={16} color={colors.primary} />
              <Text style={styles.summaryDetailText}>{ecoImpactData.totalDistance} km</Text>
            </View>
            
            <View style={styles.summaryDetailItem}>
              <TreePine size={16} color={colors.primary} />
              <Text style={styles.summaryDetailText}>{ecoImpactData.treesEquivalent} trees</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>CO₂ Savings Over Time</Text>
            
            <View style={styles.timeRangeSelector}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.timeRangeButton,
                    selectedTimeRange === range && styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setSelectedTimeRange(range)}
                >
                  <Text
                    style={[
                      styles.timeRangeButtonText,
                      selectedTimeRange === range && styles.timeRangeButtonTextActive,
                    ]}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            {ecoImpactData.monthlyData.map((data, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View style={styles.chartBarLabelContainer}>
                  <Text style={styles.chartBarLabel}>{data.month}</Text>
                </View>
                
                <View style={styles.chartBar}>
                  <View
                    style={[
                      styles.chartBarFill,
                      {
                        height: maxCO2 > 0 ? (data.co2Saved / maxCO2) * 120 : 0,
                      },
                    ]}
                  />
                </View>
                
                <Text style={styles.chartBarValue}>
                  {data.co2Saved > 0 ? data.co2Saved.toFixed(1) : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.recentRidesCard}>
          <Text style={styles.recentRidesTitle}>Recent Eco Rides</Text>
          
          {ecoImpactData.recentRides.map((ride) => (
            <View key={ride.id} style={styles.rideItem}>
              <View style={styles.rideHeader}>
                <Text style={styles.rideDate}>{ride.date}</Text>
                <View style={styles.rideCO2Container}>
                  <Leaf size={14} color={colors.primary} />
                  <Text style={styles.rideCO2}>{ride.co2Saved.toFixed(2)} kg CO₂ saved</Text>
                </View>
              </View>
              
              <View style={styles.rideRoute}>
                <View style={styles.rideRoutePointContainer}>
                  <View style={styles.rideRouteStartPoint} />
                  <Text style={styles.rideRouteText}>{ride.from}</Text>
                </View>
                
                <View style={styles.rideRouteLine} />
                
                <View style={styles.rideRoutePointContainer}>
                  <View style={styles.rideRouteEndPoint} />
                  <Text style={styles.rideRouteText}>{ride.to}</Text>
                </View>
              </View>
              
              <Text style={styles.rideDistance}>{ride.distance} km</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.environmentalImpactCard}>
          <Text style={styles.environmentalImpactTitle}>Environmental Impact</Text>
          
          <Text style={styles.environmentalImpactDescription}>
            Your eco-friendly rides with Eco Ride have contributed to a greener planet! The CO₂ emissions you've saved are equivalent to:
          </Text>
          
          <View style={styles.environmentalImpactItems}>
            <View style={styles.environmentalImpactItem}>
              <View style={styles.environmentalImpactIconContainer}>
                <TreePine size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.environmentalImpactItemValue}>{ecoImpactData.treesEquivalent}</Text>
              <Text style={styles.environmentalImpactItemLabel}>Trees planted</Text>
            </View>
            
            <View style={styles.environmentalImpactItem}>
              <View style={[styles.environmentalImpactIconContainer, { backgroundColor: colors.secondary }]}>
                <Calendar size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.environmentalImpactItemValue}>{Math.round(ecoImpactData.totalCO2Saved * 3.8)}</Text>
              <Text style={styles.environmentalImpactItemLabel}>Hours of AC usage</Text>
            </View>
            
            <View style={styles.environmentalImpactItem}>
              <View style={[styles.environmentalImpactIconContainer, { backgroundColor: colors.accent }]}>
                <TrendingUp size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.environmentalImpactItemValue}>{Math.round(ecoImpactData.totalCO2Saved / 0.12)}</Text>
              <Text style={styles.environmentalImpactItemLabel}>Km in petrol car</Text>
            </View>
          </View>
        </View>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#757575',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 16,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  summaryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    marginLeft: 4,
  },
  chartCard: {
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 2,
  },
  timeRangeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeRangeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#757575',
  },
  timeRangeButtonTextActive: {
    color: '#212121',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  chartBarContainer: {
    alignItems: 'center',
    width: (width - 64) / 12, // 12 months
  },
  chartBarLabelContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  chartBarLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginTop: 4,
  },
  chartBar: {
    width: 8,
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  chartBarValue: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    position: 'absolute',
    top: 16,
  },
  recentRidesCard: {
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
  recentRidesTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 16,
  },
  rideItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
    marginBottom: 16,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rideDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  rideCO2Container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rideCO2: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
    marginLeft: 4,
  },
  rideRoute: {
    marginBottom: 12,
  },
  rideRoutePointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rideRouteStartPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  rideRouteEndPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
    marginRight: 8,
  },
  rideRouteLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
    marginBottom: 8,
  },
  rideRouteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#212121',
  },
  rideDistance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    textAlign: 'right',
  },
  environmentalImpactCard: {
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
  environmentalImpactTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 8,
  },
  environmentalImpactDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    lineHeight: 20,
    marginBottom: 16,
  },
  environmentalImpactItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  environmentalImpactItem: {
    alignItems: 'center',
    flex: 1,
  },
  environmentalImpactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  environmentalImpactItemValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 4,
  },
  environmentalImpactItemLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    textAlign: 'center',
  },
});