import React from 'react';
import { StoreState, Language, StoreUpgrade } from '../../types/store';
import {
  Sparkles,
  Maximize2,
  CreditCard,
  ShieldCheck,
  Tag,
  Wind,
  CheckCircle2,
  ArrowUpCircle,
} from 'lucide-react';

interface UpgradesTabProps {
  state: StoreState;
  lang: Language;
  onPurchaseUpgrade: (upgradeId: string) => void;
}

export const UpgradesTab: React.FC<UpgradesTabProps> = ({
  state,
  lang,
  onPurchaseUpgrade,
}) => {
  const formatMoney = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Maximize2':
        return <Maximize2 className="w-5 h-5 text-indigo-400" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      case 'Tag':
        return <Tag className="w-5 h-5 text-amber-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-cyan-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{lang === 'ru' ? 'Модернизация и Улучшения Магазина' : 'Store Upgrades & Renovation'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ru'
            ? 'Улучшайте оборудование, увеличивайте площадь и повышайте привлекательность магазина.'
            : 'Upgrade store capacity, checkout speed, climate control, and loss prevention systems.'}
        </p>
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.values(state.upgrades) as StoreUpgrade[]).map(upgrade => {
          const cost = upgrade.cost * Math.pow(1.5, upgrade.level - 1);
          const isMaxed = upgrade.level >= upgrade.maxLevel;
          const canAfford = state.money >= cost && !isMaxed;

          return (
            <div
              key={upgrade.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                      {getIcon(upgrade.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">
                        {lang === 'ru' ? upgrade.nameRu : upgrade.nameEn}
                      </h3>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
                        {lang === 'ru' ? `Уровень ${upgrade.level}/${upgrade.maxLevel}` : `Lvl ${upgrade.level}/${upgrade.maxLevel}`}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 my-2">
                  {lang === 'ru' ? upgrade.descriptionRu : upgrade.descriptionEn}
                </p>

                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-indigo-300 font-medium my-2">
                  ✨ {lang === 'ru' ? upgrade.effectDescriptionRu : upgrade.effectDescriptionEn}
                </div>
              </div>

              <button
                disabled={!canAfford || isMaxed}
                onClick={() => onPurchaseUpgrade(upgrade.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  isMaxed
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 cursor-default'
                    : canAfford
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isMaxed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'ru' ? 'Максимальный Уровень' : 'Max Level Reached'}</span>
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>
                      {lang === 'ru'
                        ? `Улучшить (${formatMoney(cost)})`
                        : `Upgrade (${formatMoney(cost)})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
