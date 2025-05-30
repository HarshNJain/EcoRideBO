// Mock data for the app

// Mock nearby vehicles
export const mockVehicles = [
  {
    id: 'car-1',
    type: 'car',
    model: 'Tata Nexon EV',
    latitude: 12.9715,
    longitude: 77.5945,
    minutesAway: 3,
  },
  {
    id: 'car-2',
    type: 'car',
    model: 'Mahindra XUV400',
    latitude: 12.9725,
    longitude: 77.5935,
    minutesAway: 5,
  },
  {
    id: 'car-3',
    type: 'car',
    model: 'MG ZS EV',
    latitude: 12.9735,
    longitude: 77.5955,
    minutesAway: 4,
  },
  {
    id: 'bike-1',
    type: 'bike',
    model: 'Ather 450X',
    latitude: 12.9720,
    longitude: 77.5940,
    minutesAway: 2,
  },
  {
    id: 'bike-2',
    type: 'bike',
    model: 'Ola S1 Pro',
    latitude: 12.9710,
    longitude: 77.5950,
    minutesAway: 3,
  },
  {
    id: 'bike-3',
    type: 'bike',
    model: 'TVS iQube',
    latitude: 12.9700,
    longitude: 77.5960,
    minutesAway: 4,
  },
];

// Mock ride details for the ride screen
export const getRideDetails = async (id: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data based on id
  return {
    id: id || 'new',
    pickup: {
      address: '123 Green Valley Apartments, Koramangala',
      latitude: 12.9715,
      longitude: 77.5945,
    },
    destination: {
      address: 'Tech Park, Whitefield',
      latitude: 12.9815,
      longitude: 77.6145,
    },
    distance: 15.3,
    duration: 32, // minutes
    fare: 180,
    baseFare: 30,
    perKmRate: 15,
    status: 'searching', // searching, assigned, arriving, started, completed, cancelled
    vehicleType: 'car',
    driver: null, // Will be populated once driver is assigned
  };
};

// Mock ride status update
export const updateRideStatus = async (id: string, status: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return success response
  return {
    success: true,
    message: `Ride status updated to ${status}`,
  };
};