import React from 'react';
import { StoreState, Language } from '../../types/store';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Star,
  Award,
  Sparkles,
  ArrowUpRight,
  PackageCheck,
  Megaphone,
  UserPlus,
  AlertCircle,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

interface DashboardTabProps {
  state: StoreState;
  lang: Language;
  onSelectTab: (tab: string) => void;
  onCleanStore: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  state,
  lang,
  onSelectTab,
  onCleanStore,
}) => {
  const formatMoney = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const activeMarketing = state.marketing.filter(m => m.active);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>{lang === 'ru' ? 'Выручка за Сегодня' : "Today's Revenue"}</span>
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {formatMoney(state.todaysStats.revenue)}
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>{state.todaysStats.itemsSoldTotal} {lang === 'ru' ? 'товаров продано' : 'items sold'}</span>
          </p>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>{lang === 'ru' ? 'Обслужено Покупателей' : 'Customers Served'}</span>
            <div className="p-2 bg-indigo-950 text-indigo-400 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-300">
            {state.todaysStats.customersServed}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {state.todaysStats.customersLeftUnhappy > 0
              ? lang === 'ru'
                ? `⚠️ ${state.todaysStats.customersLeftUnhappy} ушли недовольными`
                : `⚠️ ${state.todaysStats.customersLeftUnhappy} left unhappy`
              : lang === 'ru'
              ? '✨ 100% довольных клиентов!'
              : '✨ 100% customer satisfaction!'}
          </p>
        </div>

        {/* Store Cleanliness & Rating */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>{lang === 'ru' ? 'Чистота и Рейтинг' : 'Cleanliness & Rating'}</span>
            <div className="p-2 bg-amber-950 text-amber-400 rounded-xl">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-300 flex items-center gap-2">
            <span>{state.storeRating.toFixed(1)} ★</span>
            <span className="text-xs font-normal text-slate-400">({Math.round(state.cleanliness)}%)</span>
          </div>
          <div className="mt-2">
            <button
              onClick={onCleanStore}
              className="w-full text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 py-1 rounded-lg border border-slate-700 transition flex items-center justify-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Провести Уборку' : 'Manual Clean Floor'}</span>
            </button>
          </div>
        </div>

        {/* Staff & Active Marketing */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>{lang === 'ru' ? 'Сотрудники и Реклама' : 'Staff & Active Ads'}</span>
            <div className="p-2 bg-purple-950 text-purple-400 rounded-xl">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-200">
            {state.employees.length} {lang === 'ru' ? 'чел. на смене' : 'staff hired'}
          </div>
          <p className="text-xs text-purple-400 mt-1">
            {activeMarketing.length > 0
              ? lang === 'ru'
                ? `🚀 ${activeMarketing.length} активных рекламных кампаний`
                : `🚀 ${activeMarketing.length} active campaigns`
              : lang === 'ru'
              ? 'Нет активной рекламы'
              : 'No active ads'}
          </p>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'ru' ? 'Быстрые Действия Управляющего' : 'Manager Quick Actions'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onSelectTab('inventory')}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-left group"
          >
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg w-fit mb-2 group-hover:scale-105 transition">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">
              {lang === 'ru' ? 'Заказать Товар' : 'Restock Goods'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'ru' ? 'Пополнить склад' : 'Wholesale supply'}
            </div>
          </button>

          <button
            onClick={() => onSelectTab('staff')}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-left group"
          >
            <div className="p-2 bg-indigo-950 text-indigo-400 rounded-lg w-fit mb-2 group-hover:scale-105 transition">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">
              {lang === 'ru' ? 'Найм Персонала' : 'Hire Staff'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'ru' ? 'Кассиры, клинеры' : 'Cashiers, guards'}
            </div>
          </button>

          <button
            onClick={() => onSelectTab('marketing')}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-left group"
          >
            <div className="p-2 bg-purple-950 text-purple-400 rounded-lg w-fit mb-2 group-hover:scale-105 transition">
              <Megaphone className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">
              {lang === 'ru' ? 'Запустить Рекламу' : 'Run Campaign'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'ru' ? 'Привлечь покупателей' : 'Boost foot traffic'}
            </div>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition text-left group"
          >
            <div className="p-2 bg-amber-950 text-amber-400 rounded-lg w-fit mb-2 group-hover:scale-105 transition">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-200">
              {lang === 'ru' ? 'Отчеты и Графики' : 'Analytics & P&L'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'ru' ? 'Анализ прибыльности' : 'Financial breakdown'}
            </div>
          </button>
        </div>
      </div>

      {/* Live Store News & Notifications Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-400" />
          <span>{lang === 'ru' ? 'Оперативные Сводки' : 'Live Store Activity Log'}</span>
        </h3>

        <div className="space-y-2 text-xs">
          {state.todaysStats.revenue > 0 && (
            <div className="p-2.5 bg-slate-950 border border-emerald-900/40 rounded-xl text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'ru'
                  ? `Сегодня уже получено ${formatMoney(state.todaysStats.revenue)} выручки!`
                  : `Earned ${formatMoney(state.todaysStats.revenue)} revenue so far today!`}
              </span>
            </div>
          )}

          {state.todaysStats.theftLosses > 0 && (
            <div className="p-2.5 bg-slate-950 border border-rose-900/40 rounded-xl text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                {lang === 'ru'
                  ? `Потери от шоплифтинга: ${formatMoney(state.todaysStats.theftLosses)}. Нанимите охранника!`
                  : `Shoplifting losses: ${formatMoney(state.todaysStats.theftLosses)}. Consider hiring security!`}
              </span>
            </div>
          )}

          {state.cleanliness < 60 && (
            <div className="p-2.5 bg-slate-950 border border-amber-900/40 rounded-xl text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {lang === 'ru'
                  ? 'Магазин нуждается в уборке. Низкая чистота снижает рейтинг!'
                  : 'Store needs cleaning. Dirty floors lower store rating!'}
              </span>
            </div>
          )}

          {state.employees.length === 1 && (
            <div className="p-2.5 bg-slate-950 border border-indigo-900/40 rounded-xl text-indigo-300 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                {lang === 'ru'
                  ? 'Совет: наймите раскладчика (restocker) для автоматического пополнения полок со склада.'
                  : 'Tip: Hire a restocker to automatically refill shelves from warehouse.'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
