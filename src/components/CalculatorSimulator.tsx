import React, { useState, useEffect } from 'react';
import { CalculatorConfig, HistoryEntry } from '../types';
import { RotateCcw, Delete, History, Play, Terminal, CheckCircle2, BarChart3 } from 'lucide-react';

interface CalculatorSimulatorProps {
  config: CalculatorConfig;
  onExecuteInPython: (customCode?: string) => void;
  onExecuteInJava?: (customCode?: string) => void;
  history?: HistoryEntry[];
  onHistoryChange?: (updater: HistoryEntry[] | ((prev: HistoryEntry[]) => HistoryEntry[])) => void;
  onOpenCharts?: () => void;
}

export const CalculatorSimulator: React.FC<CalculatorSimulatorProps> = ({
  config,
  onExecuteInPython,
  onExecuteInJava,
  history: propHistory,
  onHistoryChange,
  onOpenCharts,
}) => {
  const handleRunExecution = onExecuteInPython || onExecuteInJava;

  // Standard / Scientific State
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [memory, setMemory] = useState<number>(0);
  const [localHistory, setLocalHistory] = useState<HistoryEntry[]>([]);
  const history = propHistory ?? localHistory;

  const updateHistory = (updater: HistoryEntry[] | ((prev: HistoryEntry[]) => HistoryEntry[])) => {
    if (onHistoryChange) {
      onHistoryChange(updater);
    } else {
      setLocalHistory(updater);
    }
  };

  const [isDeg, setIsDeg] = useState<boolean>(config.angleMode === 'deg');
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);

  // CLI REPL State
  const [cliInput, setCliInput] = useState<string>('');
  const [cliHistory, setCliHistory] = useState<Array<{ type: 'in' | 'out' | 'err' | 'system'; text: string }>>([
    { type: 'system', text: `==================================================` },
    { type: 'system', text: `CALCULADORA JAVA CLI INTERATIVA (PARSER REPL)` },
    { type: 'system', text: `Digite expressões como: 25 * 4, sqrt(144), sin(90)` },
    { type: 'system', text: `Comandos: hist, m+, mr, mc, ajuda, limpar` },
    { type: 'system', text: `==================================================` },
  ]);

  // Programmer Mode State
  const [progValue, setProgValue] = useState<number>(255);
  const [progInputStr, setProgInputStr] = useState<string>('255');
  const [bitOp, setBitOp] = useState<'AND' | 'OR' | 'XOR'>('AND');
  const [bitOperand, setBitOperand] = useState<number>(15);

  // OOP Engine Test State
  const [oopLogs, setOopLogs] = useState<Array<{ id: string; op: string; a: number; b: number | null; res: number; time: string }>>([]);

  // Sync angle mode when config changes
  useEffect(() => {
    setIsDeg(config.angleMode === 'deg');
  }, [config.angleMode]);

  // Keyboard handler for simulator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process when not typing in inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key);
      } else if (e.key === '.' || e.key === ',') {
        handleDot();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, expression]);

  // Actions for Standard/Scientific
  const handleDigit = (d: string) => {
    if (display === '0' || display === 'Erro' || display === 'Divisão por Zero') {
      setDisplay(d);
    } else {
      setDisplay(display + d);
    }
  };

  const handleDot = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    if (display.length > 1 && display !== '0' && display !== 'Erro') {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleSign = () => {
    try {
      const val = parseFloat(display);
      if (!isNaN(val)) {
        const res = -val;
        setDisplay(formatResult(res));
      }
    } catch {
      // ignore
    }
  };

  const handlePercent = () => {
    try {
      const val = parseFloat(display) / 100;
      setDisplay(formatResult(val));
    } catch {
      // ignore
    }
  };

  const handleOperator = (op: string) => {
    const sym = op === '*' ? '×' : op === '/' ? '÷' : op;
    setExpression(`${display} ${sym}`);
    setDisplay('0');
  };

  const formatResult = (val: number): string => {
    const fixed = parseFloat(val.toFixed(config.precision));
    return fixed.toString();
  };

  const handleEquals = () => {
    if (!expression) return;
    try {
      const parts = expression.trim().split(' ');
      const a = parseFloat(parts[0]);
      const op = parts[1];
      const b = parseFloat(display);

      let res = 0;
      if (op === '+') res = a + b;
      else if (op === '-') res = a - b;
      else if (op === '×' || op === '*') res = a * b;
      else if (op === '÷' || op === '/') {
        if (b === 0) {
          setDisplay('Divisão por Zero');
          setExpression('');
          return;
        }
        res = a / b;
      } else if (op === '^' || op === '**') {
        res = Math.pow(a, b);
      }

      const formatted = formatResult(res);
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        expression: `${a} ${op} ${b}`,
        result: formatted,
        timestamp: new Date(),
      };
      updateHistory((prev) => [newEntry, ...prev]);
      setDisplay(formatted);
      setExpression(`${a} ${op} ${b} =`);
    } catch {
      setDisplay('Erro');
    }
  };

  const handleUnaryMath = (type: string) => {
    try {
      const x = parseFloat(display);
      if (isNaN(x)) return;

      let res = 0;
      if (type === 'sin') {
        const rad = isDeg ? (x * Math.PI) / 180 : x;
        res = Math.sin(rad);
      } else if (type === 'cos') {
        const rad = isDeg ? (x * Math.PI) / 180 : x;
        res = Math.cos(rad);
      } else if (type === 'tan') {
        const rad = isDeg ? (x * Math.PI) / 180 : x;
        res = Math.tan(rad);
      } else if (type === 'sqrt') {
        if (x < 0) {
          setDisplay('Erro: Raiz < 0');
          return;
        }
        res = Math.sqrt(x);
      } else if (type === 'sqr') {
        res = Math.pow(x, 2);
      } else if (type === 'ln') {
        if (x <= 0) {
          setDisplay('Erro: x <= 0');
          return;
        }
        res = Math.log(x);
      } else if (type === 'log10') {
        if (x <= 0) {
          setDisplay('Erro: x <= 0');
          return;
        }
        res = Math.log10(x);
      } else if (type === 'inv') {
        if (x === 0) {
          setDisplay('Divisão por Zero');
          return;
        }
        res = 1 / x;
      } else if (type === 'fact') {
        if (x < 0 || !Number.isInteger(x) || x > 170) {
          setDisplay('Erro: n! inválido');
          return;
        }
        let f = 1;
        for (let i = 2; i <= x; i++) f *= i;
        res = f;
      }

      setDisplay(formatResult(res));
    } catch {
      setDisplay('Erro');
    }
  };

  // CLI REPL Handler
  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim();
    if (!cmd) return;

    setCliHistory((prev) => [...prev, { type: 'in', text: `calc > ${cmd}` }]);
    setCliInput('');

    const lower = cmd.toLowerCase();
    if (lower === 'limpar' || lower === 'clear' || lower === 'cls') {
      setCliHistory([]);
      return;
    }

    if (lower === 'ajuda' || lower === 'help') {
      setCliHistory((prev) => [
        ...prev,
        { type: 'system', text: 'Funções disponíveis: sqrt(x), sin(x), cos(x), tan(x), log(x), ln(x), fact(x), abs(x)' },
        { type: 'system', text: 'Constantes: pi, e, tau | Comandos: hist, m+, mr, mc, limpar' },
      ]);
      return;
    }

    if (lower === 'hist') {
      if (history.length === 0) {
        setCliHistory((prev) => [...prev, { type: 'out', text: 'Nenhum cálculo no histórico.' }]);
      } else {
        history.slice(0, 5).forEach((h, i) => {
          setCliHistory((prev) => [...prev, { type: 'out', text: ` ${i + 1}. ${h.expression} = ${h.result}` }]);
        });
      }
      return;
    }

    if (lower === 'mc') {
      setMemory(0);
      setCliHistory((prev) => [...prev, { type: 'out', text: 'Memória limpa (M = 0)' }]);
      return;
    }

    if (lower === 'mr') {
      setCliHistory((prev) => [...prev, { type: 'out', text: `Memória atual (MR): ${memory}` }]);
      return;
    }

    // Safe mathematical expression evaluator in client
    try {
      // Replace safe math functions and constants
      const cleanExpr = cmd
        .replace(/pi/gi, String(Math.PI))
        .replace(/e/gi, String(Math.E))
        .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
        .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
        .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
        .replace(/\^/g, '**');

      // Restrict characters
      if (/[^0-9+\-*/().%*\sMath.sqrtaincolgeE]/.test(cleanExpr)) {
        throw new Error('Caractere ou função não permitida');
      }

      // eslint-disable-next-line no-eval
      const evalRes = Function(`"use strict"; return (${cleanExpr})`)();
      const formatted = formatResult(evalRes);

      setCliHistory((prev) => [...prev, { type: 'out', text: `= ${formatted}` }]);
      updateHistory((prev) => [
        { id: Date.now().toString(), expression: cmd, result: formatted, timestamp: new Date() },
        ...prev,
      ]);
    } catch (err: any) {
      setCliHistory((prev) => [...prev, { type: 'err', text: `Erro: Expressão inválida (${err.message || 'Sintaxe'})` }]);
    }
  };

  // Programmer Bit conversions
  const mask = (1 << config.programmerBits) - 1;
  const clampedVal = (progValue >>> 0) & mask;
  const decStr = clampedVal.toString(10);
  const hexStr = '0x' + clampedVal.toString(16).toUpperCase();
  const octStr = '0o' + clampedVal.toString(8);
  const binRaw = (clampedVal >>> 0).toString(2).padStart(config.programmerBits, '0');
  const binGrouped = binRaw.match(/.{1,4}/g)?.join(' ') || binRaw;

  const handleProgInputChange = (valStr: string) => {
    setProgInputStr(valStr);
    try {
      let num = 0;
      if (valStr.startsWith('0x') || valStr.startsWith('0X')) {
        num = parseInt(valStr, 16);
      } else if (valStr.startsWith('0b') || valStr.startsWith('0B')) {
        num = parseInt(valStr.slice(2), 2);
      } else if (valStr.startsWith('0o') || valStr.startsWith('0O')) {
        num = parseInt(valStr.slice(2), 8);
      } else {
        num = parseInt(valStr, 10);
      }
      if (!isNaN(num)) {
        setProgValue(num);
      }
    } catch {
      // ignore
    }
  };

  // OOP Methods Tester
  const testOopOperation = (op: string, a: number, b: number | null) => {
    let res = 0;
    if (op === '+') res = a + (b ?? 0);
    else if (op === '-') res = a - (b ?? 0);
    else if (op === '*') res = a * (b ?? 1);
    else if (op === '/') res = (b ?? 1) === 0 ? NaN : a / (b ?? 1);
    else if (op === '^') res = Math.pow(a, b ?? 1);
    else if (op === 'sqrt') res = Math.sqrt(a);

    const logEntry = {
      id: Date.now().toString(),
      op,
      a,
      b,
      res: parseFloat(res.toFixed(config.precision)),
      time: new Date().toLocaleTimeString(),
    };
    setOopLogs((prev) => [logEntry, ...prev]);
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Top Simulator Banner */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
          <h2 className="text-sm font-semibold text-zinc-100">
            {config.title || 'Simulador da Calculadora'}
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
            {config.type}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenCharts && (
            <button
              id="btn-open-seaborn-charts"
              onClick={onOpenCharts}
              className="px-2.5 py-1.5 rounded-lg border border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-xs font-medium flex items-center space-x-1.5 transition-colors shadow-sm"
              title="Gerar e visualizar gráfico do histórico com Seaborn (sns.lineplot, sns.barplot, etc.)"
            >
              <BarChart3 className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Gráficos Seaborn</span>
              <span className="sm:hidden">Gráficos</span>
            </button>
          )}

          {['gui_standard', 'gui_scientific'].includes(config.type) && (
            <button
              id="btn-toggle-history"
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 transition-colors ${
                showHistoryDrawer
                  ? 'bg-zinc-800 border-orange-500/80 text-orange-400'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              title="Ver histórico de cálculos"
            >
              <History className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Histórico ({history.length})</span>
            </button>
          )}

          <button
            id="btn-run-python-direct"
            onClick={() => handleRunExecution()}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-all"
            title="Executar no Python 3.10"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Rodar no Python 3</span>
          </button>
        </div>
      </div>

      {/* RENDER ACCORDING TO TEMPLATE TYPE */}
      {config.type === 'gui_standard' && (
        <div className="max-w-xs mx-auto">
          {/* Calculator Chassis */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-2xl">
            {/* Display */}
            <div className="bg-zinc-900 rounded-xl p-3.5 mb-4 border border-zinc-800/80 text-right">
              <div className="text-xs text-zinc-400 h-4 font-mono overflow-hidden text-ellipsis">
                {expression}
              </div>
              <div className="text-3xl font-bold text-zinc-100 font-mono tracking-tight mt-1 overflow-x-auto select-all">
                {display}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
              <button
                onClick={handleClear}
                className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 transition-colors"
              >
                C
              </button>
              <button
                onClick={handleSign}
                className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                +/-
              </button>
              <button
                onClick={handlePercent}
                className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                %
              </button>
              <button
                onClick={() => handleOperator('÷')}
                className="p-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors"
              >
                ÷
              </button>

              {['7', '8', '9'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigit(n)}
                  className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/50 transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleOperator('×')}
                className="p-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors"
              >
                ×
              </button>

              {['4', '5', '6'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigit(n)}
                  className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/50 transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleOperator('-')}
                className="p-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors"
              >
                -
              </button>

              {['1', '2', '3'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigit(n)}
                  className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/50 transition-colors"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleOperator('+')}
                className="p-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors"
              >
                +
              </button>

              <button
                onClick={() => handleDigit('0')}
                className="col-span-2 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/50 transition-colors text-left pl-5"
              >
                0
              </button>
              <button
                onClick={handleDot}
                className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/50 transition-colors"
              >
                .
              </button>
              <button
                onClick={handleEquals}
                className="p-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors"
              >
                =
              </button>
            </div>
          </div>
        </div>
      )}

      {config.type === 'gui_scientific' && (
        <div className="max-w-md mx-auto">
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-2xl">
            {/* Top DEG/RAD & Memory Status */}
            <div className="flex items-center justify-between text-xs mb-2 px-1">
              <button
                onClick={() => setIsDeg(!isDeg)}
                className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-zinc-900 border border-zinc-800 text-sky-400 hover:bg-zinc-800"
              >
                {isDeg ? 'DEG' : 'RAD'}
              </button>
              <span className="text-zinc-400 font-mono text-[11px]">
                M: {memory}
              </span>
            </div>

            {/* Display */}
            <div className="bg-zinc-900 rounded-xl p-3 mb-3 border border-zinc-800 text-right">
              <div className="text-xs text-zinc-400 h-4 font-mono overflow-hidden text-ellipsis">
                {expression}
              </div>
              <div className="text-2xl font-bold text-zinc-100 font-mono tracking-tight mt-0.5">
                {display}
              </div>
            </div>

            {/* Scientific Grid */}
            <div className="grid grid-cols-5 gap-1.5 text-xs font-semibold">
              {/* Row 1: Memory & Constants */}
              <button
                onClick={() => setMemory(0)}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              >
                MC
              </button>
              <button
                onClick={() => setDisplay(String(memory))}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              >
                MR
              </button>
              <button
                onClick={() => setMemory(memory + parseFloat(display || '0'))}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              >
                M+
              </button>
              <button
                onClick={() => setDisplay(String(Math.PI))}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                π
              </button>
              <button
                onClick={() => setDisplay(String(Math.E))}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                e
              </button>

              {/* Row 2: Trig & Roots */}
              <button
                onClick={() => handleUnaryMath('sin')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                sin
              </button>
              <button
                onClick={() => handleUnaryMath('cos')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                cos
              </button>
              <button
                onClick={() => handleUnaryMath('tan')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                tan
              </button>
              <button
                onClick={() => handleUnaryMath('sqrt')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                √
              </button>
              <button
                onClick={() => handleUnaryMath('sqr')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                x²
              </button>

              {/* Row 3: Logs & Powers */}
              <button
                onClick={() => handleUnaryMath('ln')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                ln
              </button>
              <button
                onClick={() => handleUnaryMath('log10')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                log
              </button>
              <button
                onClick={() => handleOperator('^')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                xʸ
              </button>
              <button
                onClick={() => handleUnaryMath('fact')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                n!
              </button>
              <button
                onClick={() => handleUnaryMath('inv')}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400"
              >
                1/x
              </button>

              {/* Row 4: Controls */}
              <button
                onClick={handleClear}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-red-400 font-bold"
              >
                C
              </button>
              <button
                onClick={handleBackspace}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center"
              >
                <Delete className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDigit('(')}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                (
              </button>
              <button
                onClick={() => handleDigit(')')}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                )
              </button>
              <button
                onClick={() => handleOperator('÷')}
                className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white"
              >
                ÷
              </button>

              {/* Row 5: 7 8 9 % * */}
              {['7', '8', '9'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigit(n)}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/60"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={handlePercent}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                %
              </button>
              <button
                onClick={() => handleOperator('×')}
                className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white"
              >
                ×
              </button>

              {/* Row 6: 4 5 6 +/- - */}
              {['4', '5', '6'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigit(n)}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/60"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={handleSign}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                +/-
              </button>
              <button
                onClick={() => handleOperator('-')}
                className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white"
              >
                -
              </button>

              {/* Row 7 & 8: 1 2 3 + and 0 . = */}
              {['1', '2', '3'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigit(n)}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/60"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleDigit('0')}
                className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/60"
              >
                0
              </button>
              <button
                onClick={() => handleOperator('+')}
                className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white"
              >
                +
              </button>

              <button
                onClick={handleDot}
                className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800/60"
              >
                .
              </button>
              <button
                onClick={handleEquals}
                className="col-span-4 p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                =
              </button>
            </div>
          </div>
        </div>
      )}

      {config.type === 'cli_interactive' && (
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-xs overflow-hidden flex flex-col h-96">
          {/* Terminal Titlebar */}
          <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-zinc-400">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
              <span className="text-[11px] text-zinc-300 font-medium ml-2">java CalculadoraCLI.java</span>
            </div>
            <span className="text-[10px] text-zinc-400">Terminal REPL</span>
          </div>

          {/* Terminal Screen */}
          <div className="flex-1 p-4 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {cliHistory.map((item, idx) => (
              <div
                key={idx}
                className={`leading-relaxed whitespace-pre-wrap ${
                  item.type === 'in'
                    ? 'text-zinc-200 font-bold'
                    : item.type === 'out'
                    ? 'text-emerald-400'
                    : item.type === 'err'
                    ? 'text-red-400'
                    : 'text-sky-400/90'
                }`}
              >
                {item.text}
              </div>
            ))}
          </div>

          {/* Terminal Command Input Form */}
          <form onSubmit={handleCliSubmit} className="bg-zinc-900/90 border-t border-zinc-800 p-2 flex items-center space-x-2">
            <span className="text-emerald-400 font-bold pl-2 select-none">calc &gt;</span>
            <input
              id="cli-terminal-input"
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              placeholder="Digite aqui... (ex: (15 * 4) / 2, sqrt(256), hist, ajuda)"
              className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none text-xs"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      {config.type === 'oop_engine' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interactive Methods Trigger */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Testar Métodos da Classe CalculadoraEngine</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => testOopOperation('+', 120, 45)}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-zinc-200"
                >
                  <div className="font-mono text-purple-400">calc.somar(120, 45)</div>
                  <div className="text-[10px] text-zinc-400">Retorna soma com log</div>
                </button>
                <button
                  onClick={() => testOopOperation('-', 500, 78)}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-zinc-200"
                >
                  <div className="font-mono text-purple-400">calc.subtrair(500, 78)</div>
                  <div className="text-[10px] text-zinc-400">Retorna subtração</div>
                </button>
                <button
                  onClick={() => testOopOperation('*', 25, 4)}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-zinc-200"
                >
                  <div className="font-mono text-purple-400">calc.multiplicar(25, 4)</div>
                  <div className="text-[10px] text-zinc-400">Retorna produto</div>
                </button>
                <button
                  onClick={() => testOopOperation('/', 100, 8)}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-zinc-200"
                >
                  <div className="font-mono text-purple-400">calc.dividir(100, 8)</div>
                  <div className="text-[10px] text-zinc-400">Divisão formatada</div>
                </button>
                <button
                  onClick={() => testOopOperation('^', 2, 10)}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-zinc-200"
                >
                  <div className="font-mono text-purple-400">calc.potencia(2, 10)</div>
                  <div className="text-[10px] text-zinc-400">2^10 = 1024</div>
                </button>
                <button
                  onClick={() => testOopOperation('sqrt', 256, null)}
                  className="p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-zinc-200"
                >
                  <div className="font-mono text-purple-400">calc.raiz_quadrada(256)</div>
                  <div className="text-[10px] text-zinc-400">sqrt(256) = 16</div>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleRunExecution()}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 shadow-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Executar Suíte de Testes na JVM (Java 17)</span>
                </button>
              </div>
            </div>

            {/* Audit Log / JSON Inspector */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col h-80">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                <span className="text-xs font-semibold text-zinc-300">
                  Histórico Auditável (JSON / Memória)
                </span>
                <span className="text-[10px] text-zinc-400">{oopLogs.length} operações</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 text-xs font-mono">
                {oopLogs.length === 0 ? (
                  <div className="text-zinc-400 text-center py-8">
                    Clique nos métodos ao lado para disparar cálculos e registrar auditoria.
                  </div>
                ) : (
                  oopLogs.map((log) => (
                    <div key={log.id} className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                        <span>Op: {log.op}</span>
                        <span>{log.time}</span>
                      </div>
                      <div className="text-emerald-400">
                        {log.b !== null ? `${log.a} ${log.op} ${log.b}` : `${log.op}(${log.a})`} = <span className="font-bold text-white">{log.res}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {config.type === 'programmer' && (
        <div className="space-y-4 max-w-xl mx-auto">
          {/* Programmer Value Input */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Valor de Entrada (Decimal, Hexadecimal 0x, Binário 0b ou Octal 0o)
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-pink-400 font-mono">
                {config.programmerBits} bits
              </span>
            </div>

            <input
              id="input-programmer-val"
              type="text"
              value={progInputStr}
              onChange={(e) => handleProgInputChange(e.target.value)}
              placeholder="Ex: 255 ou 0xFF ou 0b11111111"
              className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 font-mono text-base focus:outline-none focus:border-pink-500 transition-colors"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
              {[0, 15, 127, 255, 1024, 65535].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleProgInputChange(String(preset))}
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 font-mono text-[11px]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Bases Representation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] font-sans uppercase font-bold text-zinc-400 mb-1">
                Decimal (DEC)
              </div>
              <div className="text-lg font-bold text-zinc-100">{decStr}</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] font-sans uppercase font-bold text-zinc-400 mb-1">
                Hexadecimal (HEX)
              </div>
              <div className="text-lg font-bold text-pink-400">{hexStr}</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] font-sans uppercase font-bold text-zinc-400 mb-1">
                Octal (OCT)
              </div>
              <div className="text-lg font-bold text-amber-400">{octStr}</div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-[10px] font-sans uppercase font-bold text-zinc-400 mb-1">
                Binário (BIN - Nibbles)
              </div>
              <div className="text-sm font-bold text-emerald-400 break-all">{binGrouped}</div>
            </div>
          </div>

          {/* Quick Bitwise Operations */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs">
            <div className="text-zinc-400 font-medium">Operação Bitwise com máscara:</div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-zinc-200">{progValue}</span>
              <select
                value={bitOp}
                onChange={(e) => setBitOp(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded px-2 py-1 font-mono text-xs"
              >
                <option value="AND">AND (&)</option>
                <option value="OR">OR (|)</option>
                <option value="XOR">XOR (^)</option>
              </select>
              <input
                type="number"
                value={bitOperand}
                onChange={(e) => setBitOperand(parseInt(e.target.value) || 0)}
                className="w-20 bg-zinc-900 border border-zinc-800 text-zinc-200 rounded px-2 py-1 font-mono text-xs"
              />
              <span className="text-zinc-400">=</span>
              <span className="font-mono font-bold text-emerald-400">
                {bitOp === 'AND'
                  ? (progValue & bitOperand) & mask
                  : bitOp === 'OR'
                  ? (progValue | bitOperand) & mask
                  : (progValue ^ bitOperand) & mask}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* History Drawer for Standard/Scientific */}
      {showHistoryDrawer && (
        <div className="absolute inset-y-0 right-0 w-72 bg-zinc-950/95 border-l border-zinc-800 p-4 shadow-2xl backdrop-blur-md flex flex-col z-30">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-semibold text-zinc-200">Histórico ({history.length})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {onOpenCharts && history.length > 0 && (
                <button
                  onClick={onOpenCharts}
                  className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 flex items-center space-x-1"
                  title="Ver Gráfico Seaborn"
                >
                  <BarChart3 className="w-3 h-3" />
                  <span>Ver Gráfico</span>
                </button>
              )}
              <button
                onClick={() => updateHistory([])}
                className="text-[10px] text-zinc-400 hover:text-red-400"
                title="Limpar histórico"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 text-xs">
            {history.length === 0 ? (
              <div className="text-zinc-400 text-center py-10">
                Nenhum cálculo recente. Realize operações para vê-las aqui.
              </div>
            ) : (
              history.map((h) => (
                <div
                  key={h.id}
                  onClick={() => setDisplay(String(h.result))}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors text-right"
                >
                  <div className="text-[11px] text-zinc-400 font-mono">{h.expression} =</div>
                  <div className="text-sm font-bold text-zinc-100 font-mono">{h.result}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
