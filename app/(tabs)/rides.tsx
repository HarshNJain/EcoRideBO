import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Clock, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

// Mock ride history data
const ridesData = [
  {
    id: '1',
    date: '12 Jun 2025',
    time: '09:15 AM',
    from: 'Home',
    to: 'Office',
    vehicleType: 'car',
    fare: 145,
    distance: 12.5,
    duration: 28,
    status: 'completed',
  },
  {
    id: '2',
    date: '10 Jun 2025',
    time: '06:22 PM',
    from: 'Office',
    to: 'Home',
    vehicleType: 'car',
    fare: 168,
    distance: 13.2,
    duration: 35,
    status: 'completed',
  },
  {
    id: '3',
    date: '8 Jun 2025',
    time: '11:05 AM',
    from: 'Home',
    to: 'Mall',
    vehicleType: 'bike',
    fare: 54,
    distance: 7.8,
    duration: 18,
    status: 'completed',
  },
  {
    id: '4',
    date: '5 Jun 2025',
    time: '01:30 PM',
    from: 'Office',
    to: 'Restaurant',
    vehicleType: 'bike',
    fare: 29,
    distance: 3.2,
    duration: 10,
    status: 'completed',
  },
  {
    id: '5',
    date: '2 Jun 2025',
    time: '08:45 AM',
    from: 'Home',
    to: 'Office',
    vehicleType: 'car',
    fare: 140,
    distance: 12.3,
    duration: 26,
    status: 'completed',
  },
  {
    id: '6',
    date: '28 May 2025',
    time: '07:10 PM',
    from: 'Office',
    to: 'Home',
    vehicleType: 'car',
    fare: 152,
    distance: 12.7,
    duration: 30,
    status: 'completed',
  },
  {
    id: '7',
    date: '25 May 2025',
    time: '10:30 AM',
    from: 'Home',
    to: 'Gym',
    vehicleType: 'bike',
    fare: 42,
    distance: 5.1,
    duration: 15,
    status: 'cancelled',
    cancellationReason: 'Changed plans',
  },
];

// Define filter options
const filterOptions = [
  { id: 'all', label: 'All Rides' },
  { id: 'car', label: 'Car Rides' },
  { id: 'bike', label: 'Bike Rides' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function RidesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filteredRides = ridesData.filter(ride => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'car' && ride.vehicleType === 'car') return true;
    if (activeFilter === 'bike' && ride.vehicleType === 'bike') return true;
    if (activeFilter === 'cancelled' && ride.status === 'cancelled') return true;
    return false;
  });
  
  const handleRidePress = (ride) => {
    // In a real app, this would navigate to the ride details screen
    router.push(`/ride/${ride.id}`);
  };
  
  const renderRideItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.rideCard,
        item.status === 'cancelled' && styles.cancelledRideCard,
      ]}
      onPress={() => handleRidePress(item)}
    >
      <View style={styles.rideHeader}>
        <View style={styles.rideDateTime}>
          <View style={styles.rideDateContainer}>
            <Calendar size={14} color="#757575" />
            <Text style={styles.rideDate}>{item.date}</Text>
          </View>
          
          <View style={styles.rideTimeContainer}>
            <Clock size={14} color="#757575" />
            <Text style={styles.rideTime}>{item.time}</Text>
          </View>
        </View>
        
        <View style={styles.rideFareContainer}>
          <Text style={styles.rideFare}>₹{item.fare}</Text>
          <Text style={styles.rideVehicleType}>
            {item.vehicleType === 'car' ? 'Car' : 'Bike'}
          </Text>
        </View>
      </View>
      
      <View style={styles.rideRoute}>
        <View style={styles.rideRoutePointContainer}>
          <View style={styles.rideRouteStartPoint} />
          <Text style={styles.rideRouteText}>{item.from}</Text>
        </View>
        
        <View style={styles.rideRouteLine} />
        
        <View style={styles.rideRoutePointContainer}>
          <View style={styles.rideRouteEndPoint} />
          <Text style={styles.rideRouteText}>{item.to}</Text>
        </View>
      </View>
      
      <View style={styles.rideDetails}>
        <View style={styles.rideDetailItem}>
          <Text style={styles.rideDetailLabel}>Distance</Text>
          <Text style={styles.rideDetailValue}>{item.distance} km</Text>
        </View>
        
        <View style={styles.rideDetailItem}>
          <Text style={styles.rideDetailLabel}>Duration</Text>
          <Text style={styles.rideDetailValue}>{item.duration} min</Text>
        </View>
        
        <View style={styles.rideDetailItem}>
          <Text style={styles.rideDetailLabel}>Status</Text>
          <Text
            style={[
              styles.rideDetailValue,
              item.status === 'cancelled' && styles.cancelledStatus,
            ]}
          >
            {item.status === 'completed' ? 'Completed' : 'Cancelled'}
          </Text>
        </View>
      </View>
      
      {item.status === 'cancelled' && item.cancellationReason && (
        <View style={styles.cancellationReasonContainer}>
          <Text style={styles.cancellationReasonLabel}>Reason:</Text>
          <Text style={styles.cancellationReasonText}>{item.cancellationReason}</Text>
        </View>
      )}
      
      <View style={styles.rideCardFooter}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <ChevronRight size={16} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rides</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterButton,
                activeFilter === option.id && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(option.id)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === option.id && styles.filterButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {filteredRides.length > 0 ? (
        <FlatList
          data={filteredRides}
          renderItem={renderRideItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ridesList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/5864298/pexels-photo-5864298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No rides found</Text>
          <Text style={styles.emptyDescription}>
            You don't have any {activeFilter !== 'all' ? activeFilter + ' ' : ''}rides yet.
          </Text>
          <TouchableOpacity
            style={styles.bookRideButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.bookRideButtonText}>Book a Ride</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ScrollView component for filter buttons
function ScrollView({ horizontal, showsHorizontalScrollIndicator, contentContainerStyle, children }) {
  return (
    <View style={contentContainerStyle}>
      {children}
    </View>
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
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#757575',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  ridesList: {
    padding: 16,
  },
  rideCard: {
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
  cancelledRideCard: {
    backgroundColor: '#FAFAFA',
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rideDateTime: {
    flexDirection: 'row',
  },
  rideDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rideDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#757575',
    marginLeft: 4,
  },
  rideTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideTime: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#757575',
    marginLeft: 4,
  },
  rideFareContainer: {
    alignItems: 'flex-end',
  },
  rideFare: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  rideVehicleType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  rideRoute: {
    marginBottom: 16,
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
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rideDetailItem: {
    alignItems: 'center',
  },
  rideDetailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 4,
  },
  rideDetailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  cancelledStatus: {
    color: colors.error,
  },
  cancellationReasonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
  },
  cancellationReasonLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.error,
    marginRight: 4,
  },
  cancellationReasonText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.error,
    flex: 1,
  },
  rideCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewDetailsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  bookRideButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookRideButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});