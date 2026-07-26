import React from 'react';
import { StoreState, Language, Employee, StaffRole } from '../../types/store';
import { CANDIDATE_POOL } from '../../data/storeData';
import {
  Users,
  UserPlus,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  Sparkles,
  Trash2,
  Award,
  DollarSign,
  Briefcase,
} from 'lucide-react';

interface StaffTabProps {
  state: StoreState;
  lang: Language;
  onHireStaff: (candidate: Omit<Employee, 'id' | 'hiredAtDay'>) => void;
  onFireStaff: (employeeId: string) => void;
  onTrainStaff: (employeeId: string) => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  state,
  lang,
  onHireStaff,
  onFireStaff,
  onTrainStaff,
}) => {
  const formatMoney = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const totalDailySalaries = state.employees.reduce((acc, e) => acc + e.salaryPerDay, 0);

  const roleTitles: Record<StaffRole, { nameEn: string; nameRu: string; descEn: string; descRu: string }> = {
    cashier: {
      nameEn: 'Cashier',
      nameRu: 'Кассир',
      descEn: 'Speeds up customer checkout and eliminates lines.',
      descRu: 'Ускоряет расчет покупателей и предотвращает очереди.',
    },
    restocker: {
      nameEn: 'Restocker',
      nameRu: 'Раскладчик товаров',
      descEn: 'Automatically refills empty shelves from backroom warehouse.',
      descRu: 'Автоматически пополняет полки из фонового склада.',
    },
    security: {
      nameEn: 'Security Guard',
      nameRu: 'Охранник',
      descEn: 'Prevents shoplifting and catches thieves.',
      descRu: 'Предотвращает кражи и снижает финансовые потери.',
    },
    cleaner: {
      nameEn: 'Cleaner',
      nameRu: 'Клинер / Уборщик',
      descEn: 'Maintains store cleanliness and boosts customer rating.',
      descRu: 'Поддерживает идеальную чистоту и рейтинг магазина.',
    },
    manager: {
      nameEn: 'Store Manager',
      nameRu: 'Управляющий',
      descEn: 'Boosts team morale and optimizes store margins automatically.',
      descRu: 'Повышает продуктивность всех сотрудников.',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>{lang === 'ru' ? 'Персонал и Команда' : 'Staff & Human Resources'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ru'
              ? 'Управляйте нанятыми сотрудниками и нанимайте новых специалистов.'
              : 'Manage hired staff, upgrade training, and recruit new team members.'}
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-right">
          <div className="text-xs text-slate-400">{lang === 'ru' ? 'Фонд Оплаты Труда / день:' : 'Daily Payroll:'}</div>
          <div className="text-base font-extrabold font-mono text-rose-400">
            {formatMoney(totalDailySalaries)}
          </div>
        </div>
      </div>

      {/* Currently Hired Staff Roster */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {lang === 'ru'
              ? `Работающие Сотрудники (${state.employees.length})`
              : `Current Team Members (${state.employees.length})`}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.employees.map(emp => {
            const roleInfo = roleTitles[emp.role];
            const trainCost = Math.round(emp.salaryPerDay * 2.5);
            const canAffordTrain = state.money >= trainCost;

            return (
              <div
                key={emp.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl bg-slate-950 p-2 rounded-xl border border-slate-800">
                      {emp.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{emp.name}</h4>
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-800/60">
                        {lang === 'ru' ? roleInfo.nameRu : roleInfo.nameEn}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onFireStaff(emp.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                    title={lang === 'ru' ? 'Уволить' : 'Fire employee'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stats */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>{lang === 'ru' ? 'Зарплата:' : 'Daily Salary:'}</span>
                    <strong className="text-slate-200 font-mono">${emp.salaryPerDay}/day</strong>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>{lang === 'ru' ? 'Эффективность:' : 'Efficiency:'}</span>
                    <strong className="text-emerald-400 font-mono">{(emp.efficiency * 100).toFixed(0)}%</strong>
                  </div>
                </div>

                {/* Train Action */}
                <button
                  disabled={!canAffordTrain}
                  onClick={() => onTrainStaff(emp.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    canAffordTrain
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>
                    {lang === 'ru'
                      ? `Повысить Квалификацию ($${trainCost})`
                      : `Train Staff (+$${trainCost})`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Candidates Pool */}
      <div>
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-indigo-400" />
          <span>{lang === 'ru' ? 'Ярмарка Вакансий / Кандидаты' : 'Available Recruitment Pool'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CANDIDATE_POOL.map((candidate, idx) => {
            const roleInfo = roleTitles[candidate.role];
            const hireBonus = Math.round(candidate.salaryPerDay * 1.5);
            const canAffordHire = state.money >= hireBonus;

            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-3 hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl bg-slate-950 p-2 rounded-xl border border-slate-800">
                      {candidate.avatar}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{candidate.name}</h4>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
                        {lang === 'ru' ? roleInfo.nameRu : roleInfo.nameEn}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 my-2">
                    {lang === 'ru' ? roleInfo.descRu : roleInfo.descEn}
                  </p>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs flex justify-between">
                    <span className="text-slate-400">{lang === 'ru' ? 'Оклад:' : 'Salary:'} <strong>${candidate.salaryPerDay}/day</strong></span>
                    <span className="text-slate-400">{lang === 'ru' ? 'Опыт:' : 'Efficiency:'} <strong className="text-emerald-400">{(candidate.efficiency * 100).toFixed(0)}%</strong></span>
                  </div>
                </div>

                <button
                  disabled={!canAffordHire}
                  onClick={() => onHireStaff(candidate)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    canAffordHire
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>
                    {lang === 'ru'
                      ? `Нанять (Бонус $${hireBonus})`
                      : `Hire Candidate ($${hireBonus})`}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
