import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin as MapPinIcon, Search, ChevronDown, X, Bike, Car } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { mockVehicles } from '@/data/mockData';
import { colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleType, setVehicleType] = useState('car'); // 'car' or 'bike'
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [nearbyVehicles, setNearbyVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchBoxHeight = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        // Simulate fetching nearby vehicles
        setNearbyVehicles(mockVehicles.filter(v => v.type === vehicleType));
      } catch (error) {
        setErrorMsg('Could not fetch location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [vehicleType]);

  useEffect(() => {
    // Simulated search results
    if (searchQuery.length > 2) {
      setSearchResults([
        { id: 1, name: 'Work - Tech Park', address: '123 Tech Park, Bengaluru' },
        { id: 2, name: 'Home - Apartment', address: '456 Green Valley, Bengaluru' },
        { id: 3, name: searchQuery + ' Mall', address: 'Near ' + searchQuery + ', Bengaluru' },
        { id: 4, name: searchQuery + ' Station', address: searchQuery + ' Metro Station, Bengaluru' },
      ]);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    Animated.timing(searchBoxHeight, {
      toValue: isSearchFocused ? 300 : 60,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isSearchFocused]);

  const toggleVehicleType = () => {
    setVehicleType(vehicleType === 'car' ? 'bike' : 'car');
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (searchQuery.length === 0) {
      setIsSearchFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSelectDestination = (item) => {
    setSearchQuery(item.name);
    setIsSearchFocused(false);
    router.push('/ride/new');
  };

  const handleBookRide = () => {
    if (searchQuery) {
      router.push('/ride/new');
    } else {
      setIsSearchFocused(true);
    }
  };

  const handleSubscribe = () => {
    router.push('/subscription');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Finding your location...</Text>
        </View>
      ) : (
        <>
          {location ? (
            Platform.OS !== 'web' ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
                followsUserLocation={true}
              >
                {nearbyVehicles.map((vehicle) => (
                  <Marker
                    key={vehicle.id}
                    coordinate={{
                      latitude: vehicle.latitude,
                      longitude: vehicle.longitude,
                    }}
                    title={vehicle.type === 'car' ? 'Electric Car' : 'Electric Bike'}
                    description={`${vehicle.minutesAway} min away`}
                    pinColor={vehicle.type === 'car' ? colors.secondary : colors.accent}
                  />
                ))}
              </MapView>
            ) : (
              <View style={[styles.map, styles.webMapPlaceholder]}>
                <Text style={styles.webMapText}>Map view is not available on web platform</Text>
                <Text style={styles.webMapSubtext}>Please use our mobile app for full functionality</Text>
              </View>
            )
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg || 'Unable to get location'}</Text>
            </View>
          )}
          
          <View style={styles.controlsContainer}>
            <Animated.View style={[styles.searchContainer, { height: searchBoxHeight }]}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color="#757575" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Where to?"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                    <X size={18} color="#757575" />
                  </TouchableOpacity>
                )}
              </View>
              
              {isSearchFocused && (
                <ScrollView style={styles.searchResultsContainer}>
                  {searchResults.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.searchResultItem}
                      onPress={() => handleSelectDestination(item)}
                    >
                      <MapPinIcon size={20} color={colors.primary} />
                      <View style={styles.searchResultTextContainer}>
                        <Text style={styles.searchResultTitle}>{item.name}</Text>
                        <Text style={styles.searchResultAddress}>{item.address}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </Animated.View>
            
            {!isSearchFocused && (
              <View style={styles.rideOptionsContainer}>
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
                      Bike
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
                      Car
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.fareEstimateContainer}>
                  <Text style={styles.fareEstimateLabel}>Estimated Fare</Text>
                  <Text style={styles.fareEstimateAmount}>
                    ₹{vehicleType === 'car' ? '30-45' : '15-25'}
                  </Text>
                  <Text style={styles.fareEstimateTime}>ETA: 4 mins</Text>
                </View>
                
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={handleSubscribe}
                  >
                    <Text style={styles.subscribeButtonText}>Subscribe & Save</Text>
                    <ChevronDown size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.bookButton}
                    onPress={handleBookRide}
                  >
                    <Text style={styles.bookButtonText}>
                      Book {vehicleType === 'car' ? 'Eco Car' : 'Eco Bike'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.error,
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212121',
  },
  clearButton: {
    padding: 8,
  },
  searchResultsContainer: {
    maxHeight: 240,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchResultTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#212121',
  },
  searchResultAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginTop: 2,
  },
  rideOptionsContainer: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
  },
  vehicleToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  fareEstimateContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fareEstimateLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  fareEstimateAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#212121',
    marginTop: 4,
  },
  fareEstimateTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginTop: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    flex: 1,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.5,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  webMapPlaceholder: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMapText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#212121',
    marginBottom: 8,
  },
  webMapSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
});