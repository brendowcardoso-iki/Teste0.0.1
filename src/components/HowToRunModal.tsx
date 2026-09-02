import React from 'react';
import { X, Terminal, Monitor, Cpu, Check, BarChart3, Code2 } from 'lucide-react';

interface HowToRunModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToRunModal: React.FC<HowToRunModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            <span>Como Executar as Calculadoras Python com Gráficos Seaborn</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Guia rápido para rodar localmente no Windows, macOS ou Linux com Python 3.8+
          </p>
        </div>

        {/* Section 0: Seaborn Installation */}
        <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-orange-400 font-semibold text-xs">
            <BarChart3 className="w-4 h-4" />
            <span>0. Instalação da Biblioteca Seaborn (e dependências gráficas)</span>
          </div>
          <p className="text-xs text-zinc-300">
            Para gerar os gráficos estatísticos do histórico das contas, instale o Seaborn via pip:
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-950 font-mono text-[11px] text-orange-300 select-all border border-zinc-800">
            pip install seaborn matplotlib pandas
          </div>
          <p className="text-[11px] text-zinc-400">
            O Seaborn utiliza o Matplotlib e Pandas para criar gráficos com temas estatísticos sofisticados (mako, viridis, rocket).
          </p>
        </div>

        {/* Section 1: Python Desktop Tkinter GUI */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs">
            <Monitor className="w-4 h-4" />
            <span>1. Interface Gráfica Tkinter (Desktop GUI)</span>
          </div>
          <p className="text-xs text-zinc-300">
            Abra a calculadora gráfica completa com botão integrado para visualizar gráficos Seaborn:
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-900 font-mono text-[11px] text-emerald-400 select-all border border-zinc-800">
            python3 calculadora_gui.py
          </div>
          <p className="text-[11px] text-zinc-400">
            Ao realizar cálculos, clique no botão "Gráficos Seaborn" na janela para plotar a evolução temporal ou distribuição das contas!
          </p>
        </div>

        {/* Section 2: Terminal CLI */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
            <Terminal className="w-4 h-4" />
            <span>2. Terminal CLI Interativo (REPL com Seaborn)</span>
          </div>
          <p className="text-xs text-zinc-300">
            Executa em qualquer terminal com parser de expressões e comando <code className="text-zinc-200">grafico</code>:
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-900 font-mono text-[11px] text-emerald-400 select-all border border-zinc-800">
            python3 calculadora_cli.py
          </div>
          <p className="text-[11px] text-zinc-400">
            Dentro do prompt, digite <code className="text-orange-400">grafico</code> a qualquer momento para abrir a janela do Seaborn com a análise do histórico.
          </p>
        </div>

        {/* Section 3: Generator CLI */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-sky-400 font-semibold text-xs">
            <Cpu className="w-4 h-4" />
            <span>3. Script Gerador Modular (Python)</span>
          </div>
          <p className="text-xs text-zinc-300">
            Gera todos os modelos de calculadoras simultaneamente em arquivos .py:
          </p>
          <div className="p-2.5 rounded-lg bg-zinc-900 font-mono text-[11px] text-emerald-400 select-all border border-zinc-800">
            python3 calculator_generator.py --tipo all
          </div>
        </div>

        {/* Features Checklist */}
        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
          <div className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gráficos nativos com Seaborn e Pandas</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compatível com Python 3.8, 3.9, 3.10, 3.11, 3.12</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Suporte a Tkinter e CLI com histórico</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Arquitetura orientada a objetos (POO)</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
          >
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
