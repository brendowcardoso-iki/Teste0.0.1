import { useState, useMemo, useEffect } from 'react';
import { CalculatorConfig, CalculatorType, PythonRunResult, HistoryEntry } from './types';
import { CALCULATOR_TEMPLATES, generatePythonCode } from './data/templates';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { ConfigPanel } from './components/ConfigPanel';
import { CalculatorSimulator } from './components/CalculatorSimulator';
import { CodeViewer } from './components/CodeViewer';
import { PythonRunner } from './components/PythonRunner';
import { SeabornChartViewer } from './components/SeabornChartViewer';
import { HowToRunModal } from './components/HowToRunModal';
import { Sparkles, Code2, Terminal, Layers, BarChart3, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'python_calculator_history';

// Dados de exemplo ricos para que o usuário veja imediatamente o gráfico Seaborn
const SAMPLE_HISTORY: HistoryEntry[] = [
  { id: '1', expression: '15 * 4', result: '60', timestamp: new Date(Date.now() - 3600000 * 5) },
  { id: '2', expression: '120 / 3', result: '40', timestamp: new Date(Date.now() - 3600000 * 4) },
  { id: '3', expression: 'sqrt(144)', result: '12', timestamp: new Date(Date.now() - 3600000 * 3) },
  { id: '4', expression: '2 ** 8', result: '256', timestamp: new Date(Date.now() - 3600000 * 2) },
  { id: '5', expression: 'sin(45) * 10', result: '7.07', timestamp: new Date(Date.now() - 3600000) },
  { id: '6', expression: '180 - 45', result: '135', timestamp: new Date() },
];

export default function App() {
  const [config, setConfig] = useState<CalculatorConfig>({
    type: 'gui_standard',
    title: 'Calculadora Python & Seaborn',
    theme: 'dark',
    precision: 6,
    enableHistory: true,
    enableMemory: true,
    angleMode: 'deg',
    programmerBits: 32,
  });

  // Histórico persistente no localStorage (não atualiza/perde dados ao recarregar)
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp || Date.now()),
          }));
        }
      }
    } catch {
      // ignore
    }
    return SAMPLE_HISTORY;
  });

  // Salva no localStorage sempre que o histórico mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const [activeTab, setActiveTab] = useState<'simulator' | 'charts' | 'code' | 'runner'>('simulator');
  const [showHowToRun, setShowHowToRun] = useState<boolean>(false);
  const [activeRunnerCode, setActiveRunnerCode] = useState<string>('');

  // Encontra o template ativo
  const activeTemplate = useMemo(() => {
    return (
      CALCULATOR_TEMPLATES.find((t) => t.id === config.type) ||
      CALCULATOR_TEMPLATES[0]
    );
  }, [config.type]);

  // Código Python gerado dinamicamente com base nas configurações
  const generatedCode = useMemo(() => {
    return generatePythonCode(config);
  }, [config]);

  // Troca de modelo
  const handleSelectTemplate = (type: CalculatorType) => {
    const tmpl = CALCULATOR_TEMPLATES.find((t) => t.id === type);
    setConfig((prev) => ({
      ...prev,
      type,
      title: tmpl ? tmpl.name : prev.title,
    }));
  };

  // Executa código Python no servidor backend
  const handleRunPython = async (
    codeToRun: string = generatedCode,
    input: string = ''
  ): Promise<PythonRunResult | null> => {
    try {
      const response = await fetch('/api/run-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToRun, input }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return {
          success: false,
          stdout: '',
          stderr: errData.error || `Erro HTTP ${response.status}`,
          exitCode: 1,
          duration: 0,
        };
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        stdout: '',
        stderr: err.message || 'Falha na requisição ao servidor Python.',
        exitCode: 1,
        duration: 0,
      };
    }
  };

  // Abre a aba do terminal com código customizado
  const handleExecuteInPython = (customCode?: string) => {
    if (customCode) {
      setActiveRunnerCode(customCode);
    } else {
      setActiveRunnerCode(generatedCode);
    }
    setActiveTab('runner');
  };

  // Adiciona amostras de histórico
  const handleAddSampleHistory = () => {
    setHistory(SAMPLE_HISTORY);
  };

  // Download de todas as calculadoras Python (.py)
  const handleDownloadAll = () => {
    CALCULATOR_TEMPLATES.forEach((tmpl, idx) => {
      setTimeout(() => {
        const code = generatePythonCode({
          ...config,
          type: tmpl.id,
          title: tmpl.name,
        });
        const blob = new Blob([code], { type: 'text/x-python;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = tmpl.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, idx * 250);
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      <Header
        onDownloadAll={handleDownloadAll}
        onOpenHowToRun={() => setShowHowToRun(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Template Selector */}
        <TemplateSelector
          selectedType={config.type}
          onSelect={handleSelectTemplate}
        />

        {/* Configuration Controls */}
        <ConfigPanel config={config} onChange={setConfig} />

        {/* Tabs Bar on Mobile & Tablet */}
        <div className="grid grid-cols-4 md:hidden gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
              activeTab === 'simulator'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">Simulador</span>
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
              activeTab === 'charts'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
            <span className="truncate">Seaborn</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
              activeTab === 'code'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="truncate">Código .py</span>
          </button>
          <button
            onClick={() => setActiveTab('runner')}
            className={`py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
              activeTab === 'runner'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">Terminal</span>
          </button>
        </div>

        {/* Main Workspace Display */}
        {activeTab === 'simulator' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs text-zinc-400">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>
                  Visualização interativa do modelo{' '}
                  <strong className="text-zinc-200">{activeTemplate.name}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <button
                  onClick={() => setActiveTab('charts')}
                  className="text-orange-400 hover:text-orange-300 flex items-center space-x-1.5 font-medium"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Ver Gráficos do Histórico (Seaborn)</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className="text-zinc-400 hover:text-zinc-200 flex items-center space-x-1"
                >
                  <span>Código Python</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <CalculatorSimulator
              config={config}
              history={history}
              onHistoryChange={setHistory}
              onOpenCharts={() => setActiveTab('charts')}
              onExecuteInPython={() => handleExecuteInPython()}
            />
          </div>
        )}

        {/* Seaborn Chart View */}
        {activeTab === 'charts' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs text-zinc-400">
                <BarChart3 className="w-4 h-4 text-orange-400" />
                <span>
                  Visualização analítica e estatística gerada via biblioteca{' '}
                  <strong className="text-zinc-200">Seaborn (Python)</strong>
                </span>
              </div>
              <button
                onClick={() => setActiveTab('simulator')}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center space-x-1"
              >
                <span>← Voltar para o Simulador de Cálculos</span>
              </button>
            </div>

            <SeabornChartViewer
              history={history}
              onAddSampleHistory={handleAddSampleHistory}
            />
          </div>
        )}

        {/* Python Code View */}
        {activeTab === 'code' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-zinc-400">
                Arquivo Python gerado em tempo real com as suas configurações:
              </div>
              <button
                onClick={() => handleExecuteInPython()}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                <span>Executar este código no Terminal Python 3</span>
                <span>→</span>
              </button>
            </div>

            <CodeViewer
              code={generatedCode}
              filename={activeTemplate.filename}
              onExecute={() => handleExecuteInPython()}
            />
          </div>
        )}

        {/* Python Runner View */}
        {activeTab === 'runner' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="text-xs text-zinc-400">
              Ambiente de execução Python 3.10 com Seaborn instalado no container backend:
            </div>
            <PythonRunner
              currentCode={activeRunnerCode || generatedCode}
              filename={activeTemplate.filename}
              onRunCode={handleRunPython}
            />
          </div>
        )}

        {/* Quick Footer / Reference Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-900 text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
            <div className="font-semibold text-zinc-200 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span>Biblioteca Seaborn Integrada</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              O Seaborn processa o histórico de contas via DataFrame do Pandas e gera gráficos estilizados (<code className="text-zinc-300">sns.lineplot</code>, <code className="text-zinc-300">sns.barplot</code>, <code className="text-zinc-300">sns.histplot</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
            <div className="font-semibold text-zinc-200 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Python 3.10 Ativo</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Ambiente com Python 3 e pacotes científicos instalados. Execute os scripts diretamente no terminal ou pelo botão "Rodar no Python 3".
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
            <div className="font-semibold text-zinc-200 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Script Gerador de Calculadoras</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Rode <code className="text-zinc-200">python3 calculator_generator.py</code> no terminal para gerar todos os 5 modelos prontos em arquivos .py.
            </p>
          </div>
        </div>
      </main>

      {/* How to Run Modal */}
      <HowToRunModal
        isOpen={showHowToRun}
        onClose={() => setShowHowToRun(false)}
      />
    </div>
  );
}
