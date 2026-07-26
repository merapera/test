import React, { useState } from 'react';
import { Github, Copy, Check, ExternalLink, X, Terminal, Sparkles } from 'lucide-react';
import { Language } from '../../types/store';

interface GitHubPagesModalProps {
  lang: Language;
  onClose: () => void;
}

export const GitHubPagesModal: React.FC<GitHubPagesModalProps> = ({ lang, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const ghActionYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build app
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-950 border border-purple-700/60 rounded-2xl text-purple-400">
            <Github className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">
              {lang === 'ru' ? 'Публикация на GitHub Pages' : 'Deploy to GitHub Pages'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ru'
                ? ' Пошаговая инструкция для выгрузки сайта магазина в интернет бесплатно.'
                : 'Step-by-step guide to deploy this React store simulator to GitHub Pages.'}
            </p>
          </div>
        </div>

        {/* Step 1 */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
          <div className="font-bold text-slate-200 flex items-center gap-2">
            <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">1</span>
            <span>{lang === 'ru' ? 'Способ A: Публикация через gh-pages (Рекомендуется)' : 'Option A: Deploy via gh-pages package'}</span>
          </div>

          <p className="text-slate-400">
            {lang === 'ru'
              ? 'Установите пакет gh-pages и выполните одну команду в терминале вашего репозитория:'
              : 'Install gh-pages and run deploy script from your terminal:'}
          </p>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-emerald-400 flex items-center justify-between">
            <code>npm install -D gh-pages && npm run build && npx gh-pages -d dist</code>
            <button
              onClick={() =>
                copyToClipboard(
                  'npm install -D gh-pages && npm run build && npx gh-pages -d dist',
                  'cmd1'
                )
              }
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg ml-2"
            >
              {copied === 'cmd1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
          <div className="font-bold text-slate-200 flex items-center gap-2">
            <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">2</span>
            <span>{lang === 'ru' ? 'Способ B: Автоматический GitHub Actions Workflow' : 'Option B: Automatic GitHub Actions Workflow'}</span>
          </div>

          <p className="text-slate-400">
            {lang === 'ru'
              ? 'Создайте файл .github/workflows/deploy.yml в вашем репозитории с содержанием:'
              : 'Create a file .github/workflows/deploy.yml in your repo with this content:'}
          </p>

          <div className="relative">
            <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-300 font-mono overflow-x-auto max-h-48">
              {ghActionYaml}
            </pre>
            <button
              onClick={() => copyToClipboard(ghActionYaml, 'yaml')}
              className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
            >
              {copied === 'yaml' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-1">
          <div className="font-bold text-slate-200 flex items-center gap-2">
            <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">3</span>
            <span>{lang === 'ru' ? 'Включение GitHub Pages в настройках' : 'Enable GitHub Pages in Settings'}</span>
          </div>
          <p className="text-slate-400">
            {lang === 'ru'
              ? 'Перейдите в репозиторий GitHub -> Settings -> Pages -> Source: выберите "GitHub Actions" или ветку "gh-pages". Готово! 🎉'
              : 'Go to GitHub Repo -> Settings -> Pages -> Source: select "GitHub Actions" or "gh-pages" branch. Done! 🎉'}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-2xl shadow transition text-xs"
        >
          {lang === 'ru' ? 'Понятно, закрыть' : 'Got it, close'}
        </button>
      </div>
    </div>
  );
};
