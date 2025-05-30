import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, MessageCircle, Phone, CircleAlert as AlertCircle, Share2, X } from 'lucide-react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '@/constants/Colors';
import { getRideDetails, updateRideStatus } from '@/data/mockData';

const { width, height } = Dimensions.get('window');

const RIDE_STAGES = {
  FINDING_DRIVER: 'finding_driver',
  DRIVER_ASSIGNED: 'driver_assigned',
  DRIVER_ARRIVING: 'driver_arriving',
  RIDE_STARTED: 'ride_started',
  RIDE_COMPLETED: 'ride_completed',
};

export default function RideScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const mapRef = useRef(null);
  const [rideDetails, setRideDetails] = useState(null);
  const [rideStage, setRideStage] = useState(RIDE_STAGES.FINDING_DRIVER);
  const [userLocation, setUserLocation] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [elapsedDistance, setElapsedDistance] = useState(0);
  const [route, setRoute] = useState([]);
  
  const bottomSheetHeight = useRef(new Animated.Value(300)).current;
  const showCancelButton = rideStage === RIDE_STAGES.FINDING_DRIVER || rideStage === RIDE_STAGES.DRIVER_ASSIGNED;

  // First useEffect: Fetch ride details
  useEffect(() => {
    const fetchRideDetails = async () => {
      setIsLoading(true);
      try {
        const details = await getRideDetails(id);
        setRideDetails(details);
        
        if (details) {
          setUserLocation({
            latitude: details.pickup.latitude,
            longitude: details.pickup.longitude,
          });
          
          if (details.driver) {
            setDriverLocation({
              latitude: details.driver.latitude,
              longitude: details.driver.longitude,
            });
            setRideStage(RIDE_STAGES.DRIVER_ASSIGNED);
          }
          
          generateMockRoute(
            details.pickup.latitude,
            details.pickup.longitude,
            details.destination.latitude,
            details.destination.longitude
          );
        }
      } catch (error) {
        console.error('Error fetching ride details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRideDetails();
  }, [id]);

  // Second useEffect: Handle ride simulation
  useEffect(() => {
    if (!rideDetails) return; // Early return if rideDetails is not loaded

    const stageInterval = setInterval(() => {
      simulateRideProgress();
    }, 10000);
    
    const timeInterval = setInterval(() => {
      if (rideStage === RIDE_STAGES.RIDE_STARTED) {
        setElapsedTime(prev => prev + 1);
        setElapsedDistance(prev => prev + 0.1);
      }
    }, 1000);
    
    return () => {
      clearInterval(stageInterval);
      clearInterval(timeInterval);
    };
  }, [rideDetails, rideStage]); // Add rideDetails as dependency

  // Third useEffect: Handle bottom sheet animation
  useEffect(() => {
    let newHeight = 300;
    
    switch (rideStage) {
      case RIDE_STAGES.FINDING_DRIVER:
        newHeight = 200;
        break;
      case RIDE_STAGES.DRIVER_ASSIGNED:
      case RIDE_STAGES.DRIVER_ARRIVING:
        newHeight = 300;
        break;
      case RIDE_STAGES.RIDE_STARTED:
        newHeight = 250;
        break;
      case RIDE_STAGES.RIDE_COMPLETED:
        newHeight = 400;
        break;
    }
    
    Animated.timing(bottomSheetHeight, {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [rideStage]);

  const simulateRideProgress = () => {
    if (!rideDetails) return; // Add safety check
    
    switch (rideStage) {
      case RIDE_STAGES.FINDING_DRIVER:
        setRideStage(RIDE_STAGES.DRIVER_ASSIGNED);
        setRideDetails(prev => ({
          ...prev,
          driver: {
            id: 'driver-123',
            name: 'Rajesh Kumar',
            rating: 4.8,
            phone: '+91 98765 43210',
            vehicle: {
              model: 'Tata Nexon EV',
              color: 'Electric Blue',
              licensePlate: 'KA 01 AB 1234',
            },
            latitude: prev.pickup.latitude - 0.003,
            longitude: prev.pickup.longitude - 0.002,
          },
        }));
        
        setDriverLocation({
          latitude: rideDetails.pickup.latitude - 0.003,
          longitude: rideDetails.pickup.longitude - 0.002,
        });
        break;
        
      case RIDE_STAGES.DRIVER_ASSIGNED:
        setRideStage(RIDE_STAGES.DRIVER_ARRIVING);
        setDriverLocation({
          latitude: rideDetails.pickup.latitude - 0.0005,
          longitude: rideDetails.pickup.longitude - 0.0005,
        });
        break;
        
      case RIDE_STAGES.DRIVER_ARRIVING:
        setRideStage(RIDE_STAGES.RIDE_STARTED);
        setElapsedTime(0);
        setElapsedDistance(0);
        break;
        
      case RIDE_STAGES.RIDE_STARTED:
        setRideStage(RIDE_STAGES.RIDE_COMPLETED);
        setUserLocation({
          latitude: rideDetails.destination.latitude,
          longitude: rideDetails.destination.longitude,
        });
        setDriverLocation({
          latitude: rideDetails.destination.latitude,
          longitude: rideDetails.destination.longitude,
        });
        break;
    }
  };

  const generateMockRoute = (startLat, startLng, endLat, endLng) => {
    const numPoints = 10;
    const latDiff = endLat - startLat;
    const lngDiff = endLng - startLng;
    
    const routePoints = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const fraction = i / numPoints;
      const jitter = 0.0005 * (Math.random() - 0.5);
      
      routePoints.push({
        latitude: startLat + latDiff * fraction + jitter,
        longitude: startLng + lngDiff * fraction + jitter,
      });
    }
    
    setRoute(routePoints);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCancelRide = () => {
    router.back();
  };

  const handleSOS = () => {
    alert('Emergency services have been notified. Stay calm, help is on the way.');
  };

  const handleCallDriver = () => {
    alert('Calling driver: ' + rideDetails?.driver?.phone);
  };

  const handleMessageDriver = () => {
    alert('Opening chat with driver: ' + rideDetails?.driver?.name);
  };

  const handleShareRide = () => {
    alert('Sharing ride details with your contacts');
  };

  const handleRateDriver = () => {
    router.replace('/(tabs)');
  };

  if (isLoading || !rideDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading ride details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: rideDetails.pickup.latitude,
          longitude: rideDetails.pickup.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You"
            pinColor={colors.primary}
          />
        )}
        
        {driverLocation && rideStage !== RIDE_STAGES.FINDING_DRIVER && (
          <Marker
            coordinate={driverLocation}
            title={rideDetails.driver?.name || 'Driver'}
          >
            <View style={styles.driverMarker}>
              <View style={styles.driverMarkerInner}>
                <Car size={16} color="#FFFFFF" />
              </View>
            </View>
          </Marker>
        )}
        
        <Marker
          coordinate={{
            latitude: rideDetails.destination.latitude,
            longitude: rideDetails.destination.longitude,
          }}
          title="Destination"
          pinColor={colors.accent}
        />
        
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeWidth={4}
            strokeColor={colors.primary}
          />
        )}
      </MapView>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ChevronLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {showCancelButton && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelRide}
        >
          <X size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={styles.sosButton}
        onPress={handleSOS}
      >
        <AlertCircle size={20} color="#FFFFFF" />
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>
      
      <Animated.View style={[styles.bottomSheet, { height: bottomSheetHeight }]}>
        {rideStage === RIDE_STAGES.FINDING_DRIVER && (
          <View style={styles.findingDriverContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.findingDriverText}>Finding you the nearest eco driver...</Text>
            <Text style={styles.findingDriverSubtext}>This usually takes 1-3 minutes</Text>
          </View>
        )}
        
        {rideStage === RIDE_STAGES.DRIVER_ASSIGNED && (
          <View style={styles.driverAssignedContainer}>
            <Text style={styles.rideStatusText}>Driver Assigned</Text>
            
            <View style={styles.driverInfoContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
                style={styles.driverImage}
              />
              
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{rideDetails.driver.name}</Text>
                <Text style={styles.driverRating}>★ {rideDetails.driver.rating}</Text>
                <Text style={styles.vehicleInfo}>
                  {rideDetails.driver.vehicle.model} • {rideDetails.driver.vehicle.color}
                </Text>
                <Text style={styles.licensePlate}>{rideDetails.driver.vehicle.licensePlate}</Text>
              </View>
              
              <View style={styles.contactButtons}>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={handleCallDriver}
                >
                  <Phone size={20} color={colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={handleMessageDriver}
                >
                  <MessageCircle size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.etaContainer}>
              <Text style={styles.etaText}>Driver is 3 minutes away</Text>
              <TouchableOpacity
                style={styles.shareRideButton}
                onPress={handleShareRide}
              >
                <Share2 size={16} color={colors.primary} />
                <Text style={styles.shareRideText}>Share ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {rideStage === RIDE_STAGES.DRIVER_ARRIVING && (
          <View style={styles.driverArrivingContainer}>
            <Text style={styles.rideStatusText}>Driver Arriving</Text>
            
            <View style={styles.driverInfoContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
                style={styles.driverImage}
              />
              
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{rideDetails.driver.name}</Text>
                <Text style={styles.driverRating}>★ {rideDetails.driver.rating}</Text>
                <Text style={styles.vehicleInfo}>
                  {rideDetails.driver.vehicle.model} • {rideDetails.driver.vehicle.color}
                </Text>
                <Text style={styles.licensePlate}>{rideDetails.driver.vehicle.licensePlate}</Text>
              </View>
              
              <View style={styles.contactButtons}>
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={handleCallDriver}
                >
                  <Phone size={20} color={colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={handleMessageDriver}
                >
                  <MessageCircle size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.etaContainer}>
              <Text style={styles.etaText}>Driver has arrived at pickup location</Text>
              <TouchableOpacity
                style={styles.shareRideButton}
                onPress={handleShareRide}
              >
                <Share2 size={16} color={colors.primary} />
                <Text style={styles.shareRideText}>Share ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {rideStage === RIDE_STAGES.RIDE_STARTED && (
          <View style={styles.rideStartedContainer}>
            <Text style={styles.rideStatusText}>Ride in Progress</Text>
            
            <View style={styles.rideStatsContainer}>
              <View style={styles.rideStat}>
                <Text style={styles.rideStatLabel}>Time</Text>
                <Text style={styles.rideStatValue}>{formatTime(elapsedTime)}</Text>
              </View>
              
              <View style={styles.rideStat}>
                <Text style={styles.rideStatLabel}>Distance</Text>
                <Text style={styles.rideStatValue}>{elapsedDistance.toFixed(1)} km</Text>
              </View>
              
              <View style={styles.rideStat}>
                <Text style={styles.rideStatLabel}>Fare</Text>
                <Text style={styles.rideStatValue}>
                  ₹{(rideDetails.baseFare + elapsedDistance * rideDetails.perKmRate).toFixed(0)}
                </Text>
              </View>
            </View>
            
            <View style={styles.destinationInfoContainer}>
              <Text style={styles.destinationLabel}>Arriving at:</Text>
              <Text style={styles.destinationText}>{rideDetails.destination.address}</Text>
            </View>
          </View>
        )}
        
        {rideStage === RIDE_STAGES.RIDE_COMPLETED && (
          <View style={styles.rideCompletedContainer}>
            <Text style={styles.rideCompletedText}>Ride Completed</Text>
            
            <View style={styles.rideSummaryContainer}>
              <View style={styles.rideSummaryItem}>
                <Text style={styles.rideSummaryLabel}>Fare</Text>
                <Text style={styles.rideSummaryValue}>₹{rideDetails.fare}</Text>
              </View>
              
              <View style={styles.rideSummaryItem}>
                <Text style={styles.rideSummaryLabel}>Distance</Text>
                <Text style={styles.rideSummaryValue}>{rideDetails.distance} km</Text>
              </View>
              
              <View style={styles.rideSummaryItem}>
                <Text style={styles.rideSummaryLabel}>Duration</Text>
                <Text style={styles.rideSummaryValue}>{rideDetails.duration} min</Text>
              </View>
              
              <View style={styles.rideSummaryItem}>
                <Text style={styles.rideSummaryLabel}>CO₂ Saved</Text>
                <Text style={styles.rideSummaryValue}>{(rideDetails.distance * 0.12).toFixed(2)} kg</Text>
              </View>
            </View>
            
            <View style={styles.rateDriverContainer}>
              <Text style={styles.rateDriverText}>How was your ride with {rideDetails.driver.name}?</Text>
              
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} style={styles.starButton}>
                    <Text style={styles.starText}>★</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity
                style={styles.submitRatingButton}
                onPress={handleRateDriver}
              >
                <Text style={styles.submitRatingText}>Submit Rating & Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

// Mock component for Car icon
function Car({ size, color }) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: size * 0.8, height: size * 0.5, backgroundColor: color, borderRadius: size * 0.1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cancelButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  sosButton: {
    position: 'absolute',
    bottom: 320,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 1,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginLeft: 4,
  },
  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverMarkerInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    padding: 24,
  },
  findingDriverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  findingDriverText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    marginTop: 16,
    textAlign: 'center',
  },
  findingDriverSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
  driverAssignedContainer: {
    height: '100%',
  },
  rideStatusText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
  },
  driverInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverDetails: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  driverRating: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#212121',
  },
  licensePlate: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etaText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  shareRideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  shareRideText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
    marginLeft: 4,
  },
  driverArrivingContainer: {
    height: '100%',
  },
  rideStartedContainer: {
    height: '100%',
  },
  rideStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rideStat: {
    alignItems: 'center',
  },
  rideStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 4,
  },
  rideStatValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  destinationInfoContainer: {
    marginBottom: 16,
  },
  destinationLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 4,
  },
  destinationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  rideCompletedContainer: {
    height: '100%',
  },
  rideCompletedText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  rideSummaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rideSummaryItem: {
    width: '50%',
    marginBottom: 12,
  },
  rideSummaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginBottom: 4,
  },
  rideSummaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212121',
  },
  rateDriverContainer: {
    alignItems: 'center',
  },
  rateDriverText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  starButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starText: {
    fontSize: 32,
    color: colors.accent,
  },
  submitRatingButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitRatingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});