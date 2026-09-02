import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Play, CheckCircle2 } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  filename: string;
  onExecute: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, filename, onExecute }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Split lines for line numbers
  const lines = code.split('\n');
  const hasSeaborn = code.includes('import seaborn as sns') || code.includes('sns.');

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Code Header Bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <FileCode className="w-4 h-4 text-sky-400" />
          <span className="font-mono text-xs font-semibold text-zinc-200">
            {filename}
          </span>
          <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
            {lines.length} linhas
          </span>
          {hasSeaborn && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>Seaborn Incluído</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="btn-copy-code"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center space-x-1.5 transition-colors"
            title="Copiar código para a área de transferência"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copiar Código</span>
              </>
            )}
          </button>

          <button
            id="btn-download-python"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-colors"
            title="Baixar arquivo .py pronto para execução"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar {filename}</span>
          </button>

          <button
            id="btn-run-code"
            onClick={onExecute}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-colors"
            title="Executar no interpretador Python 3"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Executar no Python</span>
          </button>
        </div>
      </div>

      {/* Code Text Display with Line Numbers */}
      <div className="flex-1 max-h-[620px] overflow-auto text-xs font-mono bg-zinc-950 p-4 scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="flex">
          {/* Line Numbers Column */}
          <div className="select-none text-zinc-400 text-right pr-4 border-r border-zinc-800/80 mr-4 font-mono text-[11px] leading-relaxed">
            {lines.map((_, i) => (
              <div key={i} className="h-5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Syntax Code Column with Seaborn Highlights */}
          <div className="flex-1 text-zinc-200 overflow-x-auto leading-relaxed text-[11px]">
            {lines.map((line, idx) => {
              const isSeabornLine =
                line.includes('import seaborn as sns') ||
                line.includes('sns.set_theme') ||
                line.includes('sns.lineplot') ||
                line.includes('sns.barplot') ||
                line.includes('sns.histplot');

              return (
                <div
                  key={idx}
                  className={`h-5 whitespace-pre ${
                    isSeabornLine
                      ? 'bg-emerald-500/10 text-emerald-300 font-semibold px-1 rounded'
                      : ''
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
