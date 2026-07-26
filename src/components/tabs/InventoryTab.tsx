import React, { useState } from 'react';
import { StoreState, Language, InventoryItem } from '../../types/store';
import { PRODUCTS_CATALOG } from '../../data/storeData';
import {
  Package,
  Plus,
  Minus,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Sliders,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface InventoryTabProps {
  state: StoreState;
  lang: Language;
  onUpdatePrice: (productId: string, newPrice: number) => void;
  onOrderStock: (productId: string, quantity: number) => void;
  onToggleAutoReorder: (productId: string) => void;
  onAutoSetPrices: (marginPercent: number) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  state,
  lang,
  onUpdatePrice,
  onOrderStock,
  onToggleAutoReorder,
  onAutoSetPrices,
}) => {
  const [selectedQty, setSelectedQty] = useState<Record<string, number>>({});

  const formatMoney = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const productsForCategory = PRODUCTS_CATALOG.filter(p => p.category === state.storeCategory);

  return (
    <div className="space-y-6">
      {/* Header & Quick Action bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span>{lang === 'ru' ? 'Управление Товарами и Ценами' : 'Stock & Pricing Management'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ru'
              ? 'Устанавливайте розничные цены, закупайте оптом и настраивайте авто-заказ.'
              : 'Set retail pricing, buy wholesale stock, and manage auto-reorder levels.'}
          </p>
        </div>

        {/* Quick Margin Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">
            {lang === 'ru' ? 'Быстрая Наценка:' : 'Quick Margin:'}
          </span>
          <button
            onClick={() => onAutoSetPrices(25)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            +25%
          </button>
          <button
            onClick={() => onAutoSetPrices(50)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            +50%
          </button>
          <button
            onClick={() => onAutoSetPrices(100)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            +100%
          </button>
        </div>
      </div>

      {/* Products Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productsForCategory.map(product => {
          const item: InventoryItem = state.inventory[product.id] || {
            productId: product.id,
            shelfStock: 0,
            warehouseStock: 0,
            currentPrice: product.defaultPrice,
            autoReorder: false,
            autoReorderThreshold: 10,
            autoReorderQuantity: 20,
            totalSold: 0,
            totalRevenue: 0,
          };

          const isUnlocked = state.level >= product.unlockedAtLevel;
          const qtyToBuy = selectedQty[product.id] || 20;

          const marginPct = Math.round(
            ((item.currentPrice - product.costPrice) / product.costPrice) * 100
          );
          const totalCost = qtyToBuy * product.costPrice;
          const canAfford = state.money >= totalCost;

          if (!isUnlocked) {
            return (
              <div
                key={product.id}
                className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 opacity-60 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs text-amber-400 font-bold mb-1">
                    🔒 {lang === 'ru' ? `Открывается на ${product.unlockedAtLevel} уровне` : `Unlocks at Level ${product.unlockedAtLevel}`}
                  </div>
                  <h3 className="text-sm font-bold text-slate-300">
                    {lang === 'ru' ? product.nameRu : product.nameEn}
                  </h3>
                </div>
              </div>
            );
          }

          return (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between gap-4"
            >
              {/* Product Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-slate-100 truncate">
                    {lang === 'ru' ? product.nameRu : product.nameEn}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      marginPct > 100
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        : marginPct >= 30
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {marginPct > 0 ? `+${marginPct}%` : `${marginPct}%`} {lang === 'ru' ? 'маржа' : 'margin'}
                  </span>
                </div>

                {/* Pricing Controls */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 my-2 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{lang === 'ru' ? 'Себестоимость:' : 'Wholesale cost:'} <strong className="text-slate-200">${product.costPrice.toFixed(2)}</strong></span>
                    <span>{lang === 'ru' ? 'Рекомендованная:' : 'MSRP:'} <strong className="text-slate-200">${product.defaultPrice.toFixed(2)}</strong></span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-xs text-slate-300 font-semibold">{lang === 'ru' ? 'Цена в зале:' : 'Retail Price:'}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          onUpdatePrice(product.id, Math.max(0.1, +(item.currentPrice - 0.5).toFixed(2)))
                        }
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-sm font-extrabold text-emerald-400 min-w-[60px] text-center">
                        ${item.currentPrice.toFixed(2)}
                      </span>
                      <button
                        onClick={() =>
                          onUpdatePrice(product.id, +(item.currentPrice + 0.5).toFixed(2))
                        }
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stock Level Progress */}
                <div className="space-y-1 my-3">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{lang === 'ru' ? 'На Полке:' : 'Shelf Stock:'} <strong className="text-slate-200">{item.shelfStock}/{product.maxShelfStock}</strong></span>
                    <span>{lang === 'ru' ? 'На Складе:' : 'Warehouse:'} <strong className="text-slate-200">{item.warehouseStock}</strong></span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{
                        width: `${Math.min(100, (item.shelfStock / product.maxShelfStock) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Auto Reorder Switch */}
                <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400">
                    {lang === 'ru' ? 'Авто-Заказ со Склада:' : 'Auto-Reorder Supply:'}
                  </span>
                  <button
                    onClick={() => onToggleAutoReorder(product.id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                      item.autoReorder
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.autoReorder ? (lang === 'ru' ? 'ВКЛ' : 'ON') : (lang === 'ru' ? 'ВЫКЛ' : 'OFF')}
                  </button>
                </div>
              </div>

              {/* Wholesale Purchasing controls */}
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[10, 20, 50].map(qty => (
                      <button
                        key={qty}
                        onClick={() => setSelectedQty({ ...selectedQty, [product.id]: qty })}
                        className={`text-xs px-2 py-1 rounded-lg border transition ${
                          qtyToBuy === qty
                            ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        +{qty}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs font-mono font-bold text-slate-300">
                    Total: ${totalCost.toFixed(2)}
                  </div>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => onOrderStock(product.id, qtyToBuy)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    canAfford
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {lang === 'ru'
                      ? `Заказать ${qtyToBuy} шт. (Опт)`
                      : `Order ${qtyToBuy} Units (Wholesale)`}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
