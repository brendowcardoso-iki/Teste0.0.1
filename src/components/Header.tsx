import React from 'react';
import { Terminal, Download, Code2, Sparkles, Cpu, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onDownloadAll: () => void;
  onOpenHowToRun: () => void;
  activeTab: 'simulator' | 'charts' | 'code' | 'runner';
  setActiveTab: (tab: 'simulator' | 'charts' | 'code' | 'runner') => void;
  historyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onDownloadAll,
  onOpenHowToRun,
  activeTab,
  setActiveTab,
  historyCount = 0,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-orange-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-zinc-100 tracking-tight">
                Calculadoras Python & Gráficos Seaborn
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Seaborn v0.12.2 + Python 3.10
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Crie calculadoras em Python (Tkinter, CLI e POO) com gráficos estatísticos do histórico gerados em Seaborn
            </p>
          </div>
        </div>

        {/* Central View Navigation */}
        <div className="hidden md:flex items-center space-x-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800">
          <button
            id="tab-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'simulator'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulador</span>
          </button>

          <button
            id="tab-charts"
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 relative ${
              activeTab === 'charts'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
            <span>Gráficos Seaborn</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="tab-code"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'code'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Código Python (.py)</span>
          </button>

          <button
            id="tab-runner"
            onClick={() => setActiveTab('runner')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'runner'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal Python & Testes</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-how-to-run"
            onClick={onOpenHowToRun}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
          >
            Como Rodar
          </button>
          <button
            id="btn-download-all"
            onClick={onDownloadAll}
            className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-sm shadow-orange-600/30 flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar Pacote .py</span>
            <span className="sm:hidden">Baixar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
