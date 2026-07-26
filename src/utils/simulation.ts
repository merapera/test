import {
  StoreState,
  StoreCategory,
  Customer,
  DailyReport,
  InventoryItem,
} from '../types/store';
import {
  STORE_PRESETS,
  PRODUCTS_CATALOG,
  INITIAL_UPGRADES,
  INITIAL_MARKETING,
  ACHIEVEMENTS_LIST,
} from '../data/storeData';

export function createInitialStoreState(category: StoreCategory, customName?: string): StoreState {
  const preset = STORE_PRESETS[category];
  const initialInventory: Record<string, InventoryItem> = {};

  // Find products for this category
  const products = PRODUCTS_CATALOG.filter(p => p.category === category);
  products.forEach(p => {
    initialInventory[p.id] = {
      productId: p.id,
      shelfStock: p.maxShelfStock,
      warehouseStock: p.maxShelfStock * 2,
      currentPrice: p.defaultPrice,
      autoReorder: true,
      autoReorderThreshold: 10,
      autoReorderQuantity: p.maxShelfStock * 2,
      totalSold: 0,
      totalRevenue: 0,
    };
  });

  return {
    storeName: customName || preset.nameEn,
    storeCategory: category,
    level: 1,
    xp: 0,
    money: preset.startingMoney,
    day: 1,
    timeHour: 8,
    timeMinute: 0,
    gameSpeed: 1,
    cleanliness: 95,
    storeRating: 4.5,
    footTrafficMultiplier: 1.0,
    inventory: initialInventory,
    employees: [
      {
        id: 'emp_init_cashier',
        name: 'Anna (Starter)',
        role: 'cashier',
        salaryPerDay: 50,
        efficiency: 1.2,
        avatar: '👩‍💼',
        morale: 90,
        hiredAtDay: 1,
      },
    ],
    upgrades: { ...INITIAL_UPGRADES },
    marketing: INITIAL_MARKETING.map(m => ({ ...m })),
    dailyHistory: [],
    achievements: ACHIEVEMENTS_LIST.map(a => ({ ...a })),
    activeEvents: [],
    activeCustomers: [],
    todaysStats: {
      revenue: 0,
      costOfGoods: 0,
      customersServed: 0,
      customersLeftUnhappy: 0,
      totalSatisfactionSum: 0,
      itemsSoldTotal: 0,
      theftLosses: 0,
    },
    rentPerDay: preset.rentPerDay,
  };
}

export function generateCustomer(
  state: StoreState,
  availableProducts: { id: string; price: number; shelfStock: number; cost: number; nameEn: string; nameRu: string }[]
): Customer | null {
  if (availableProducts.length === 0) return null;

  // Pick a target product
  const chosen = availableProducts[Math.floor(Math.random() * availableProducts.length)];
  const customerId = 'cust_' + Math.random().toString(36).substring(2, 9);

  // Price sensitivity check
  const catalogProduct = PRODUCTS_CATALOG.find(p => p.id === chosen.id);
  const fairPrice = catalogProduct ? catalogProduct.defaultPrice : chosen.price;
  const priceRatio = chosen.price / Math.max(0.1, fairPrice);

  let thoughtEmoji = '🛒';
  let thoughtMessage = 'Looking for goods...';

  if (priceRatio > 1.4) {
    thoughtEmoji = '🏷️';
    thoughtMessage = 'High price!';
  } else if (priceRatio < 0.85) {
    thoughtEmoji = '🔥';
    thoughtMessage = 'Great deal!';
  }

  const names = ['John', 'Svetlana', 'Alex', 'Olga', 'Michael', 'Ekaterina', 'David', 'Marina', 'Dmitry', 'Elena'];
  const avatars = ['🧑', '👨', '👩', '🧔', '👵', '👱‍♀️', '👨‍🦰', '👩‍🦱'];

  return {
    id: customerId,
    name: names[Math.floor(Math.random() * names.length)],
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    budget: chosen.price * (1 + Math.random() * 2),
    patience: 100,
    satisfaction: Math.max(20, Math.min(100, 100 - (priceRatio - 1) * 80)),
    state: 'entering',
    targetProductId: chosen.id,
    cart: [],
    position: { x: 10, y: 85 }, // Entrance
    thoughtEmoji,
    thoughtMessage,
  };
}

export function processTick(state: StoreState): { newState: StoreState; dayEnded: boolean } {
  if (state.gameSpeed === 0) return { newState: state, dayEnded: false };

  let newState = { ...state };
  let { timeHour, timeMinute, day } = newState;

  // Advance time: 1 minute per tick
  timeMinute += 1;
  if (timeMinute >= 60) {
    timeMinute = 0;
    timeHour += 1;
  }

  // Check if workday ended (22:00)
  if (timeHour >= 22) {
    return { newState: endOfDay(newState), dayEnded: true };
  }

  newState.timeHour = timeHour;
  newState.timeMinute = timeMinute;

  // Staff efficiencies
  const cashiers = newState.employees.filter(e => e.role === 'cashier');
  const restockers = newState.employees.filter(e => e.role === 'restocker');
  const security = newState.employees.filter(e => e.role === 'security');
  const cleaners = newState.employees.filter(e => e.role === 'cleaner');

  const cashierPower = cashiers.reduce((acc, e) => acc + e.efficiency, 0) || 0.5;
  const restockPower = restockers.reduce((acc, e) => acc + e.efficiency, 0) || 0.2;
  const securityPower = security.reduce((acc, e) => acc + e.efficiency, 0);
  const cleanerPower = cleaners.reduce((acc, e) => acc + e.efficiency, 0);

  // Cleanliness restoration/degradation
  if (cleanerPower > 0) {
    newState.cleanliness = Math.min(100, newState.cleanliness + cleanerPower * 0.05);
  } else {
    newState.cleanliness = Math.max(30, newState.cleanliness - 0.02);
  }

  // Restocker automation: transfer warehouse to shelf
  if (restockPower > 0) {
    Object.values(newState.inventory).forEach(item => {
      const prod = PRODUCTS_CATALOG.find(p => p.id === item.productId);
      if (!prod) return;
      if (item.shelfStock < prod.maxShelfStock * 0.4 && item.warehouseStock > 0) {
        const transfer = Math.min(
          Math.ceil(5 * restockPower),
          prod.maxShelfStock - item.shelfStock,
          item.warehouseStock
        );
        if (transfer > 0) {
          item.shelfStock += transfer;
          item.warehouseStock -= transfer;
        }
      }
    });
  }

  // Auto-reorder logic for low warehouse stock
  Object.values(newState.inventory).forEach(item => {
    const prod = PRODUCTS_CATALOG.find(p => p.id === item.productId);
    if (!prod) return;

    if (
      item.autoReorder &&
      item.warehouseStock <= item.autoReorderThreshold &&
      newState.money >= item.autoReorderQuantity * prod.costPrice
    ) {
      const totalCost = item.autoReorderQuantity * prod.costPrice;
      newState.money -= totalCost;
      item.warehouseStock += item.autoReorderQuantity;
      newState.todaysStats.costOfGoods += totalCost;
    }
  });

  // Calculate customer spawn chance
  // Peak hours: 12-14 and 17-19
  let hourMultiplier = 1.0;
  if ((timeHour >= 12 && timeHour <= 14) || (timeHour >= 17 && timeHour <= 19)) {
    hourMultiplier = 1.8;
  }

  const activeMarketingMult = newState.marketing
    .filter(m => m.active)
    .reduce((acc, m) => acc * m.trafficMultiplier, 1.0);

  const upgradeCapLevel = newState.upgrades.store_size?.level || 1;
  const maxCustomersOnFloor = 6 + upgradeCapLevel * 3;

  const spawnChance = 0.15 * hourMultiplier * activeMarketingMult * (newState.cleanliness / 100);

  // Filter available stocked products
  const availableProds = Object.values(newState.inventory)
    .filter(item => item.shelfStock > 0)
    .map(item => {
      const catalogItem = PRODUCTS_CATALOG.find(p => p.id === item.productId);
      return {
        id: item.productId,
        price: item.currentPrice,
        shelfStock: item.shelfStock,
        cost: catalogItem?.costPrice || 1,
        nameEn: catalogItem?.nameEn || '',
        nameRu: catalogItem?.nameRu || '',
      };
    });

  // Spawn new customer if space allows
  if (
    newState.activeCustomers.length < maxCustomersOnFloor &&
    Math.random() < spawnChance &&
    availableProds.length > 0
  ) {
    const newCust = generateCustomer(newState, availableProds);
    if (newCust) {
      newState.activeCustomers.push(newCust);
    }
  }

  // Move & process existing active customers
  const updatedCustomers: Customer[] = [];

  for (let cust of newState.activeCustomers) {
    let updated = { ...cust };

    // Update positions & state machine
    if (updated.state === 'entering') {
      updated.position = { x: 30, y: 50 }; // Move towards shelves
      updated.state = 'browsing';
      updated.thoughtEmoji = '🔎';
      updated.thoughtMessage = 'Browsing shelves...';
    } else if (updated.state === 'browsing') {
      // Find item on shelf
      const itemInStock = newState.inventory[updated.targetProductId || ''];
      const catalogItem = PRODUCTS_CATALOG.find(p => p.id === updated.targetProductId);

      if (itemInStock && itemInStock.shelfStock > 0 && catalogItem) {
        // Price check
        const fair = catalogItem.defaultPrice;
        const ratio = itemInStock.currentPrice / fair;

        if (ratio <= 1.35) {
          // Buy item
          itemInStock.shelfStock -= 1;
          updated.cart.push({
            productId: catalogItem.id,
            quantity: 1,
            pricePaid: itemInStock.currentPrice,
          });
          updated.state = 'queueing';
          updated.position = { x: 75, y: 35 }; // Queue line
          updated.thoughtEmoji = '💳';
          updated.thoughtMessage = 'Heading to cashier...';
        } else {
          // Unhappy with price
          updated.satisfaction -= 30;
          updated.thoughtEmoji = '💸';
          updated.thoughtMessage = 'Too expensive! Leaving.';
          updated.state = 'leaving';
          updated.position = { x: 10, y: 85 };
          newState.todaysStats.customersLeftUnhappy += 1;
        }
      } else {
        // Out of stock
        updated.satisfaction -= 20;
        updated.thoughtEmoji = '❌';
        updated.thoughtMessage = 'Out of stock!';
        updated.state = 'leaving';
        updated.position = { x: 10, y: 85 };
        newState.todaysStats.customersLeftUnhappy += 1;
      }
    } else if (updated.state === 'queueing') {
      // Patience decreases while queueing
      updated.patience -= 2;
      if (updated.patience <= 0) {
        updated.state = 'leaving';
        updated.position = { x: 10, y: 85 };
        updated.thoughtEmoji = '😠';
        updated.thoughtMessage = 'Line is too long!';
        newState.todaysStats.customersLeftUnhappy += 1;
      } else {
        // Cashier process chance
        const checkoutChance = 0.3 * cashierPower;
        if (Math.random() < checkoutChance) {
          updated.state = 'paying';
          updated.position = { x: 85, y: 25 }; // Cashier desk
        }
      }
    } else if (updated.state === 'paying') {
      // Shoplifting attempt check if no security guard
      const isShoplifter = Math.random() < 0.03 && securityPower === 0;

      if (isShoplifter) {
        const itemVal = updated.cart.reduce((a, c) => a + c.pricePaid, 0);
        newState.todaysStats.theftLosses += itemVal;
        updated.thoughtEmoji = '🥷';
        updated.thoughtMessage = 'Shoplifted!';
      } else {
        // Normal sale
        const totalPaid = updated.cart.reduce((a, c) => a + c.pricePaid, 0);
        newState.money += totalPaid;
        newState.todaysStats.revenue += totalPaid;
        newState.todaysStats.customersServed += 1;
        newState.todaysStats.itemsSoldTotal += updated.cart.length;
        newState.todaysStats.totalSatisfactionSum += updated.satisfaction;

        // Track per product sold
        updated.cart.forEach(c => {
          if (newState.inventory[c.productId]) {
            newState.inventory[c.productId].totalSold += c.quantity;
            newState.inventory[c.productId].totalRevenue += c.pricePaid * c.quantity;
          }
        });

        // XP & Level up
        newState.xp += Math.round(totalPaid * 0.5);
        if (newState.xp >= newState.level * 250) {
          newState.level += 1;
        }

        updated.thoughtEmoji = '😊';
        updated.thoughtMessage = 'Thank you!';
      }

      updated.state = 'leaving';
      updated.position = { x: 10, y: 85 };
    } else if (updated.state === 'leaving') {
      // Customer leaves store floor
      continue; // Remove from array
    }

    updatedCustomers.push(updated);
  }

  newState.activeCustomers = updatedCustomers;

  // Check achievements progress
  checkAchievements(newState);

  return { newState, dayEnded: false };
}

export function endOfDay(state: StoreState): StoreState {
  const newState = { ...state };

  // Calculate daily staff wages
  const totalSalaries = newState.employees.reduce((acc, e) => acc + e.salaryPerDay, 0);

  // Calculate daily marketing costs
  const totalMarketingCost = newState.marketing
    .filter(m => m.active)
    .reduce((acc, m) => acc + m.costPerDay, 0);

  // Deduct costs
  const totalExpenses = newState.rentPerDay + totalSalaries + totalMarketingCost;
  newState.money -= totalExpenses;

  // Decrement marketing days
  newState.marketing = newState.marketing.map(m => {
    if (m.active) {
      const remaining = m.remainingDays - 1;
      return { ...m, remainingDays: Math.max(0, remaining), active: remaining > 0 };
    }
    return m;
  });

  const avgSatisfaction =
    newState.todaysStats.customersServed > 0
      ? newState.todaysStats.totalSatisfactionSum / newState.todaysStats.customersServed
      : 80;

  // Rating update
  const ratingDelta = (avgSatisfaction - 75) / 100;
  newState.storeRating = Math.max(1.0, Math.min(5.0, newState.storeRating + ratingDelta * 0.1));

  // Build daily report
  const report: DailyReport = {
    day: newState.day,
    revenue: newState.todaysStats.revenue,
    costOfGoods: newState.todaysStats.costOfGoods,
    salaries: totalSalaries,
    rentAndUtilities: newState.rentPerDay,
    marketingExpenses: totalMarketingCost,
    lossesAndTheft: newState.todaysStats.theftLosses,
    netProfit:
      newState.todaysStats.revenue -
      newState.todaysStats.costOfGoods -
      totalExpenses -
      newState.todaysStats.theftLosses,
    customersServed: newState.todaysStats.customersServed,
    customersLeftUnhappy: newState.todaysStats.customersLeftUnhappy,
    averageSatisfaction: Math.round(avgSatisfaction),
  };

  newState.dailyHistory.unshift(report);

  // Reset daily stats for next day
  newState.day += 1;
  newState.timeHour = 8;
  newState.timeMinute = 0;
  newState.activeCustomers = [];
  newState.todaysStats = {
    revenue: 0,
    costOfGoods: 0,
    customersServed: 0,
    customersLeftUnhappy: 0,
    totalSatisfactionSum: 0,
    itemsSoldTotal: 0,
    theftLosses: 0,
  };

  return newState;
}

export function checkAchievements(state: StoreState) {
  state.achievements.forEach(ach => {
    if (ach.unlocked) return;

    if (ach.id === 'first_sale' && state.todaysStats.itemsSoldTotal > 0) {
      ach.unlocked = true;
      state.money += ach.rewardMoney;
    } else if (ach.id === 'rev_10k') {
      const totalRev = state.dailyHistory.reduce((a, b) => a + b.revenue, 0) + state.todaysStats.revenue;
      ach.progress = Math.min(10000, totalRev);
      if (totalRev >= 10000) {
        ach.unlocked = true;
        state.money += ach.rewardMoney;
      }
    } else if (ach.id === 'customers_100') {
      const totalServed = state.dailyHistory.reduce((a, b) => a + b.customersServed, 0) + state.todaysStats.customersServed;
      ach.progress = Math.min(100, totalServed);
      if (totalServed >= 100) {
        ach.unlocked = true;
        state.money += ach.rewardMoney;
      }
    } else if (ach.id === 'five_stars') {
      ach.progress = Math.min(50, Math.round(state.storeRating * 10));
      if (state.storeRating >= 4.8) {
        ach.unlocked = true;
        state.money += ach.rewardMoney;
      }
    } else if (ach.id === 'full_team') {
      ach.progress = state.employees.length;
      if (state.employees.length >= 4) {
        ach.unlocked = true;
        state.money += ach.rewardMoney;
      }
    }
  });
}
