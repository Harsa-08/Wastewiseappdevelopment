// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  credits: number;
  level: number;
  streakDays: number;
  totalReports: number;
  totalCleanups: number;
  badges: Badge[];
  createdAt: string;
  isAdmin?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

// Garbage Report Types
export type WasteType = 'plastic' | 'organic' | 'hazardous' | 'electronic' | 'metal' | 'paper' | 'glass' | 'mixed';
export type ReportStatus = 'reported' | 'verified' | 'in-progress' | 'cleaned' | 'rejected';

export interface GarbageReport {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  wasteType: WasteType;
  description: string;
  images: string[];
  status: ReportStatus;
  severity: 'low' | 'medium' | 'high' | 'critical';
  creditsAwarded: number;
  createdAt: string;
  updatedAt: string;
  verifiedBy?: string;
  cleanedAt?: string;
}

// Cleanup Event Types
export interface CleanupEvent {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  participants: Participant[];
  maxParticipants: number;
  creditsReward: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  image?: string;
  createdAt: string;
}

export interface Participant {
  userId: string;
  userName: string;
  userAvatar?: string;
  joinedAt: string;
  attended?: boolean;
}

// Marketplace Types
export interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  title: string;
  description: string;
  category: 'plastic' | 'paper' | 'metal' | 'glass' | 'electronic' | 'other';
  quantity: number;
  unit: 'kg' | 'pieces' | 'tons';
  price: number;
  images: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'available' | 'sold' | 'reserved';
  createdAt: string;
}

// Reward Types
export interface Reward {
  id: string;
  title: string;
  description: string;
  category: 'voucher' | 'discount' | 'coupon' | 'cashback';
  creditsRequired: number;
  value: string;
  validUntil: string;
  image?: string;
  redemptionCount: number;
  maxRedemptions: number;
}

export interface UserReward {
  id: string;
  rewardId: string;
  reward: Reward;
  userId: string;
  redeemedAt: string;
  code: string;
  used: boolean;
  usedAt?: string;
}

// Activity Types
export interface Activity {
  id: string;
  userId: string;
  type: 'report' | 'cleanup' | 'marketplace' | 'reward' | 'badge';
  title: string;
  description: string;
  credits: number;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'report' | 'event' | 'reward' | 'achievement' | 'message';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  itemId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Analytics Types
export interface AnalyticsData {
  totalReports: number;
  activeReports: number;
  cleanedReports: number;
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  totalWasteCollected: number;
  carbonSaved: number;
  reportsOverTime: { date: string; count: number }[];
  wasteByType: { type: WasteType; count: number }[];
  topContributors: { userId: string; name: string; credits: number; avatar?: string }[];
}
