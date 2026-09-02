export type CalculatorType =
  | 'gui_standard'
  | 'gui_scientific'
  | 'cli_interactive'
  | 'oop_engine'
  | 'programmer';

export type ColorTheme = 'dark' | 'light' | 'cyber' | 'emerald';

export interface CalculatorConfig {
  type: CalculatorType;
  title: string;
  theme: ColorTheme;
  precision: number;
  enableHistory: boolean;
  enableMemory: boolean;
  angleMode: 'deg' | 'rad';
  programmerBits: 8 | 16 | 32 | 64;
  showSeabornChart?: boolean;
}

export interface CalculatorTemplateInfo {
  id: CalculatorType;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  filename: string;
  category: 'Desktop Tkinter GUI' | 'Terminal CLI' | 'Arquitetura POO' | 'Sistemas / Bits';
  features: string[];
}

export interface PythonRunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  error?: string;
}

// Backwards compatibility alias
export type JavaRunResult = PythonRunResult;

export interface HistoryEntry {
  id: string;
  expression: string;
  result: number | string;
  rawResult?: string | number;
  timestamp: string | Date;
  operator?: string;
}

export type SeabornChartType =
  | 'line'        // Evolução temporal (sns.lineplot)
  | 'bar'         // Comparativo por cálculo (sns.barplot)
  | 'dist'        // Histograma e densidade KDE (sns.histplot + kde)
  | 'operators'   // Frequência de operadores (sns.countplot)
  | 'box';        // Distribuição estatística (sns.boxplot)

export type SeabornPalette = 'mako' | 'viridis' | 'rocket' | 'crest' | 'flare' | 'Blues_r';

export type SeabornStyle = 'darkgrid' | 'whitegrid' | 'dark' | 'ticks';

export interface SeabornChartResponse {
  success: boolean;
  imageBase64: string;
  pythonCode: string;
  libraryInfo: {
    name: 'Seaborn';
    version: string;
    usedExplicitly: true;
    details: string;
  };
  stats?: {
    total: number;
    mean: number;
    max: number;
    min: number;
    sum: number;
  };
  duration: number;
  error?: string;
}
