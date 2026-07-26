import React from 'react';
import { StoreState, Language } from '../../types/store';
import {
  Trophy,
  Award,
  DollarSign,
  CheckCircle2,
  Lock,
  Star,
  Users,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

interface AchievementsTabProps {
  state: StoreState;
  lang: Language;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ state, lang }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-indigo-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-400" />;
      case 'Star':
        return <Star className="w-5 h-5 text-amber-400" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-cyan-400" />;
      default:
        return <Trophy className="w-5 h-5 text-amber-400" />;
    }
  };

  const unlockedCount = state.achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>{lang === 'ru' ? 'Достижения и Награды' : 'Trophies & Milestones'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ru'
              ? 'Выполняйте условия, разблокируйте кубки и получайте денежные премии.'
              : 'Complete milestones, unlock trophies, and claim cash bonuses for your store.'}
          </p>
        </div>

        <div className="bg-amber-950/80 border border-amber-700/60 px-4 py-2 rounded-xl text-amber-300 font-bold text-sm font-mono flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{unlockedCount} / {state.achievements.length}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.achievements.map(ach => {
          const progressPct = Math.min(100, Math.round((ach.progress / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-sm transition flex flex-col justify-between gap-3 ${
                ach.unlocked
                  ? 'border-amber-600/60 bg-amber-950/10'
                  : 'border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    {getIcon(ach.icon)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      {lang === 'ru' ? ach.titleRu : ach.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'ru' ? ach.descRu : ach.descEn}
                    </p>
                  </div>
                </div>

                {ach.unlocked ? (
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ru' ? 'Получено' : 'Unlocked'}</span>
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{lang === 'ru' ? 'Заблокировано' : 'Locked'}</span>
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-1 my-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>{lang === 'ru' ? 'Прогресс:' : 'Progress:'}</span>
                  <span>{ach.progress} / {ach.target} ({progressPct}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-emerald-400 font-semibold font-mono bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>{lang === 'ru' ? 'Премия за разблокировку:' : 'Unlock Cash Bonus:'}</span>
                <span className="text-sm font-bold">+${ach.rewardMoney}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
