import { Tabs } from 'expo-router';
import { Chrome as Home, User, Calendar, MessageCircle, Leaf } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#757575' : '#9E9E9E',
        tabBarStyle: { 
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#333333' : '#E0E0E0',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: 'My Rides',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="eco-impact"
        options={{
          title: 'Eco Impact',
          tabBarIcon: ({ color, size }) => <Leaf size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}