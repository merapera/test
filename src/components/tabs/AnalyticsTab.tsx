import React from 'react';
import { StoreState, Language, InventoryItem } from '../../types/store';
import { PRODUCTS_CATALOG } from '../../data/storeData';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  ShoppingBag,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';

interface AnalyticsTabProps {
  state: StoreState;
  lang: Language;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ state, lang }) => {
  const formatMoney = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // Prepare chart data from daily history
  const chartData = [...state.dailyHistory].reverse().map(d => ({
    day: `${lang === 'ru' ? 'День' : 'Day'} ${d.day}`,
    Revenue: d.revenue,
    Profit: d.netProfit,
    Customers: d.customersServed,
  }));

  // Top products sold
  const topProducts = (Object.values(state.inventory) as InventoryItem[])
    .map(item => {
      const cat = PRODUCTS_CATALOG.find(p => p.id === item.productId);
      return {
        name: cat ? (lang === 'ru' ? cat.nameRu : cat.nameEn) : item.productId,
        sold: item.totalSold,
        revenue: item.totalRevenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const lastDay = state.dailyHistory[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <span>{lang === 'ru' ? 'Аналитика и Финансовые Отчеты' : 'Analytics & Financial Reports'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ru'
            ? 'Отслеживайте динамику выручки, чистой прибыли, поток клиентов и бестселлеры.'
            : 'Track daily revenue growth, net profits, customer volume, and best-selling inventory.'}
        </p>
      </div>

      {/* Revenue & Profit Growth Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'ru' ? 'Динамика Выручки и Чистой Прибыли ($)' : 'Revenue & Profit Trend ($)'}</span>
        </h3>

        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Profit" stroke="#6366f1" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            {lang === 'ru'
              ? 'Данные появятся после завершения первого рабочего дня (22:00).'
              : 'Historical trends will populate after completing your first business day (22:00).'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Selling Products Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ru' ? 'Топ Продаваемых Товаров' : 'Top Performing Products'}</span>
          </h3>

          <div className="space-y-3">
            {topProducts.map((prod, i) => (
              <div
                key={i}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-amber-400 font-mono">#{i + 1}</span>
                  <span className="font-semibold text-slate-200">{prod.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400">{formatMoney(prod.revenue)}</div>
                  <div className="text-[10px] text-slate-400">{prod.sold} {lang === 'ru' ? 'шт.' : 'units'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest P&L Financial Report Statement */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ru' ? 'Отчет о Прибылях и Убытках (P&L)' : 'Latest P&L Statement'}</span>
          </h3>

          {lastDay ? (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-300">
                <span>(+) {lang === 'ru' ? 'Выручка' : 'Gross Revenue'}</span>
                <span className="text-emerald-400 font-bold">+{formatMoney(lastDay.revenue)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>(-) {lang === 'ru' ? 'Закупка товаров (COGS)' : 'Cost of Goods (COGS)'}</span>
                <span className="text-rose-400">-{formatMoney(lastDay.costOfGoods)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>(-) {lang === 'ru' ? 'Зарплаты сотрудников' : 'Staff Salaries'}</span>
                <span className="text-rose-400">-{formatMoney(lastDay.salaries)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>(-) {lang === 'ru' ? 'Аренда и коммунальные' : 'Rent & Utilities'}</span>
                <span className="text-rose-400">-{formatMoney(lastDay.rentAndUtilities)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-slate-400">
                <span>(-) {lang === 'ru' ? 'Расходы на рекламу' : 'Marketing Spend'}</span>
                <span className="text-rose-400">-{formatMoney(lastDay.marketingExpenses)}</span>
              </div>
              {lastDay.lossesAndTheft > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-800 text-rose-400">
                  <span>(-) {lang === 'ru' ? 'Потери от краж' : 'Shoplifting Losses'}</span>
                  <span>-{formatMoney(lastDay.lossesAndTheft)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 font-extrabold text-sm border-t-2 border-slate-700">
                <span className="text-slate-100 font-sans">{lang === 'ru' ? 'Чистая Прибыль:' : 'Net Profit:'}</span>
                <span className={lastDay.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {formatMoney(lastDay.netProfit)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              {lang === 'ru'
                ? 'Финансовый отчет сформируется в конце дня.'
                : 'P&L statement will generate at 22:00.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
