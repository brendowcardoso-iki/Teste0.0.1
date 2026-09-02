import React from 'react';
import { CALCULATOR_TEMPLATES } from '../data/templates';
import { CalculatorType } from '../types';
import { Layout, FlaskConical, Terminal, Box, Binary } from 'lucide-react';

interface TemplateSelectorProps {
  selectedType: CalculatorType;
  onSelect: (type: CalculatorType) => void;
}

const ICONS: Record<CalculatorType, React.ReactNode> = {
  gui_standard: <Layout className="w-5 h-5 text-amber-400" />,
  gui_scientific: <FlaskConical className="w-5 h-5 text-sky-400" />,
  cli_interactive: <Terminal className="w-5 h-5 text-emerald-400" />,
  oop_engine: <Box className="w-5 h-5 text-purple-400" />,
  programmer: <Binary className="w-5 h-5 text-pink-400" />,
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Modelos de Calculadora
        </label>
        <span className="text-[11px] text-zinc-500">
          5 tipos prontos para Python 3 & Seaborn
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {CALCULATOR_TEMPLATES.map((tmpl) => {
          const isSelected = tmpl.id === selectedType;
          return (
            <button
              key={tmpl.id}
              id={`select-template-${tmpl.id}`}
              onClick={() => onSelect(tmpl.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-orange-500/80 ring-1 ring-orange-500/40 shadow-md shadow-orange-950/20'
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 text-zinc-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/80">
                    {ICONS[tmpl.id]}
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                    {tmpl.badge}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-zinc-100 mb-1 leading-tight">
                  {tmpl.name}
                </h3>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="font-mono text-amber-400/90">{tmpl.filename}</span>
                <span className="text-zinc-400">{tmpl.category}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
