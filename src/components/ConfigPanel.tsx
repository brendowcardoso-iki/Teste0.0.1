import React from 'react';
import { CalculatorConfig, ColorTheme } from '../types';
import { Settings2, Palette, Hash, Sliders } from 'lucide-react';

interface ConfigPanelProps {
  config: CalculatorConfig;
  onChange: (newConfig: CalculatorConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const themes: { id: ColorTheme; label: string; color: string }[] = [
    { id: 'dark', label: 'Dark Charcoal', color: '#18181b' },
    { id: 'light', label: 'Light Modern', color: '#e4e4e7' },
    { id: 'cyber', label: 'Cyber Slate', color: '#0f172a' },
    { id: 'emerald', label: 'Emerald Dark', color: '#064e3b' },
  ];

  return (
    <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/80 p-4 space-y-4">
      <div className="flex items-center space-x-2 border-b border-zinc-800/80 pb-2.5">
        <Settings2 className="w-4 h-4 text-orange-400" />
        <h2 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
          Configurações do Gerador
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Title Input */}
        <div>
          <label className="block text-zinc-400 font-medium mb-1.5 flex items-center space-x-1.5">
            <span>Título da Aplicação</span>
          </label>
          <input
            id="input-title"
            type="text"
            value={config.title}
            onChange={(e) => onChange({ ...config, title: e.target.value })}
            placeholder="Ex: Minha Calculadora Python & Seaborn"
            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Color Theme */}
        <div>
          <label className="block text-zinc-400 font-medium mb-1.5 flex items-center space-x-1.5">
            <Palette className="w-3.5 h-3.5 text-zinc-400" />
            <span>Tema Visual</span>
          </label>
          <div className="flex items-center space-x-1.5">
            {themes.map((t) => (
              <button
                key={t.id}
                id={`btn-theme-${t.id}`}
                onClick={() => onChange({ ...config, theme: t.id })}
                className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-medium flex items-center justify-center space-x-1.5 transition-all ${
                  config.theme === t.id
                    ? 'bg-zinc-800 border-orange-500 text-white shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
                title={t.label}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-zinc-600 inline-block"
                  style={{ backgroundColor: t.color }}
                />
                <span className="truncate">{t.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Decimal Precision */}
        <div>
          <label className="block text-zinc-400 font-medium mb-1.5 flex items-center space-x-1.5">
            <Hash className="w-3.5 h-3.5 text-zinc-400" />
            <span>Casas Decimais ({config.precision})</span>
          </label>
          <div className="flex items-center space-x-1">
            {[2, 4, 6, 8].map((prec) => (
              <button
                key={prec}
                id={`btn-prec-${prec}`}
                onClick={() => onChange({ ...config, precision: prec })}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                  config.precision === prec
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {prec}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Option depending on type */}
        {config.type === 'programmer' ? (
          <div>
            <label className="block text-zinc-400 font-medium mb-1.5 flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span>Largura de Bits ({config.programmerBits}b)</span>
            </label>
            <div className="flex items-center space-x-1">
              {([8, 16, 32, 64] as const).map((b) => (
                <button
                  key={b}
                  id={`btn-bits-${b}`}
                  onClick={() => onChange({ ...config, programmerBits: b })}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                    config.programmerBits === b
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-zinc-400 font-medium mb-1.5 flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span>Unidade Angular</span>
            </label>
            <div className="flex items-center space-x-1">
              {(['deg', 'rad'] as const).map((mode) => (
                <button
                  key={mode}
                  id={`btn-angle-${mode}`}
                  onClick={() => onChange({ ...config, angleMode: mode })}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium uppercase transition-colors ${
                    config.angleMode === mode
                      ? 'bg-sky-500/20 border-sky-500 text-sky-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {mode === 'deg' ? 'Graus (DEG)' : 'Radianos (RAD)'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
