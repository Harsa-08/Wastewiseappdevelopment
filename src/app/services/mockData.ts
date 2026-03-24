import { 
  User, 
  GarbageReport, 
  CleanupEvent, 
  MarketplaceItem, 
  Reward, 
  Activity,
  Notification,
  AnalyticsData
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1234567890',
    credits: 2450,
    level: 12,
    streakDays: 45,
    totalReports: 78,
    totalCleanups: 23,
    badges: [
      { id: 'b1', name: 'Eco Warrior', description: 'Complete 10 cleanups', icon: '🌟', earnedAt: '2024-01-15' },
      { id: 'b2', name: 'Report Hero', description: 'Submit 50 reports', icon: '🏆', earnedAt: '2024-02-20' },
      { id: 'b3', name: 'Green Streak', description: '30 day streak', icon: '🔥', earnedAt: '2024-03-10' }
    ],
    createdAt: '2023-11-01',
    isAdmin: false
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@wastewise.com',
    credits: 5000,
    level: 20,
    streakDays: 100,
    totalReports: 150,
    totalCleanups: 50,
    badges: [],
    createdAt: '2023-01-01',
    isAdmin: true
  }
];

// Mock Garbage Reports
export const mockReports: GarbageReport[] = [
  {
    id: 'r1',
    userId: '1',
    userName: 'Sarah Johnson',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'Central Park, New York, NY'
    },
    wasteType: 'plastic',
    description: 'Large pile of plastic bottles and bags near the pond area',
    images: [],
    status: 'reported',
    severity: 'high',
    creditsAwarded: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r2',
    userId: '1',
    userName: 'Sarah Johnson',
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: 'Times Square, New York, NY'
    },
    wasteType: 'mixed',
    description: 'Overflowing trash bins and scattered waste',
    images: [],
    status: 'in-progress',
    severity: 'medium',
    creditsAwarded: 50,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r3',
    userId: '1',
    userName: 'Sarah Johnson',
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: 'Bryant Park, New York, NY'
    },
    wasteType: 'organic',
    description: 'Food waste scattered in picnic area',
    images: [],
    status: 'cleaned',
    severity: 'low',
    creditsAwarded: 100,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    cleanedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r4',
    userId: '2',
    userName: 'Mike Chen',
    location: {
      lat: 40.7580,
      lng: -73.9855,
      address: '7th Avenue, New York, NY'
    },
    wasteType: 'hazardous',
    description: 'Discarded batteries and electronic waste',
    images: [],
    status: 'verified',
    severity: 'critical',
    creditsAwarded: 150,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'admin'
  }
];

// Mock Cleanup Events
export const mockEvents: CleanupEvent[] = [
  {
    id: 'e1',
    title: 'Central Park Weekend Cleanup',
    description: 'Join us for a community cleanup drive at Central Park. Bring gloves and bags!',
    organizerId: '1',
    organizerName: 'Sarah Johnson',
    location: {
      lat: 40.7829,
      lng: -73.9654,
      address: 'Central Park North, New York, NY'
    },
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '13:00',
    participants: [
      { userId: '1', userName: 'Sarah Johnson', joinedAt: new Date().toISOString() },
      { userId: '2', userName: 'Mike Chen', joinedAt: new Date().toISOString() }
    ],
    maxParticipants: 50,
    creditsReward: 200,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'e2',
    title: 'Beach Cleanup Challenge',
    description: 'Help us clean Coney Island Beach and protect marine life',
    organizerId: '3',
    organizerName: 'Green Warriors NYC',
    location: {
      lat: 40.5755,
      lng: -73.9707,
      address: 'Coney Island Beach, Brooklyn, NY'
    },
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '12:00',
    participants: [],
    maxParticipants: 100,
    creditsReward: 250,
    status: 'upcoming',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'e3',
    title: 'Brooklyn Bridge Park Cleanup',
    description: 'Monthly cleanup event at Brooklyn Bridge Park',
    organizerId: '1',
    organizerName: 'Sarah Johnson',
    location: {
      lat: 40.7023,
      lng: -73.9964,
      address: 'Brooklyn Bridge Park, Brooklyn, NY'
    },
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '14:00',
    participants: [
      { userId: '1', userName: 'Sarah Johnson', joinedAt: new Date().toISOString(), attended: true }
    ],
    maxParticipants: 30,
    creditsReward: 200,
    status: 'completed',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Marketplace Items
export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: 'm1',
    sellerId: '1',
    sellerName: 'Sarah Johnson',
    title: 'Clean Plastic Bottles (PET)',
    description: '500 clean PET plastic bottles, sorted and compressed. Perfect for recycling.',
    category: 'plastic',
    quantity: 50,
    unit: 'kg',
    price: 25,
    images: [],
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: 'Manhattan, New York, NY'
    },
    status: 'available',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'm2',
    sellerId: '2',
    sellerName: 'Mike Chen',
    title: 'Scrap Metal - Aluminum Cans',
    description: 'Crushed aluminum cans, ready for pickup',
    category: 'metal',
    quantity: 30,
    unit: 'kg',
    price: 45,
    images: [],
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: 'Queens, New York, NY'
    },
    status: 'available',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'm3',
    sellerId: '1',
    sellerName: 'Sarah Johnson',
    title: 'Cardboard & Paper Waste',
    description: 'Clean cardboard boxes and newspaper',
    category: 'paper',
    quantity: 100,
    unit: 'kg',
    price: 15,
    images: [],
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: 'Brooklyn, New York, NY'
    },
    status: 'sold',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Rewards
export const mockRewards: Reward[] = [
  {
    id: 'rw1',
    title: '$10 Amazon Gift Card',
    description: 'Redeem your credits for a $10 Amazon gift card',
    category: 'voucher',
    creditsRequired: 1000,
    value: '$10',
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    redemptionCount: 45,
    maxRedemptions: 100
  },
  {
    id: 'rw2',
    title: '20% Off Eco Products',
    description: 'Get 20% discount on eco-friendly products at GreenStore',
    category: 'discount',
    creditsRequired: 500,
    value: '20%',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    redemptionCount: 120,
    maxRedemptions: 200
  },
  {
    id: 'rw3',
    title: 'Free Coffee Coupon',
    description: 'Get a free coffee at participating cafes',
    category: 'coupon',
    creditsRequired: 200,
    value: '1 Free Coffee',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    redemptionCount: 89,
    maxRedemptions: 150
  },
  {
    id: 'rw4',
    title: '$5 Cashback',
    description: 'Instant cashback to your wallet',
    category: 'cashback',
    creditsRequired: 500,
    value: '$5',
    validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    redemptionCount: 67,
    maxRedemptions: 100
  }
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: 'a1',
    userId: '1',
    type: 'report',
    title: 'Garbage Report Submitted',
    description: 'Reported plastic waste at Central Park',
    credits: 50,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'a2',
    userId: '1',
    type: 'cleanup',
    title: 'Cleanup Event Completed',
    description: 'Participated in Brooklyn Bridge Park cleanup',
    credits: 200,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'a3',
    userId: '1',
    type: 'badge',
    title: 'New Badge Earned',
    description: 'Earned "Eco Warrior" badge',
    credits: 100,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    type: 'report',
    title: 'Report Verified',
    message: 'Your garbage report at Central Park has been verified. You earned 50 credits!',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'n2',
    userId: '1',
    type: 'event',
    title: 'Upcoming Event Reminder',
    message: 'Central Park Weekend Cleanup starts in 3 days',
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'n3',
    userId: '1',
    type: 'achievement',
    title: 'Streak Milestone!',
    message: 'Congratulations! You have maintained a 45-day streak',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Analytics
export const mockAnalytics: AnalyticsData = {
  totalReports: 1247,
  activeReports: 89,
  cleanedReports: 1098,
  totalUsers: 3456,
  activeUsers: 892,
  totalEvents: 145,
  totalWasteCollected: 12567,
  carbonSaved: 8934,
  reportsOverTime: [
    { date: '2024-03-17', count: 45 },
    { date: '2024-03-18', count: 52 },
    { date: '2024-03-19', count: 38 },
    { date: '2024-03-20', count: 61 },
    { date: '2024-03-21', count: 47 },
    { date: '2024-03-22', count: 55 },
    { date: '2024-03-23', count: 42 },
    { date: '2024-03-24', count: 58 }
  ],
  wasteByType: [
    { type: 'plastic', count: 456 },
    { type: 'organic', count: 234 },
    { type: 'paper', count: 189 },
    { type: 'metal', count: 145 },
    { type: 'glass', count: 123 },
    { type: 'hazardous', count: 67 },
    { type: 'electronic', count: 89 },
    { type: 'mixed', count: 344 }
  ],
  topContributors: [
    { userId: '1', name: 'Sarah Johnson', credits: 2450 },
    { userId: '2', name: 'Mike Chen', credits: 2100 },
    { userId: '3', name: 'Emma Davis', credits: 1890 },
    { userId: '4', name: 'John Smith', credits: 1675 },
    { userId: '5', name: 'Lisa Wang', credits: 1450 }
  ]
};
