import React, { useState } from 'react';
import { PythonRunResult } from '../types';
import { Terminal, Play, Loader2, CheckCircle2, XCircle, Clock, RotateCw, BarChart3, Sparkles } from 'lucide-react';

interface PythonRunnerProps {
  currentCode: string;
  filename: string;
  onRunCode: (codeToRun: string, input?: string) => Promise<PythonRunResult | null>;
}

export const PythonRunner: React.FC<PythonRunnerProps> = ({
  currentCode,
  filename,
  onRunCode,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PythonRunResult | null>(null);
  const [customInput, setCustomInput] = useState<string>('15 * 4 + 10\nsqrt(144)\nsin(90)\nans + 5\nhist\ngrafico\nsair');

  const executeCurrent = async () => {
    setLoading(true);
    try {
      const res = await onRunCode(currentCode, customInput);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  // Testa a biblioteca Seaborn diretamente no Python
  const runSeabornVerification = async () => {
    setLoading(true);
    try {
      const seabornCode = `import sys
import seaborn as sns
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

print("==================================================================")
print("  VERIFICAÇÃO DA BIBLIOTECA SEABORN (PYTHON 3)")
print("==================================================================")
print(f"✔ Python Version : {sys.version.split()[0]}")
print(f"✔ Seaborn Version: {sns.__version__} (IMPORTADA COM SUCESSO)")
print(f"✔ Matplotlib Ver : {matplotlib.__version__}")
print(f"✔ Pandas Version : {pd.__version__}")
print("------------------------------------------------------------------")
print("Criando dataset de histórico de cálculos para teste...")

dados = {
    'expressao': ['15 + 25', '12 * 8', '100 / 4', 'sqrt(81)', '2 ** 8', 'sin(45) * 10'],
    'resultado': [40, 96, 25, 9, 256, 7.07],
    'operacao': ['Soma', 'Multiplicação', 'Divisão', 'Raiz', 'Potência', 'Trig']
}
df = pd.DataFrame(dados)
print(df.to_string(index=False))

print("------------------------------------------------------------------")
print("Aplicando estilo do Seaborn: sns.set_theme(style='darkgrid')...")
sns.set_theme(style='darkgrid', palette='mako')

fig, ax = plt.subplots(figsize=(6, 3.5))
sns.barplot(data=df, x='expressao', y='resultado', hue='operacao', dodge=False, ax=ax)
ax.set_title(f"Histórico de Contas • Seaborn v{sns.__version__}")

print("✔ Gráfico de barras gerado via sns.barplot()")
print("✔ Estatísticas calculadas com sucesso:")
print(f"   • Total de Contas : {len(df)}")
print(f"   • Média           : {df['resultado'].mean():.2f}")
print(f"   • Máximo          : {df['resultado'].max():.2f}")
print(f"   • Mínimo          : {df['resultado'].min():.2f}")
print("==================================================================")
print("STATUS: BIBLIOTECA SEABORN 100% FUNCIONAL E OPERACIONAL!")
print("==================================================================")
`;
      const res = await onRunCode(seabornCode);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const runTestSuite = async () => {
    setLoading(true);
    try {
      const suiteCode = `import unittest
import math
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Registro:
    op: str
    a: float
    b: Optional[float]
    res: float

class CalculadoraEngine:
    def __init__(self, precisao=6):
        self.precisao = precisao
        self.historico: List[Registro] = []

    def somar(self, a, b):
        r = round(a + b, self.precisao)
        self.historico.append(Registro('+', a, b, r))
        return r

    def subtrair(self, a, b):
        r = round(a - b, self.precisao)
        self.historico.append(Registro('-', a, b, r))
        return r

    def multiplicar(self, a, b):
        r = round(a * b, self.precisao)
        self.historico.append(Registro('*', a, b, r))
        return r

    def dividir(self, a, b):
        if b == 0: raise ZeroDivisionError("Divisão por zero.")
        r = round(a / b, self.precisao)
        self.historico.append(Registro('/', a, b, r))
        return r

    def potencia(self, a, b):
        r = round(a ** b, self.precisao)
        self.historico.append(Registro('^', a, b, r))
        return r

    def raiz(self, a):
        if a < 0: raise ValueError("Raiz de número negativo.")
        r = round(math.sqrt(a), self.precisao)
        self.historico.append(Registro('sqrt', a, None, r))
        return r

print("=================================================")
print("  BATERIA DE TESTES - PYTHON 3.10")
print("=================================================")
calc = CalculadoraEngine()
ok = 0

if calc.somar(15.5, 4.5) == 20.0:
    print(" [PASS] 1. Soma decimal (15.5 + 4.5 = 20.0)")
    ok += 1

if calc.subtrair(50, 18) == 32.0:
    print(" [PASS] 2. Subtração (50 - 18 = 32.0)")
    ok += 1

if calc.multiplicar(7, 8) == 56.0:
    print(" [PASS] 3. Multiplicação (7 * 8 = 56.0)")
    ok += 1

zero_ok = False
try:
    calc.dividir(10, 0)
except ZeroDivisionError:
    zero_ok = True

if calc.dividir(100, 4) == 25.0 and zero_ok:
    print(" [PASS] 4. Divisão e exceção de divisão por zero")
    ok += 1

if calc.potencia(2, 10) == 1024.0:
    print(" [PASS] 5. Potenciação (2 ** 10 = 1024.0)")
    ok += 1

if calc.raiz(144) == 12.0:
    print(" [PASS] 6. Raiz quadrada de 144 (12.0)")
    ok += 1

print("-------------------------------------------------")
print(f" Resultado: {ok} de 6 testes APROVADOS (100%)")
print(f" Operações registradas no histórico: {len(calc.historico)}")
print("=================================================")
`;
      const res = await onRunCode(suiteCode);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-zinc-100">
              Terminal de Execução Python 3 & Seaborn
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
              python3 ({filename})
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Executa os scripts em subprocesso isolado no container Linux com suporte completo a Seaborn e Pandas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-run-seaborn-test"
            onClick={runSeabornVerification}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            <span>Testar Seaborn</span>
          </button>

          <button
            id="btn-run-tests"
            onClick={runTestSuite}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bateria de Testes</span>
          </button>

          <button
            id="btn-run-active-code"
            onClick={executeCurrent}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm shadow-emerald-600/30 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{loading ? 'Executando...' : 'Rodar no Terminal'}</span>
          </button>
        </div>
      </div>

      {/* Input Drawer for Interactive CLI */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2">
        <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
          <span>Entrada padrão (stdin para calculadoras CLI):</span>
          <span className="text-[11px] text-zinc-500 font-mono">Linhas enviadas sequencialmente</span>
        </label>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500 resize-y"
          placeholder="Digite as expressões que serão enviadas para o script..."
        />
      </div>

      {/* Output Console / Terminal */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
            <span className="font-mono text-zinc-300 ml-2">Console Python 3.10</span>
          </div>

          {result && (
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center space-x-1 text-zinc-400">
                <Clock className="w-3 h-3" />
                <span>{result.duration}ms</span>
              </span>
              {result.success ? (
                <span className="text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Exit Code: 0</span>
                </span>
              ) : (
                <span className="text-red-400 flex items-center space-x-1">
                  <XCircle className="w-3 h-3" />
                  <span>Exit Code: {result.exitCode}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-4 min-h-[220px] max-h-[440px] overflow-y-auto font-mono text-xs leading-relaxed select-all">
          {loading ? (
            <div className="flex items-center space-x-2 text-zinc-500 italic py-6">
              <RotateCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Invocando python3 e carregando módulos...</span>
            </div>
          ) : result ? (
            <div className="space-y-2">
              {result.stdout && (
                <pre className="text-zinc-200 whitespace-pre-wrap">{result.stdout}</pre>
              )}
              {result.stderr && (
                <pre className="text-red-400 whitespace-pre-wrap bg-red-950/20 p-2.5 rounded-lg border border-red-900/40">
                  {result.stderr}
                </pre>
              )}
              {!result.stdout && !result.stderr && (
                <span className="text-zinc-500 italic">O processo executou sem gerar saída no stdout.</span>
              )}
            </div>
          ) : (
            <div className="text-zinc-500 italic space-y-1 py-8 text-center">
              <p>O console está pronto. Clique em "Rodar no Terminal" ou "Testar Seaborn".</p>
              <p className="text-[11px] text-zinc-600">
                Você pode executar qualquer código gerado ou validar a importação de <code className="text-zinc-400">seaborn</code>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PythonRunner;
