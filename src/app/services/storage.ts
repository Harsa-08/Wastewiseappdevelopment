import { User, GarbageReport, CleanupEvent, MarketplaceItem, UserReward } from '../types';
import { mockUsers, mockReports, mockEvents, mockMarketplaceItems } from './mockData';

const STORAGE_KEYS = {
  USER: 'wastewise_user',
  USERS: 'wastewise_users',
  REPORTS: 'wastewise_reports',
  EVENTS: 'wastewise_events',
  MARKETPLACE: 'wastewise_marketplace',
  REWARDS: 'wastewise_user_rewards'
};

// Initialize storage with mock data
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(mockReports));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(mockEvents));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MARKETPLACE)) {
    localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(mockMarketplaceItems));
  }
};

initializeStorage();

// Auth Storage
export const authStorage = {
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  },
  
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },
  
  login: (email: string, password: string): User | null => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email);
    if (user) {
      authStorage.setCurrentUser(user);
      return user;
    }
    return null;
  },
  
  register: (userData: Partial<User>): User => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone,
      credits: 0,
      level: 1,
      streakDays: 0,
      totalReports: 0,
      totalCleanups: 0,
      badges: [],
      createdAt: new Date().toISOString(),
      isAdmin: false
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    authStorage.setCurrentUser(newUser);
    return newUser;
  },
  
  logout: () => {
    authStorage.setCurrentUser(null);
  }
};

// User Storage
export const userStorage = {
  getUser: (userId: string): User | null => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.find(u => u.id === userId) || null;
  },
  
  updateUser: (userId: string, updates: Partial<User>) => {
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Update current user if it's the same
      const currentUser = authStorage.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        authStorage.setCurrentUser(users[index]);
      }
    }
  },
  
  getAllUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }
};

// Reports Storage
export const reportsStorage = {
  getReports: (): GarbageReport[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');
  },
  
  getReport: (reportId: string): GarbageReport | null => {
    const reports = reportsStorage.getReports();
    return reports.find(r => r.id === reportId) || null;
  },
  
  createReport: (report: Omit<GarbageReport, 'id' | 'createdAt' | 'updatedAt'>): GarbageReport => {
    const reports = reportsStorage.getReports();
    const newReport: GarbageReport = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    return newReport;
  },
  
  updateReport: (reportId: string, updates: Partial<GarbageReport>) => {
    const reports = reportsStorage.getReports();
    const index = reports.findIndex(r => r.id === reportId);
    if (index !== -1) {
      reports[index] = { 
        ...reports[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    }
  },
  
  getUserReports: (userId: string): GarbageReport[] => {
    const reports = reportsStorage.getReports();
    return reports.filter(r => r.userId === userId);
  }
};

// Events Storage
export const eventsStorage = {
  getEvents: (): CleanupEvent[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  },
  
  getEvent: (eventId: string): CleanupEvent | null => {
    const events = eventsStorage.getEvents();
    return events.find(e => e.id === eventId) || null;
  },
  
  createEvent: (event: Omit<CleanupEvent, 'id' | 'createdAt' | 'participants'>): CleanupEvent => {
    const events = eventsStorage.getEvents();
    const newEvent: CleanupEvent = {
      ...event,
      id: Date.now().toString(),
      participants: [],
      createdAt: new Date().toISOString()
    };
    events.unshift(newEvent);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return newEvent;
  },
  
  updateEvent: (eventId: string, updates: Partial<CleanupEvent>) => {
    const events = eventsStorage.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      events[index] = { ...events[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }
  },
  
  joinEvent: (eventId: string, userId: string, userName: string) => {
    const events = eventsStorage.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      const event = events[index];
      if (!event.participants.find(p => p.userId === userId)) {
        event.participants.push({
          userId,
          userName,
          joinedAt: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      }
    }
  },
  
  leaveEvent: (eventId: string, userId: string) => {
    const events = eventsStorage.getEvents();
    const index = events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      events[index].participants = events[index].participants.filter(p => p.userId !== userId);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }
  }
};

// Marketplace Storage
export const marketplaceStorage = {
  getItems: (): MarketplaceItem[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MARKETPLACE) || '[]');
  },
  
  getItem: (itemId: string): MarketplaceItem | null => {
    const items = marketplaceStorage.getItems();
    return items.find(i => i.id === itemId) || null;
  },
  
  createItem: (item: Omit<MarketplaceItem, 'id' | 'createdAt'>): MarketplaceItem => {
    const items = marketplaceStorage.getItems();
    const newItem: MarketplaceItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(items));
    return newItem;
  },
  
  updateItem: (itemId: string, updates: Partial<MarketplaceItem>) => {
    const items = marketplaceStorage.getItems();
    const index = items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.MARKETPLACE, JSON.stringify(items));
    }
  },
  
  getUserItems: (userId: string): MarketplaceItem[] => {
    const items = marketplaceStorage.getItems();
    return items.filter(i => i.sellerId === userId);
  }
};

// Rewards Storage
export const rewardsStorage = {
  getUserRewards: (userId: string): UserReward[] => {
    const rewards: UserReward[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REWARDS) || '[]');
    return rewards.filter(r => r.userId === userId);
  },
  
  redeemReward: (userId: string, reward: any): UserReward => {
    const rewards: UserReward[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.REWARDS) || '[]');
    const newReward: UserReward = {
      id: Date.now().toString(),
      rewardId: reward.id,
      reward: reward,
      userId,
      redeemedAt: new Date().toISOString(),
      code: `WW-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      used: false
    };
    rewards.push(newReward);
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    return newReward;
  }
};
