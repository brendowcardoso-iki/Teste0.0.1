import React, { useState, useEffect, useCallback } from 'react';
import { HistoryEntry, SeabornChartResponse, SeabornChartType, SeabornPalette, SeabornStyle } from '../types';
import {
  BarChart3,
  LineChart,
  PieChart,
  Download,
  RotateCw,
  Code,
  CheckCircle2,
  Sparkles,
  Layers,
  FileDown,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SeabornChartViewerProps {
  history: HistoryEntry[];
  onAddSampleHistory?: () => void;
  onClose?: () => void;
}

export const SeabornChartViewer: React.FC<SeabornChartViewerProps> = ({
  history,
  onAddSampleHistory,
}) => {
  const [chartType, setChartType] = useState<SeabornChartType>('line');
  const [palette, setPalette] = useState<SeabornPalette>('mako');
  const [style, setStyle] = useState<SeabornStyle>('darkgrid');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<SeabornChartResponse | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchChart = useCallback(async () => {
    if (!history || history.length === 0) {
      setChartData(null);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-seaborn-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history,
          chartType,
          palette,
          style,
          title: 'Análise do Histórico de Cálculos',
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Erro HTTP ${res.status}`);
      }

      const data: SeabornChartResponse = await res.json();
      setChartData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao gerar o gráfico com Seaborn.');
    } finally {
      setLoading(false);
    }
  }, [history, chartType, palette, style]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  const handleDownloadImage = () => {
    if (!chartData?.imageBase64) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${chartData.imageBase64}`;
    link.download = `grafico_calculadora_seaborn_${chartType}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPythonCode = () => {
    if (!chartData?.pythonCode) return;
    const blob = new Blob([chartData.pythonCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gerar_grafico_seaborn.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-5 animate-in fade-in duration-200">
      {/* Top Banner Confirming Explicit Seaborn Usage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-zinc-100 flex items-center space-x-2">
              <span>Gráfico do Histórico de Contas</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Biblioteca Seaborn v0.12.2 Utilizada</span>
              </span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Renderizado pelo interpretador Python 3 no servidor usando o módulo nativo{' '}
            <code className="px-1.5 py-0.5 rounded bg-zinc-950 text-orange-400 font-mono text-[11px] border border-zinc-800">
              import seaborn as sns
            </code>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {chartData?.imageBase64 && (
            <button
              id="btn-download-chart-png"
              onClick={handleDownloadImage}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
              title="Baixar imagem PNG de alta resolução gerada pelo Seaborn"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar PNG</span>
            </button>
          )}

          <button
            id="btn-refresh-seaborn-chart"
            onClick={fetchChart}
            disabled={loading}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-50 transition-colors"
            title="Recalcular e regenerar gráfico"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Chart Configuration Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 text-xs">
        {/* Chart Type */}
        <div className="space-y-1">
          <label className="text-zinc-400 font-medium flex items-center space-x-1.5">
            <LineChart className="w-3.5 h-3.5 text-orange-400" />
            <span>Tipo de Gráfico (Seaborn):</span>
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as SeabornChartType)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            <option value="line">📈 Evolução Temporal (sns.lineplot)</option>
            <option value="bar">📊 Comparativo de Contas (sns.barplot)</option>
            <option value="dist">📉 Distribuição & Curva KDE (sns.histplot)</option>
            <option value="operators">🔢 Frequência de Operações (sns.countplot)</option>
            <option value="box">📦 Dispersão & Quartis (sns.boxplot)</option>
          </select>
        </div>

        {/* Color Palette */}
        <div className="space-y-1">
          <label className="text-zinc-400 font-medium flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Paleta Seaborn:</span>
          </label>
          <select
            value={palette}
            onChange={(e) => setPalette(e.target.value as SeabornPalette)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            <option value="mako">Mako (Azul Oceânico / Ciano)</option>
            <option value="viridis">Viridis (Verde / Amarelo Científico)</option>
            <option value="rocket">Rocket (Laranja / Roxo Escuro)</option>
            <option value="crest">Crest (Verde Água Suave)</option>
            <option value="flare">Flare (Rosa & Laranja Vibrante)</option>
          </select>
        </div>

        {/* Theme Style */}
        <div className="space-y-1">
          <label className="text-zinc-400 font-medium flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Estilo Seaborn (sns.set_theme):</span>
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as SeabornStyle)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-orange-500"
          >
            <option value="darkgrid">Darkgrid (Grade Escura Moderna)</option>
            <option value="dark">Dark (Fundo Escuro Liso)</option>
            <option value="whitegrid">Whitegrid (Grade de Alto Contraste)</option>
            <option value="ticks">Ticks (Marcadores nos Eixos)</option>
          </select>
        </div>
      </div>

      {/* Main Chart Graphic Display */}
      <div className="relative min-h-[300px] flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden p-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-12 text-zinc-400">
            <RotateCw className="w-8 h-8 animate-spin text-orange-500" />
            <div className="text-center">
              <p className="text-xs font-semibold text-zinc-200">Executando script Python com Seaborn...</p>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                sns.{chartType === 'line' ? 'lineplot' : chartType === 'bar' ? 'barplot' : chartType === 'dist' ? 'histplot' : chartType === 'operators' ? 'countplot' : 'boxplot'}() em processamento
              </p>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="text-center py-10 px-4 space-y-2">
            <div className="inline-flex p-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
            {onAddSampleHistory && (
              <button
                onClick={onAddSampleHistory}
                className="mt-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
              >
                Inserir Contas de Exemplo
              </button>
            )}
          </div>
        ) : chartData?.imageBase64 ? (
          <div className="w-full flex flex-col items-center">
            <img
              src={`data:image/png;base64,${chartData.imageBase64}`}
              alt="Gráfico Estatístico do Histórico com Seaborn"
              className="w-full max-h-[460px] object-contain rounded-lg shadow-lg border border-zinc-900"
            />
            <div className="mt-2 flex items-center justify-between w-full px-2 text-[11px] text-zinc-500 font-mono">
              <span>Plot gerado em {chartData.duration}ms na JVM/Python 3</span>
              <span>DPI 130 • Matplotlib + Seaborn v{chartData.libraryInfo.version}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-4 space-y-3">
            <BarChart3 className="w-8 h-8 text-zinc-600 mx-auto" />
            <div>
              <p className="text-xs font-medium text-zinc-300">Nenhum cálculo registrado ainda</p>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto mt-1">
                Realize contas no teclado da calculadora ou clique no botão abaixo para gerar dados de exemplo e visualizar o gráfico Seaborn.
              </p>
            </div>
            {onAddSampleHistory && (
              <button
                onClick={onAddSampleHistory}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Preencher com 6 Contas de Teste</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Analytical Statistics Row (Generated via Pandas + Seaborn) */}
      {chartData?.stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono">Total de Contas</span>
            <span className="text-sm font-bold text-zinc-100">{chartData.stats.total}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono">Média</span>
            <span className="text-sm font-bold text-orange-400">{chartData.stats.mean}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono">Valor Máximo</span>
            <span className="text-sm font-bold text-emerald-400">{chartData.stats.max}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono">Valor Mínimo</span>
            <span className="text-sm font-bold text-sky-400">{chartData.stats.min}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-zinc-500 block uppercase font-mono">Soma dos Resultados</span>
            <span className="text-sm font-bold text-purple-400">{chartData.stats.sum}</span>
          </div>
        </div>
      )}

      {/* Accordion: "Mostre se você usou essa biblioteca igual eu pedi" */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/50">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/40 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-orange-400" />
            <span>Código Python que Gerou o Gráfico (Confirmação do uso do Seaborn)</span>
          </div>
          <div className="flex items-center space-x-2 text-zinc-400">
            <span className="text-[11px] font-normal text-zinc-500">
              {showCode ? 'Ocultar código' : 'Ver script com import seaborn as sns'}
            </span>
            {showCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showCode && (
          <div className="p-4 border-t border-zinc-800 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>import seaborn as sns • Executado diretamente na JVM / Python 3</span>
              </span>
              <button
                onClick={handleDownloadPythonCode}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center space-x-1"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Salvar script .py</span>
              </button>
            </div>

            <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-72 leading-relaxed select-all">
              {chartData?.pythonCode || `# Carregando código Seaborn...`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
