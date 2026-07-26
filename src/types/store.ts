export type Language = 'ru' | 'en';

export type StoreCategory = 'grocery' | 'fashion' | 'tech' | 'bakery';

export interface Product {
  id: string;
  nameEn: string;
  nameRu: string;
  category: StoreCategory;
  costPrice: number; // Wholesale price
  defaultPrice: number; // Suggested MSRP
  icon: string; // Lucide icon name or emoji
  maxShelfStock: number;
  unlockedAtLevel: number;
}

export interface InventoryItem {
  productId: string;
  shelfStock: number; // Items currently on sales floor
  warehouseStock: number; // Items in backroom stock
  currentPrice: number;
  autoReorder: boolean;
  autoReorderThreshold: number;
  autoReorderQuantity: number;
  totalSold: number;
  totalRevenue: number;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  budget: number;
  patience: number; // 0-100
  satisfaction: number; // 0-100
  state: 'entering' | 'browsing' | 'queueing' | 'paying' | 'leaving';
  targetProductId?: string;
  cart: { productId: string; quantity: number; pricePaid: number }[];
  position: { x: number; y: number }; // 0-100 percentages for visualizer
  thoughtEmoji?: string;
  thoughtMessage?: string;
}

export type StaffRole = 'cashier' | 'restocker' | 'security' | 'cleaner' | 'manager';

export interface Employee {
  id: string;
  name: string;
  role: StaffRole;
  salaryPerDay: number;
  efficiency: number; // 1.0 to 2.5 multiplier
  avatar: string;
  morale: number; // 0 to 100
  hiredAtDay: number;
}

export interface StoreUpgrade {
  id: string;
  nameEn: string;
  nameRu: string;
  descriptionEn: string;
  descriptionRu: string;
  cost: number;
  icon: string;
  category: 'capacity' | 'speed' | 'attractiveness' | 'security' | 'tech';
  purchased: boolean;
  level: number;
  maxLevel: number;
  effectDescriptionEn: string;
  effectDescriptionRu: string;
}

export interface MarketingCampaign {
  id: string;
  nameEn: string;
  nameRu: string;
  costPerDay: number;
  trafficMultiplier: number;
  durationDays: number;
  remainingDays: number;
  icon: string;
  active: boolean;
}

export interface DailyReport {
  day: number;
  revenue: number;
  costOfGoods: number;
  salaries: number;
  rentAndUtilities: number;
  marketingExpenses: number;
  lossesAndTheft: number;
  netProfit: number;
  customersServed: number;
  customersLeftUnhappy: number;
  averageSatisfaction: number;
}

export interface RandomEvent {
  id: string;
  titleEn: string;
  titleRu: string;
  descriptionEn: string;
  descriptionRu: string;
  type: 'positive' | 'negative' | 'neutral';
  impact: {
    trafficMultiplier?: number;
    moneyChange?: number;
    inventoryLossPct?: number;
    satisfactionChange?: number;
  };
  options?: {
    labelEn: string;
    labelRu: string;
    cost?: number;
    outcomeEn: string;
    outcomeRu: string;
    effect: (state: StoreState) => StoreState;
  }[];
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleRu: string;
  descEn: string;
  descRu: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  rewardMoney: number;
}

export interface StoreState {
  storeName: string;
  storeCategory: StoreCategory;
  level: number;
  xp: number;
  money: number;
  day: number;
  timeHour: number; // 8 to 22
  timeMinute: number; // 0 to 59
  gameSpeed: 0 | 1 | 2 | 3; // 0 = paused
  cleanliness: number; // 0 to 100
  storeRating: number; // 1.0 to 5.0
  footTrafficMultiplier: number;

  inventory: Record<string, InventoryItem>;
  employees: Employee[];
  upgrades: Record<string, StoreUpgrade>;
  marketing: MarketingCampaign[];
  dailyHistory: DailyReport[];
  achievements: Achievement[];
  activeEvents: RandomEvent[];

  // Visualizer active runtime
  activeCustomers: Customer[];
  todaysStats: {
    revenue: number;
    costOfGoods: number;
    customersServed: number;
    customersLeftUnhappy: number;
    totalSatisfactionSum: number;
    itemsSoldTotal: number;
    theftLosses: number;
  };

  rentPerDay: number;
}
