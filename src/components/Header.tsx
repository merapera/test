import React from 'react';
import {
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Save,
  Github,
  Trophy,
  DollarSign,
  Star,
  Users,
  Sparkles,
  Globe,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { StoreState, Language } from '../types/store';

interface HeaderProps {
  state: StoreState;
  lang: Language;
  onSetLang: (lang: Language) => void;
  onSetSpeed: (speed: 0 | 1 | 2 | 3) => void;
  onSaveGame: () => void;
  onResetGame: () => void;
  onOpenGithubModal: () => void;
  onOpenNewStoreModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  lang,
  onSetLang,
  onSetSpeed,
  onSaveGame,
  onResetGame,
  onOpenGithubModal,
  onOpenNewStoreModal,
}) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top bar: Title, preset selector, controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Store Name & Level */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 rounded-xl shadow-md text-slate-950 font-bold">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white">{state.storeName}</h1>
                <span className="bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  Lvl {state.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>Day {state.day}</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">XP: {state.xp}/{state.level * 250}</span>
              </p>
            </div>

            <button
              onClick={onOpenNewStoreModal}
              className="ml-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition flex items-center gap-1"
            >
              {lang === 'ru' ? 'Сменить Магазин' : 'Switch Store'}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Time & Game Speed Controls */}
          <div className="flex items-center gap-4 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 font-mono text-sm text-amber-300 font-semibold px-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{padZero(state.timeHour)}:{padZero(state.timeMinute)}</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-1">
              <button
                onClick={() => onSetSpeed(0)}
                title={lang === 'ru' ? 'Пауза' : 'Pause'}
                className={`p-1.5 rounded-lg transition ${
                  state.gameSpeed === 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <Pause className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSetSpeed(1)}
                title="1x Speed"
                className={`p-1.5 rounded-lg transition text-xs font-bold px-2 ${
                  state.gameSpeed === 1 ? 'bg-emerald-500 text-slate-950' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => onSetSpeed(2)}
                title="2x Speed"
                className={`p-1.5 rounded-lg transition text-xs font-bold px-2 ${
                  state.gameSpeed === 2 ? 'bg-emerald-500 text-slate-950' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                2x
              </button>
              <button
                onClick={() => onSetSpeed(3)}
                title="3x Speed"
                className={`p-1.5 rounded-lg transition ${
                  state.gameSpeed === 3 ? 'bg-emerald-500 text-slate-950' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <FastForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Money, Rating, Language & GitHub Pages Helper */}
          <div className="flex items-center gap-3">
            {/* Money Box */}
            <div className="bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 px-3 py-1.5 rounded-xl font-bold font-mono text-base flex items-center gap-1.5 shadow-sm">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>{formatMoney(state.money)}</span>
            </div>

            {/* Rating Box */}
            <div className="bg-amber-950/60 border border-amber-700/60 text-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{state.storeRating.toFixed(1)}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => onSetLang(lang === 'ru' ? 'en' : 'ru')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
              title="Toggle Language / Переключить язык"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={onSaveGame}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
              title={lang === 'ru' ? 'Сохранить Игру' : 'Save Game'}
            >
              <Save className="w-3.5 h-3.5" />
            </button>

            {/* GitHub Pages Deploy Guide Button */}
            <button
              onClick={onOpenGithubModal}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <Github className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">GitHub Pages</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
