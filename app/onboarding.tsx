import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Check } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to Eco Ride',
    description: 'Join India\'s first all-electric ride-hailing platform. Eco-friendly rides at your fingertips.',
    image: 'https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    title: 'Choose Green Transport',
    description: 'Book electric cars and bikes that reduce your carbon footprint with every ride.',
    image: 'https://images.pexels.com/photos/2019693/pexels-photo-2019693.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    title: 'Track Your Impact',
    description: 'See how much CO2 you\'ve saved by choosing Eco Ride over conventional vehicles.',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '4',
    title: 'Save with Subscriptions',
    description: 'Subscribe to our plans and enjoy unlimited rides with special pricing and benefits.',
    image: 'https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const scrollTo = (index) => {
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index });
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollTo(currentIndex + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <FlatList
        data={slides}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      
      <View style={styles.bottomContainer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 20, 8],
              extrapolate: 'clamp',
            });
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            
            return (
              <Animated.View
                key={index.toString()}
                style={[
                  styles.indicator,
                  { width: dotWidth, opacity },
                ]}
              />
            );
          })}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            {currentIndex === slides.length - 1 ? (
              <>
                <Text style={styles.nextButtonText}>Get Started</Text>
                <Check size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </>
            ) : (
              <>
                <Text style={styles.nextButtonText}>Next</Text>
                <ArrowRight size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    height,
    justifyContent: 'flex-end',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  textContainer: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#757575',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});