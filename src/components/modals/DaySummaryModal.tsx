import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StoreState, Language, DailyReport } from '../../types/store';
import {
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Star,
} from 'lucide-react';

interface DaySummaryModalProps {
  report: DailyReport;
  lang: Language;
  onNextDay: () => void;
}

export const DaySummaryModal: React.FC<DaySummaryModalProps> = ({
  report,
  lang,
  onNextDay,
}) => {
  const formatMoney = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  useEffect(() => {
    if (report.netProfit > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [report]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-1">
          <div className="inline-flex p-3 bg-emerald-950 border border-emerald-700/60 rounded-2xl text-emerald-400 mb-2">
            <Sparkles className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            {lang === 'ru' ? `Итоги Дня #${report.day}` : `Day #${report.day} Business Summary`}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'ru' ? 'Рабочая смена завершена (22:00)' : 'Store shift concluded (22:00)'}
          </p>
        </div>

        {/* Profit Banner */}
        <div
          className={`p-4 rounded-2xl border text-center font-mono ${
            report.netProfit >= 0
              ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
              : 'bg-rose-950/80 border-rose-700/80 text-rose-300'
          }`}
        >
          <div className="text-xs uppercase tracking-wider font-semibold opacity-80 mb-1">
            {lang === 'ru' ? 'Итоговая Чистая Прибыль' : 'Net Daily Profit'}
          </div>
          <div className="text-3xl font-black">
            {report.netProfit >= 0 ? `+${formatMoney(report.netProfit)}` : formatMoney(report.netProfit)}
          </div>
        </div>

        {/* Key Metrics Breakdown */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-xs space-y-2 font-mono">
          <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-300">
            <span>{lang === 'ru' ? 'Выручка:' : 'Revenue:'}</span>
            <span className="text-emerald-400 font-bold">{formatMoney(report.revenue)}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-400">
            <span>{lang === 'ru' ? 'Себестоимость товаров:' : 'Cost of Goods:'}</span>
            <span className="text-rose-400">-{formatMoney(report.costOfGoods)}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-400">
            <span>{lang === 'ru' ? 'Зарплаты персонала:' : 'Staff Salaries:'}</span>
            <span className="text-rose-400">-{formatMoney(report.salaries)}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-400">
            <span>{lang === 'ru' ? 'Аренда и коммунальные:' : 'Rent & Utilities:'}</span>
            <span className="text-rose-400">-{formatMoney(report.rentAndUtilities)}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-800/80 text-slate-400">
            <span>{lang === 'ru' ? 'Маркетинг:' : 'Marketing Spend:'}</span>
            <span className="text-rose-400">-{formatMoney(report.marketingExpenses)}</span>
          </div>

          <div className="flex justify-between pt-2 text-slate-300 font-sans font-semibold">
            <span>{lang === 'ru' ? 'Обслужено покупателей:' : 'Customers Served:'}</span>
            <span className="text-indigo-400">{report.customersServed}</span>
          </div>

          <div className="flex justify-between text-slate-300 font-sans font-semibold">
            <span>{lang === 'ru' ? 'Среднее удовлетворение:' : 'Average Satisfaction:'}</span>
            <span className="text-amber-400">{report.averageSatisfaction}%</span>
          </div>
        </div>

        <button
          onClick={onNextDay}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
        >
          <span>{lang === 'ru' ? 'Начать Следующий День' : 'Start Next Business Day'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
