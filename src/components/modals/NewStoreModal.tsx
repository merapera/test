import React, { useState } from 'react';
import { StoreCategory, Language } from '../../types/store';
import { STORE_PRESETS } from '../../data/storeData';
import { Sparkles, Store, X, ArrowRight, Apple, Shirt, Smartphone, Coffee } from 'lucide-react';

interface NewStoreModalProps {
  lang: Language;
  onSelectCategory: (category: StoreCategory, name?: string) => void;
  onClose: () => void;
}

export const NewStoreModal: React.FC<NewStoreModalProps> = ({
  lang,
  onSelectCategory,
  onClose,
}) => {
  const [selectedCat, setSelectedCat] = useState<StoreCategory>('grocery');
  const [customName, setCustomName] = useState('');

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt':
        return <Shirt className="w-6 h-6 text-purple-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-cyan-400" />;
      case 'Coffee':
        return <Coffee className="w-6 h-6 text-amber-400" />;
      case 'Apple':
      default:
        return <Apple className="w-6 h-6 text-emerald-400" />;
    }
  };

  const categories: StoreCategory[] = ['grocery', 'fashion', 'tech', 'bakery'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 border border-emerald-700/60 rounded-2xl text-emerald-400">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">
              {lang === 'ru' ? 'Выбор Типа Магазина' : 'Choose Store Business Model'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ru'
                ? ' Выберите сферу розничной торговли и задайте название бренда.'
                : 'Select your retail niche and specify your store brand name.'}
            </p>
          </div>
        </div>

        {/* Store Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">
            {lang === 'ru' ? 'Название Вашего Бренда:' : 'Your Store Brand Name:'}
          </label>
          <input
            type="text"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            placeholder={
              lang === 'ru'
                ? STORE_PRESETS[selectedCat].nameRu
                : STORE_PRESETS[selectedCat].nameEn
            }
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition"
          />
        </div>

        {/* Categories Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map(cat => {
            const preset = STORE_PRESETS[cat];
            const isSelected = selectedCat === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    {getPresetIcon(preset.icon)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      {lang === 'ru' ? preset.nameRu : preset.nameEn}
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      Capital: ${preset.startingMoney}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  {lang === 'ru' ? preset.descRu : preset.descEn}
                </p>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onSelectCategory(selectedCat, customName || undefined)}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
        >
          <span>{lang === 'ru' ? 'Запустить Магазин' : 'Launch New Store'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
