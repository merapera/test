import React, { useState, useEffect, useRef } from 'react';
import {
  StoreState,
  Language,
  StoreCategory,
  Employee,
  DailyReport,
} from './types/store';
import {
  createInitialStoreState,
  processTick,
} from './utils/simulation';
import { Header } from './components/Header';
import { StoreFloorVisualizer } from './components/StoreFloorVisualizer';
import { DashboardTab } from './components/tabs/DashboardTab';
import { InventoryTab } from './components/tabs/InventoryTab';
import { StaffTab } from './components/tabs/StaffTab';
import { UpgradesTab } from './components/tabs/UpgradesTab';
import { MarketingTab } from './components/tabs/MarketingTab';
import { AnalyticsTab } from './components/tabs/AnalyticsTab';
import { AchievementsTab } from './components/tabs/AchievementsTab';
import { DaySummaryModal } from './components/modals/DaySummaryModal';
import { GitHubPagesModal } from './components/modals/GitHubPagesModal';
import { NewStoreModal } from './components/modals/NewStoreModal';
import { PRODUCTS_CATALOG } from './data/storeData';
import {
  LayoutDashboard,
  Package,
  Users,
  Sparkles,
  Megaphone,
  BarChart3,
  Trophy,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'store_simulator_save_v1';

export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [state, setState] = useState<StoreState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load save state', e);
      }
    }
    return createInitialStoreState('grocery');
  });

  const [lastDailyReport, setLastDailyReport] = useState<DailyReport | null>(null);
  const [showDaySummaryModal, setShowDaySummaryModal] = useState<boolean>(false);
  const [showGithubModal, setShowGithubModal] = useState<boolean>(false);
  const [showNewStoreModal, setShowNewStoreModal] = useState<boolean>(false);

  // Auto save game state to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Main Simulation Loop
  useEffect(() => {
    if (state.gameSpeed === 0 || showDaySummaryModal) return;

    const intervalMs = state.gameSpeed === 1 ? 800 : state.gameSpeed === 2 ? 400 : 200;

    const timer = setInterval(() => {
      setState(prevState => {
        const { newState, dayEnded } = processTick(prevState);
        if (dayEnded && newState.dailyHistory.length > 0) {
          setLastDailyReport(newState.dailyHistory[0]);
          setShowDaySummaryModal(true);
        }
        return newState;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [state.gameSpeed, showDaySummaryModal]);

  // Handler Actions
  const handleSetSpeed = (speed: 0 | 1 | 2 | 3) => {
    setState(prev => ({ ...prev, gameSpeed: speed }));
  };

  const handleCleanStore = () => {
    setState(prev => ({
      ...prev,
      cleanliness: Math.min(100, prev.cleanliness + 25),
    }));
  };

  const handleUpdatePrice = (productId: string, newPrice: number) => {
    setState(prev => {
      const inv = { ...prev.inventory };
      if (inv[productId]) {
        inv[productId] = { ...inv[productId], currentPrice: newPrice };
      }
      return { ...prev, inventory: inv };
    });
  };

  const handleOrderStock = (productId: string, quantity: number) => {
    const prod = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!prod) return;

    const totalCost = quantity * prod.costPrice;
    if (state.money < totalCost) return;

    setState(prev => {
      const inv = { ...prev.inventory };
      if (inv[productId]) {
        inv[productId] = {
          ...inv[productId],
          warehouseStock: inv[productId].warehouseStock + quantity,
        };
      }
      return {
        ...prev,
        money: prev.money - totalCost,
        inventory: inv,
        todaysStats: {
          ...prev.todaysStats,
          costOfGoods: prev.todaysStats.costOfGoods + totalCost,
        },
      };
    });
  };

  const handleToggleAutoReorder = (productId: string) => {
    setState(prev => {
      const inv = { ...prev.inventory };
      if (inv[productId]) {
        inv[productId] = {
          ...inv[productId],
          autoReorder: !inv[productId].autoReorder,
        };
      }
      return { ...prev, inventory: inv };
    });
  };

  const handleAutoSetPrices = (marginPercent: number) => {
    setState(prev => {
      const inv = { ...prev.inventory };
      Object.keys(inv).forEach(pid => {
        const catalog = PRODUCTS_CATALOG.find(p => p.id === pid);
        if (catalog) {
          const newP = catalog.costPrice * (1 + marginPercent / 100);
          inv[pid] = { ...inv[pid], currentPrice: +newP.toFixed(2) };
        }
      });
      return { ...prev, inventory: inv };
    });
  };

  const handleHireStaff = (candidate: Omit<Employee, 'id' | 'hiredAtDay'>) => {
    const hireBonus = Math.round(candidate.salaryPerDay * 1.5);
    if (state.money < hireBonus) return;

    const newEmp: Employee = {
      ...candidate,
      id: 'emp_' + Math.random().toString(36).substring(2, 9),
      hiredAtDay: state.day,
    };

    setState(prev => ({
      ...prev,
      money: prev.money - hireBonus,
      employees: [...prev.employees, newEmp],
    }));
  };

  const handleFireStaff = (employeeId: string) => {
    setState(prev => ({
      ...prev,
      employees: prev.employees.filter(e => e.id !== employeeId),
    }));
  };

  const handleTrainStaff = (employeeId: string) => {
    setState(prev => {
      const emps = prev.employees.map(e => {
        if (e.id === employeeId) {
          const trainCost = Math.round(e.salaryPerDay * 2.5);
          if (prev.money >= trainCost) {
            return {
              ...e,
              efficiency: +(e.efficiency + 0.25).toFixed(2),
              salaryPerDay: Math.round(e.salaryPerDay * 1.15),
            };
          }
        }
        return e;
      });

      const empToTrain = prev.employees.find(e => e.id === employeeId);
      const cost = empToTrain ? Math.round(empToTrain.salaryPerDay * 2.5) : 0;

      return {
        ...prev,
        money: Math.max(0, prev.money - cost),
        employees: emps,
      };
    });
  };

  const handlePurchaseUpgrade = (upgradeId: string) => {
    setState(prev => {
      const upgrade = prev.upgrades[upgradeId];
      if (!upgrade) return prev;

      const cost = upgrade.cost * Math.pow(1.5, upgrade.level - 1);
      if (prev.money < cost || upgrade.level >= upgrade.maxLevel) return prev;

      return {
        ...prev,
        money: prev.money - cost,
        upgrades: {
          ...prev.upgrades,
          [upgradeId]: {
            ...upgrade,
            level: upgrade.level + 1,
            purchased: true,
          },
        },
      };
    });
  };

  const handleStartCampaign = (campaignId: string) => {
    setState(prev => {
      const campaigns = prev.marketing.map(m => {
        if (m.id === campaignId) {
          const totalCost = m.costPerDay * m.durationDays;
          if (prev.money >= totalCost) {
            return {
              ...m,
              active: true,
              remainingDays: m.durationDays,
            };
          }
        }
        return m;
      });

      const campaign = prev.marketing.find(m => m.id === campaignId);
      const cost = campaign ? campaign.costPerDay * campaign.durationDays : 0;

      return {
        ...prev,
        money: Math.max(0, prev.money - cost),
        marketing: campaigns,
      };
    });
  };

  const handleStartNewStore = (category: StoreCategory, customName?: string) => {
    setState(createInitialStoreState(category, customName));
    setShowNewStoreModal(false);
  };

  const tabs = [
    { id: 'dashboard', labelEn: 'Dashboard', labelRu: 'Главная', icon: LayoutDashboard },
    { id: 'inventory', labelEn: 'Inventory', labelRu: 'Склад и Цены', icon: Package },
    { id: 'staff', labelEn: 'Staff HR', labelRu: 'Персонал', icon: Users },
    { id: 'upgrades', labelEn: 'Upgrades', labelRu: 'Улучшения', icon: Sparkles },
    { id: 'marketing', labelEn: 'Marketing', labelRu: 'Маркетинг', icon: Megaphone },
    { id: 'analytics', labelEn: 'Analytics', labelRu: 'Аналитика', icon: BarChart3 },
    { id: 'achievements', labelEn: 'Trophies', labelRu: 'Достижения', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 pb-12">
      {/* Top Header */}
      <Header
        state={state}
        lang={lang}
        onSetLang={setLang}
        onSetSpeed={handleSetSpeed}
        onSaveGame={() => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))}
        onResetGame={() => setState(createInitialStoreState('grocery'))}
        onOpenGithubModal={() => setShowGithubModal(true)}
        onOpenNewStoreModal={() => setShowNewStoreModal(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* Animated Store Floor Visualizer */}
        <StoreFloorVisualizer state={state} lang={lang} />

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none shadow-md">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'ru' ? tab.labelRu : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content Render */}
        <div className="transition-all duration-200">
          {activeTab === 'dashboard' && (
            <DashboardTab
              state={state}
              lang={lang}
              onSelectTab={setActiveTab}
              onCleanStore={handleCleanStore}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab
              state={state}
              lang={lang}
              onUpdatePrice={handleUpdatePrice}
              onOrderStock={handleOrderStock}
              onToggleAutoReorder={handleToggleAutoReorder}
              onAutoSetPrices={handleAutoSetPrices}
            />
          )}

          {activeTab === 'staff' && (
            <StaffTab
              state={state}
              lang={lang}
              onHireStaff={handleHireStaff}
              onFireStaff={handleFireStaff}
              onTrainStaff={handleTrainStaff}
            />
          )}

          {activeTab === 'upgrades' && (
            <UpgradesTab
              state={state}
              lang={lang}
              onPurchaseUpgrade={handlePurchaseUpgrade}
            />
          )}

          {activeTab === 'marketing' && (
            <MarketingTab
              state={state}
              lang={lang}
              onStartCampaign={handleStartCampaign}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsTab state={state} lang={lang} />}

          {activeTab === 'achievements' && <AchievementsTab state={state} lang={lang} />}
        </div>
      </main>

      {/* Modals */}
      {showDaySummaryModal && lastDailyReport && (
        <DaySummaryModal
          report={lastDailyReport}
          lang={lang}
          onNextDay={() => setShowDaySummaryModal(false)}
        />
      )}

      {showGithubModal && (
        <GitHubPagesModal lang={lang} onClose={() => setShowGithubModal(false)} />
      )}

      {showNewStoreModal && (
        <NewStoreModal
          lang={lang}
          onSelectCategory={handleStartNewStore}
          onClose={() => setShowNewStoreModal(false)}
        />
      )}
    </div>
  );
}
