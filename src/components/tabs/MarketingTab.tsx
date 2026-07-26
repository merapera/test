import React from 'react';
import { StoreState, Language } from '../../types/store';
import {
  Megaphone,
  Share2,
  Tv,
  FileText,
  Clock,
  TrendingUp,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface MarketingTabProps {
  state: StoreState;
  lang: Language;
  onStartCampaign: (campaignId: string) => void;
}

export const MarketingTab: React.FC<MarketingTabProps> = ({
  state,
  lang,
  onStartCampaign,
}) => {
  const formatMoney = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-purple-400" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-emerald-400" />;
      case 'Megaphone':
      default:
        return <Megaphone className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
        <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-purple-400" />
          <span>{lang === 'ru' ? 'Маркетинг и Привлечение Покупателей' : 'Marketing & Advertising Campaigns'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'ru'
            ? 'Запускайте рекламу в соцсетях, на билбордах и у блогеров, чтобы увеличить трафик.'
            : 'Launch ad campaigns to multiply store foot traffic and boost daily sales.'}
        </p>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.marketing.map(campaign => {
          const canAfford = state.money >= campaign.costPerDay * campaign.durationDays;

          return (
            <div
              key={campaign.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-sm transition flex flex-col justify-between gap-4 ${
                campaign.active
                  ? 'border-purple-600/80 bg-purple-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                      {getIcon(campaign.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">
                        {lang === 'ru' ? campaign.nameRu : campaign.nameEn}
                      </h3>
                      <span className="text-xs font-mono font-bold text-purple-400">
                        +{Math.round((campaign.trafficMultiplier - 1) * 100)}% {lang === 'ru' ? 'трафика' : 'traffic'}
                      </span>
                    </div>
                  </div>

                  {campaign.active && (
                    <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                      <span>{campaign.remainingDays} {lang === 'ru' ? 'дн. активно' : 'days left'}</span>
                    </span>
                  )}
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1 my-3">
                  <div className="flex justify-between text-slate-400">
                    <span>{lang === 'ru' ? 'Стоимость в день:' : 'Daily Cost:'}</span>
                    <strong className="text-slate-200 font-mono">${campaign.costPerDay}/day</strong>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>{lang === 'ru' ? 'Длительность:' : 'Duration:'}</span>
                    <strong className="text-slate-200">{campaign.durationDays} {lang === 'ru' ? 'дней' : 'days'}</strong>
                  </div>

                  <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                    <span>{lang === 'ru' ? 'Итого бюджет:' : 'Total Budget:'}</span>
                    <strong className="text-purple-300 font-mono">
                      {formatMoney(campaign.costPerDay * campaign.durationDays)}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                disabled={campaign.active || !canAfford}
                onClick={() => onStartCampaign(campaign.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  campaign.active
                    ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80 cursor-default'
                    : canAfford
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {campaign.active ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    <span>{lang === 'ru' ? 'Кампания Запущена' : 'Campaign Active'}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>
                      {lang === 'ru'
                        ? `Запустить (${formatMoney(campaign.costPerDay * campaign.durationDays)})`
                        : `Launch Campaign (${formatMoney(campaign.costPerDay * campaign.durationDays)})`}
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
