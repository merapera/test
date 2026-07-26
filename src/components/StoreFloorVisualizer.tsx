import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreState, Language, InventoryItem } from '../types/store';
import { PRODUCTS_CATALOG } from '../data/storeData';
import {
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Smile,
  AlertTriangle,
  DoorOpen,
  UserCheck,
  PackageCheck,
  Flame,
} from 'lucide-react';

interface VisualizerProps {
  state: StoreState;
  lang: Language;
}

export const StoreFloorVisualizer: React.FC<VisualizerProps> = ({ state, lang }) => {
  const cashiers = state.employees.filter(e => e.role === 'cashier');
  const restockers = state.employees.filter(e => e.role === 'restocker');
  const security = state.employees.filter(e => e.role === 'security');
  const cleaners = state.employees.filter(e => e.role === 'cleaner');

  // Collect products in stock
  const stockedItems = (Object.values(state.inventory) as InventoryItem[]).slice(0, 6);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Visualizer Top Bar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h2 className="text-sm font-bold text-slate-200">
            {lang === 'ru' ? 'Интерактивный Торговый Зал' : 'Live Store Floor'}
          </h2>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
            {state.activeCustomers.length} {lang === 'ru' ? 'покупателей' : 'shoppers'}
          </span>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {lang === 'ru' ? 'Чистота' : 'Cleanliness'}: {Math.round(state.cleanliness)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>
              {lang === 'ru' ? 'Кассиры' : 'Cashiers'}: {cashiers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Floor Blueprint / Grid View */}
      <div className="relative w-full h-[360px] bg-slate-950/80 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden p-4 select-none">
        {/* Entrance Door */}
        <div className="absolute left-2 bottom-4 bg-emerald-950/90 border border-emerald-600/50 rounded-xl px-3 py-2 flex items-center gap-2 text-emerald-300 text-xs font-semibold shadow-md">
          <DoorOpen className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'ru' ? 'Вход / Выход' : 'Entrance'}</span>
        </div>

        {/* Backroom Warehouse Door */}
        <div className="absolute right-2 top-4 bg-amber-950/90 border border-amber-600/50 rounded-xl px-3 py-2 flex items-center gap-2 text-amber-300 text-xs font-semibold shadow-md">
          <PackageCheck className="w-4 h-4 text-amber-400" />
          <span>{lang === 'ru' ? 'Склад' : 'Backroom'}</span>
        </div>

        {/* Product Shelves Area */}
        <div className="absolute left-1/4 top-12 right-1/3 grid grid-cols-3 gap-3">
          {stockedItems.map(item => {
            const catalog = PRODUCTS_CATALOG.find(p => p.id === item.productId);
            if (!catalog) return null;
            const stockPct = Math.min(100, Math.round((item.shelfStock / catalog.maxShelfStock) * 100));

            return (
              <div
                key={item.productId}
                className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 shadow-md flex flex-col justify-between transition hover:border-slate-500"
              >
                <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
                  <span className="truncate">{lang === 'ru' ? catalog.nameRu : catalog.nameEn}</span>
                  <span className="font-mono text-emerald-400 font-bold">${item.currentPrice.toFixed(2)}</span>
                </div>

                {/* Stock progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden my-1">
                  <div
                    className={`h-full transition-all duration-300 ${
                      stockPct > 40 ? 'bg-emerald-500' : stockPct > 15 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${stockPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{lang === 'ru' ? 'На полке' : 'On Shelf'}: {item.shelfStock}</span>
                  <span>{lang === 'ru' ? 'Склад' : 'Warehouse'}: {item.warehouseStock}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cashier Checkout Counters Area */}
        <div className="absolute right-6 bottom-12 flex flex-col gap-3">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-lg flex items-center gap-3">
            <div className="p-2 bg-indigo-950 text-indigo-400 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">
                {lang === 'ru' ? 'Кассовая Зона' : 'Checkout Area'}
              </div>
              <div className="text-[11px] text-slate-400">
                {cashiers.length > 0
                  ? lang === 'ru'
                    ? `Кассиров на смене: ${cashiers.length}`
                    : `Staff on register: ${cashiers.length}`
                  : lang === 'ru'
                  ? '⚠️ Самообслуживание'
                  : '⚠️ Self-checkout only'}
              </div>
            </div>
          </div>
        </div>

        {/* Staff Visual Avatars on Floor */}
        <div className="absolute bottom-6 left-1/3 flex items-center gap-3">
          {cashiers.map(c => (
            <div
              key={c.id}
              className="bg-indigo-950/80 border border-indigo-700 text-indigo-300 px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow"
            >
              <span>{c.avatar}</span>
              <span className="font-medium text-[11px]">{c.name.split(' ')[0]}</span>
            </div>
          ))}

          {restockers.map(r => (
            <div
              key={r.id}
              className="bg-amber-950/80 border border-amber-700 text-amber-300 px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow"
            >
              <span>{r.avatar}</span>
              <span className="font-medium text-[11px]">{r.name.split(' ')[0]}</span>
            </div>
          ))}

          {security.map(s => (
            <div
              key={s.id}
              className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 px-2 py-1 rounded-lg text-xs flex items-center gap-1 shadow"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-[11px]">{s.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Animated Shoppers on Floor */}
        <AnimatePresence>
          {state.activeCustomers.map(cust => (
            <motion.div
              key={cust.id}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                left: `${cust.position.x}%`,
                top: `${cust.position.y}%`,
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', damping: 15, stiffness: 80 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10"
            >
              {/* Thought Speech Bubble */}
              {cust.thoughtEmoji && (
                <div className="bg-slate-900 border border-slate-700 text-slate-100 text-[10px] px-2 py-0.5 rounded-full shadow-md mb-1 flex items-center gap-1 whitespace-nowrap animate-bounce">
                  <span>{cust.thoughtEmoji}</span>
                  <span className="text-[9px] font-medium text-slate-300">{cust.thoughtMessage}</span>
                </div>
              )}

              {/* Customer Avatar Circle */}
              <div className="bg-slate-800 border-2 border-indigo-500/80 rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg">
                {cust.avatar}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Floor Cleanliness Warning Overlay if low */}
        {state.cleanliness < 50 && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-rose-950/90 border border-rose-700 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>
              {lang === 'ru'
                ? 'Зал загрязнен! Требуется уборка или клинер.'
                : 'Floor is dirty! Cleaners needed.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
