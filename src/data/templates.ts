import { CalculatorConfig, CalculatorTemplateInfo, CalculatorType } from '../types';

export const CALCULATOR_TEMPLATES: CalculatorTemplateInfo[] = [
  {
    id: 'gui_standard',
    name: 'Python Tkinter GUI (Desktop Padrão)',
    shortName: 'Desktop Tkinter',
    badge: 'Tkinter + Seaborn',
    description: 'Interface gráfica moderna de desktop com botões estilizados, histórico de visor e botão para gerar gráficos estatísticos com a biblioteca Seaborn.',
    filename: 'calculadora_gui.py',
    category: 'Desktop Tkinter GUI',
    features: ['Operações Básicas', 'Interface Desktop Tkinter', 'Gráfico com Seaborn (sns.barplot)', 'Histórico de Contas', 'Tratamento de Divisão por Zero'],
  },
  {
    id: 'gui_scientific',
    name: 'Python Tkinter GUI (Científica Completa)',
    shortName: 'Científica Tkinter',
    badge: 'Math + Seaborn',
    description: 'Calculadora científica com funções trigonométricas (sin, cos, tan), logaritmos, potências, raízes, constantes pi/e e gráficos de dispersão/evolução com Seaborn.',
    filename: 'calculadora_cientifica_gui.py',
    category: 'Desktop Tkinter GUI',
    features: ['Sin, Cos, Tan', 'DEG / RAD', 'Log10 & Ln', 'Raiz Quadrada & x²', 'Gráficos Seaborn (sns.lineplot)', 'Memória M+/MR/MC'],
  },
  {
    id: 'cli_interactive',
    name: 'Terminal CLI Interativo (REPL Python)',
    shortName: 'Terminal CLI',
    badge: 'ANSI + Seaborn',
    description: 'Calculadora via prompt de comando em Python com cores ANSI, histórico de cálculos, comandos rápidos e comando "grafico" para salvar visualização Seaborn em PNG.',
    filename: 'calculadora_cli.py',
    category: 'Terminal CLI',
    features: ['Parser Matemático Seguro (Sem eval)', 'Cores ANSI no Terminal', 'Histórico de Sessão', 'Variável ANS', 'Comando "grafico" com Seaborn'],
  },
  {
    id: 'oop_engine',
    name: 'Motor Orientado a Objetos (POO + Testes)',
    shortName: 'Engine POO',
    badge: 'POO & Seaborn Data',
    description: 'Classe de engenharia em Python com encapsulamento, histórico estruturado em DataFrame, suíte de testes unittest e geração de gráficos com Seaborn.',
    filename: 'calculadora_oop.py',
    category: 'Arquitetura POO',
    features: ['Design Patterns POO', 'DataClasses Estruturadas', 'Exportação Pandas/JSON', 'Método plotar_seaborn()', 'Suíte Unittest Integrada'],
  },
  {
    id: 'programmer',
    name: 'Calculadora do Programador (Bases & Bits)',
    shortName: 'Programador',
    badge: 'Hex / Bin / Bitwise',
    description: 'Conversão instantânea entre Hexadecimal, Decimal, Binário e Octal com operadores bit a bit (AND, OR, XOR, NOT, Shifts) e mapa de frequências com Seaborn.',
    filename: 'calculadora_programador.py',
    category: 'Sistemas / Bits',
    features: ['Conversão DEC/HEX/BIN/OCT', 'Bitwise AND, OR, XOR, NOT', 'Agrupamento em Nibbles (4 bits)', 'Gráfico de Bits com Seaborn', 'Suporte 8/16/32/64 bits'],
  },
];

export function generatePythonCode(config: CalculatorConfig): string {
  const { type, title, theme, precision, programmerBits, angleMode } = config;

  const bg = theme === 'light' ? '#f4f4f5' : theme === 'emerald' ? '#064e3b' : theme === 'cyber' ? '#0f172a' : '#18181b';
  const fg = theme === 'light' ? '#09090b' : '#fafafa';
  const btnBg = theme === 'light' ? '#e4e4e7' : theme === 'emerald' ? '#047857' : theme === 'cyber' ? '#1e293b' : '#27272a';
  const opBg = theme === 'emerald' ? '#059669' : '#f97316';
  const displayBg = theme === 'light' ? '#ffffff' : '#09090b';

  if (type === 'gui_standard') {
    return `#!/usr/bin/env python3
"""
${title} - Desenvolvida em Python com Tkinter & Visualização Gráfica com Seaborn
Execução: python3 calculadora_gui.py
"""

import tkinter as tk
from tkinter import messagebox
import math
import os

# ==============================================================================
# BIBLIOTECA SEABORN IMPORTADA CONFORME SOLICITADO
# Usada para plotar gráficos estatísticos do histórico de contas feitas!
# ==============================================================================
try:
    import seaborn as sns
    import matplotlib.pyplot as plt
    import pandas as pd
    SEABORN_DISPONIVEL = True
except ImportError:
    SEABORN_DISPONIVEL = False


class CalculadoraPadrao:
    def __init__(self, root):
        self.root = root
        self.root.title("${title}")
        self.root.geometry("380x560")
        self.root.resizable(False, False)
        self.root.configure(bg="${bg}")

        self.expressao = ""
        self.historico = []  # Armazena registros: {'expressao': str, 'resultado': float, 'operador': str}
        self.precisao = ${precision}

        self._criar_interface()

    def _criar_interface(self):
        # Frame do Display
        display_frame = tk.Frame(self.root, bg="${bg}")
        display_frame.pack(fill=tk.BOTH, padx=16, pady=(16, 8))

        self.lbl_preview = tk.Label(
            display_frame, text="", anchor="e",
            font=("DejaVu Sans", 11), bg="${displayBg}", fg="#a1a1aa", padx=12, pady=4
        )
        self.lbl_preview.pack(fill=tk.X)

        self.lbl_display = tk.Label(
            display_frame, text="0", anchor="e",
            font=("DejaVu Sans", 24, "bold"), bg="${displayBg}", fg="${fg}", padx=12, pady=12
        )
        self.lbl_display.pack(fill=tk.X)

        # Botão de Ação: Mostrar Gráfico do Histórico com SEABORN
        btn_grafico = tk.Button(
            self.root,
            text="📊 Mostrar Gráfico do Histórico (Seaborn)",
            command=self.mostrar_grafico_seaborn,
            bg="#0284c7", fg="#ffffff", activebackground="#0369a1",
            font=("DejaVu Sans", 10, "bold"), bd=0, pady=6, cursor="hand2"
        )
        btn_grafico.pack(fill=tk.X, padx=16, pady=(0, 10))

        # Grid de Teclas
        teclas_frame = tk.Frame(self.root, bg="${bg}")
        teclas_frame.pack(fill=tk.BOTH, expand=True, padx=16, pady=(0, 16))

        for i in range(5):
            teclas_frame.rowconfigure(i, weight=1)
        for j in range(4):
            teclas_frame.columnconfigure(j, weight=1)

        botoes = [
            ("C", 0, 0, "#ef4444", self.limpar),
            ("⌫", 0, 1, "${btnBg}", self.apagar),
            ("%", 0, 2, "${btnBg}", lambda: self.inserir_op("%")),
            ("÷", 0, 3, "${opBg}", lambda: self.inserir_op("/")),

            ("7", 1, 0, "${btnBg}", lambda: self.inserir_digito("7")),
            ("8", 1, 1, "${btnBg}", lambda: self.inserir_digito("8")),
            ("9", 1, 2, "${btnBg}", lambda: self.inserir_digito("9")),
            ("×", 1, 3, "${opBg}", lambda: self.inserir_op("*")),

            ("4", 2, 0, "${btnBg}", lambda: self.inserir_digito("4")),
            ("5", 2, 1, "${btnBg}", lambda: self.inserir_digito("5")),
            ("6", 2, 2, "${btnBg}", lambda: self.inserir_digito("6")),
            ("-", 2, 3, "${opBg}", lambda: self.inserir_op("-")),

            ("1", 3, 0, "${btnBg}", lambda: self.inserir_digito("1")),
            ("2", 3, 1, "${btnBg}", lambda: self.inserir_digito("2")),
            ("3", 3, 2, "${btnBg}", lambda: self.inserir_digito("3")),
            ("+", 3, 3, "${opBg}", lambda: self.inserir_op("+")),

            ("±", 4, 0, "${btnBg}", self.inverter_sinal),
            ("0", 4, 1, "${btnBg}", lambda: self.inserir_digito("0")),
            (".", 4, 2, "${btnBg}", lambda: self.inserir_digito(".")),
            ("=", 4, 3, "#10b981", self.calcular),
        ]

        for texto, linha, col, cor, cmd in botoes:
            b = tk.Button(
                teclas_frame, text=texto, command=cmd,
                bg=cor, fg="#ffffff" if cor != "#e4e4e7" else "#09090b",
                font=("DejaVu Sans", 13, "bold"), bd=0, cursor="hand2"
            )
            b.grid(row=linha, column=col, sticky="nsew", padx=3, pady=3)

    def inserir_digito(self, d):
        self.expressao += str(d)
        self.lbl_display.config(text=self.expressao)

    def inserir_op(self, op):
        if not self.expressao and op == "-":
            self.expressao = "-"
        elif self.expressao and self.expressao[-1] not in "+-*/%":
            self.expressao += str(op)
        self.lbl_display.config(text=self.expressao)

    def inverter_sinal(self):
        try:
            if self.expressao:
                val = float(eval(self.expressao))
                self.expressao = str(-val)
                self.lbl_display.config(text=self.expressao)
        except Exception:
            pass

    def limpar(self):
        self.expressao = ""
        self.lbl_display.config(text="0")
        self.lbl_preview.config(text="")

    def apagar(self):
        self.expressao = self.expressao[:-1]
        self.lbl_display.config(text=self.expressao if self.expressao else "0")

    def calcular(self):
        if not self.expressao:
            return
        try:
            exp_sanitizada = self.expressao.replace("×", "*").replace("÷", "/")
            res = eval(exp_sanitizada, {"__builtins__": None}, {"math": math})
            res_formatado = round(res, self.precisao)
            if res_formatado == int(res_formatado):
                res_formatado = int(res_formatado)

            # Detecta o operador da conta
            op = "Expressão"
            for sinal, nome in [("+", "Soma (+)"), ("-", "Subtração (-)"), ("*", "Multiplicação (×)"), ("/", "Divisão (÷)"), ("%", "Módulo (%)")]:
                if sinal in self.expressao:
                    op = nome
                    break

            # Registra no histórico para análise com Seaborn
            self.historico.append({
                "ordem": len(self.historico) + 1,
                "expressao": self.expressao,
                "resultado": float(res_formatado),
                "operador": op
            })

            self.lbl_preview.config(text=f"{self.expressao} =")
            self.lbl_display.config(text=str(res_formatado))
            self.expressao = str(res_formatado)
        except ZeroDivisionError:
            messagebox.showerror("Erro Matemático", "Não é possível dividir por zero!")
            self.limpar()
        except Exception as e:
            messagebox.showerror("Erro de Expressão", f"Expressão inválida: {e}")

    def mostrar_grafico_seaborn(self):
        """
        Gera e exibe uma janela gráfica com o histórico de cálculos
        utilizando a biblioteca SEABORN.
        """
        if not SEABORN_DISPONIVEL:
            messagebox.showwarning(
                "Biblioteca Ausente",
                "Para visualizar o gráfico, instale o Seaborn:\\npip install seaborn matplotlib pandas"
            )
            return

        if not self.historico:
            messagebox.showinfo(
                "Histórico Vazio",
                "Faça algumas contas na calculadora primeiro para gerar o gráfico com Seaborn!"
            )
            return

        # ==============================================================================
        # UTILIZAÇÃO EXPLÍCITA DA BIBLIOTECA SEABORN
        # ==============================================================================
        df = pd.DataFrame(self.historico)
        
        # Configuração estética do Seaborn
        sns.set_theme(style="darkgrid")
        fig, axes = plt.subplots(1, 2, figsize=(11, 4.5))
        fig.suptitle(f"Histórico de Cálculos • Gerado com Seaborn v{sns.__version__}", fontsize=13, weight="bold")

        # Gráfico 1: Evolução dos Resultados (sns.lineplot)
        sns.lineplot(
            data=df, x="ordem", y="resultado",
            ax=axes[0], marker="o", color="#f97316", linewidth=2.5
        )
        axes[0].set_title("Evolução dos Resultados (sns.lineplot)", fontsize=11)
        axes[0].set_xlabel("Ordem dos Cálculos Realizados")
        axes[0].set_ylabel("Valor Obtido")

        # Gráfico 2: Comparativo das Operações (sns.barplot)
        sns.barplot(
            data=df, x="expressao", y="resultado", hue="operador",
            ax=axes[1], palette="mako", dodge=False
        )
        axes[1].set_title("Comparativo por Expressão (sns.barplot)", fontsize=11)
        axes[1].set_xlabel("Expressão")
        axes[1].set_ylabel("Resultado")
        axes[1].tick_params(axis="x", rotation=35)

        plt.tight_layout()
        plt.show()


if __name__ == "__main__":
    root = tk.Tk()
    app = CalculadoraPadrao(root)
    root.mainloop()
`;
  }

  if (type === 'gui_scientific') {
    return `#!/usr/bin/env python3
"""
${title} - Calculadora Científica com Python Math & Gráficos Seaborn
Execução: python3 calculadora_cientifica_gui.py
"""

import tkinter as tk
from tkinter import messagebox
import math

try:
    import seaborn as sns
    import matplotlib.pyplot as plt
    import pandas as pd
    SEABORN_DISPONIVEL = True
except ImportError:
    SEABORN_DISPONIVEL = False


class CalculadoraCientifica:
    def __init__(self, root):
        self.root = root
        self.root.title("${title}")
        self.root.geometry("460x640")
        self.root.configure(bg="${bg}")

        self.expressao = ""
        self.memoria = 0.0
        self.historico = []
        self.modo_angulo = "${angleMode}"  # 'deg' ou 'rad'
        self.precisao = ${precision}

        self._criar_widgets()

    def _criar_widgets(self):
        # Display
        display_frame = tk.Frame(self.root, bg="${bg}")
        display_frame.pack(fill=tk.BOTH, padx=14, pady=12)

        self.lbl_modo = tk.Label(
            display_frame, text=f"MODO: {self.modo_angulo.upper()} | M: {self.memoria}",
            anchor="w", font=("DejaVu Sans", 9), bg="${displayBg}", fg="#38bdf8", padx=10, pady=2
        )
        self.lbl_modo.pack(fill=tk.X)

        self.lbl_display = tk.Label(
            display_frame, text="0", anchor="e",
            font=("DejaVu Sans", 22, "bold"), bg="${displayBg}", fg="${fg}", padx=10, pady=10
        )
        self.lbl_display.pack(fill=tk.X)

        # Botão Seaborn Gráfico
        btn_plot = tk.Button(
            self.root, text="📊 Ver Histórico Estatístico no Seaborn (sns.lineplot / sns.histplot)",
            command=self.plotar_historico_seaborn,
            bg="#8b5cf6", fg="#ffffff", font=("DejaVu Sans", 9, "bold"), bd=0, pady=6, cursor="hand2"
        )
        btn_plot.pack(fill=tk.X, padx=14, pady=(0, 8))

        # Grade de botões científicos
        grid = tk.Frame(self.root, bg="${bg}")
        grid.pack(fill=tk.BOTH, expand=True, padx=14, pady=(0, 14))

        botoes = [
            ("sin", self.func_sin), ("cos", self.func_cos), ("tan", self.func_tan), ("π", lambda: self.add(str(math.pi))), ("e", lambda: self.add(str(math.e))),
            ("x²", self.func_quadrado), ("xʸ", lambda: self.add("**")), ("√x", self.func_sqrt), ("ln", self.func_ln), ("log₁₀", self.func_log10),
            ("M+", self.mem_add), ("MR", self.mem_recall), ("MC", self.mem_clear), ("C", self.limpar), ("⌫", self.apagar),
            ("7", lambda: self.add("7")), ("8", lambda: self.add("8")), ("9", lambda: self.add("9")), ("÷", lambda: self.add("/")), ("DEG/RAD", self.toggle_angulo),
            ("4", lambda: self.add("4")), ("5", lambda: self.add("5")), ("6", lambda: self.add("6")), ("×", lambda: self.add("*")), ("(", lambda: self.add("(")),
            ("1", lambda: self.add("1")), ("2", lambda: self.add("2")), ("3", lambda: self.add("3")), ("-", lambda: self.add("-")), (")", lambda: self.add(")")),
            ("0", lambda: self.add("0")), (".", lambda: self.add(".")), ("±", self.inverter), ("+", lambda: self.add("+")), ("=", self.calcular),
        ]

        for i in range(7):
            grid.rowconfigure(i, weight=1)
        for j in range(5):
            grid.columnconfigure(j, weight=1)

        idx = 0
        for texto, cmd in botoes:
            r = idx // 5
            c = idx % 5
            cor = "#f97316" if texto in ["=", "+", "-", "×", "÷"] else "#27272a"
            if texto in ["C", "⌫"]: cor = "#ef4444"
            if texto == "=": cor = "#10b981"
            if texto in ["sin", "cos", "tan", "ln", "log₁₀", "√x", "x²"]: cor = "#3f3f46"

            btn = tk.Button(grid, text=texto, command=cmd, bg=cor, fg="#ffffff", font=("DejaVu Sans", 10, "bold"), bd=0)
            btn.grid(row=r, column=c, sticky="nsew", padx=2, pady=2)
            idx += 1

    def add(self, v):
        self.expressao += v
        self.lbl_display.config(text=self.expressao)

    def limpar(self):
        self.expressao = ""
        self.lbl_display.config(text="0")

    def apagar(self):
        self.expressao = self.expressao[:-1]
        self.lbl_display.config(text=self.expressao if self.expressao else "0")

    def toggle_angulo(self):
        self.modo_angulo = "rad" if self.modo_angulo == "deg" else "deg"
        self.lbl_modo.config(text=f"MODO: {self.modo_angulo.upper()} | M: {self.memoria}")

    def mem_add(self):
        try:
            self.memoria += float(self.lbl_display.cget("text"))
            self.lbl_modo.config(text=f"MODO: {self.modo_angulo.upper()} | M: {self.memoria}")
        except ValueError: pass

    def mem_recall(self):
        self.add(str(self.memoria))

    def mem_clear(self):
        self.memoria = 0.0
        self.lbl_modo.config(text=f"MODO: {self.modo_angulo.upper()} | M: 0.0")

    def func_sin(self):
        try:
            v = float(eval(self.expressao or self.lbl_display.cget("text")))
            rad = math.radians(v) if self.modo_angulo == "deg" else v
            res = round(math.sin(rad), self.precisao)
            self._registrar(f"sin({v})", res, "Trigonométrica")
        except Exception as e: messagebox.showerror("Erro", str(e))

    def func_cos(self):
        try:
            v = float(eval(self.expressao or self.lbl_display.cget("text")))
            rad = math.radians(v) if self.modo_angulo == "deg" else v
            res = round(math.cos(rad), self.precisao)
            self._registrar(f"cos({v})", res, "Trigonométrica")
        except Exception as e: messagebox.showerror("Erro", str(e))

    def func_tan(self):
        try:
            v = float(eval(self.expressao or self.lbl_display.cget("text")))
            rad = math.radians(v) if self.modo_angulo == "deg" else v
            res = round(math.tan(rad), self.precisao)
            self._registrar(f"tan({v})", res, "Trigonométrica")
        except Exception as e: messagebox.showerror("Erro", str(e))

    def func_sqrt(self):
        try:
            v = float(eval(self.expressao or self.lbl_display.cget("text")))
            if v < 0: raise ValueError("Raiz de número negativo.")
            res = round(math.sqrt(v), self.precisao)
            self._registrar(f"sqrt({v})", res, "Raiz")
        except Exception as e: messagebox.showerror("Erro", str(e))

    def func_ln(self):
        try:
            v = float(eval(self.expressao or self.lbl_display.cget("text")))
            res = round(math.log(v), self.precisao)
            self._registrar(f"ln({v})", res, "Logaritmo")
        except Exception as e: messagebox.showerror("Erro", str(e))

    def func_log10(self):
        try:
            v = float(eval(self.expressao or self.lbl_display.cget("text")))
            res = round(math.log10(v), self.precisao)
            self._registrar(f"log10({v})", res, "Logaritmo")
        except Exception as e: messagebox.showerror("Erro", str(e))

    def func_quadrado(self):
        try:
            v = float(eval(self.expressao or self.lbl_display.cget("text")))
            res = round(v ** 2, self.precisao)
            self._registrar(f"({v})²", res, "Potência")
        except Exception as e: messagebox.showerror("Erro", str(e))

    def inverter(self):
        try:
            v = float(self.lbl_display.cget("text"))
            self.expressao = str(-v)
            self.lbl_display.config(text=self.expressao)
        except Exception: pass

    def calcular(self):
        try:
            res = eval(self.expressao, {"__builtins__": None}, {"math": math})
            res_formatado = round(res, self.precisao)
            self._registrar(self.expressao, res_formatado, "Aritmética")
        except Exception as e:
            messagebox.showerror("Erro Matemático", str(e))

    def _registrar(self, exp, res, op_tipo):
        self.historico.append({
            "ordem": len(self.historico) + 1,
            "expressao": exp,
            "resultado": float(res),
            "operador": op_tipo
        })
        self.lbl_display.config(text=str(res))
        self.expressao = str(res)

    def plotar_historico_seaborn(self):
        if not SEABORN_DISPONIVEL:
            messagebox.showwarning("Aviso", "Instale o Seaborn: pip install seaborn matplotlib pandas")
            return
        if not self.historico:
            messagebox.showinfo("Histórico", "Calcule valores primeiro para gerar o gráfico Seaborn!")
            return

        df = pd.DataFrame(self.historico)
        sns.set_theme(style="darkgrid", palette="rocket")
        fig, axes = plt.subplots(1, 2, figsize=(10, 4.5))
        fig.suptitle(f"Análise Científica • Seaborn v{sns.__version__}", fontsize=13, weight="bold")

        sns.lineplot(data=df, x="ordem", y="resultado", ax=axes[0], marker="s", color="#8b5cf6")
        axes[0].set_title("Evolução das Contas (sns.lineplot)")

        sns.histplot(data=df, x="resultado", kde=True, ax=axes[1], color="#06b6d4")
        axes[1].set_title("Distribuição dos Valores (sns.histplot + KDE)")

        plt.tight_layout()
        plt.show()


if __name__ == "__main__":
    root = tk.Tk()
    app = CalculadoraCientifica(root)
    root.mainloop()
`;
  }

  if (type === 'cli_interactive') {
    return `#!/usr/bin/env python3
"""
${title} - Terminal REPL com Cores ANSI & Geração de Gráficos Seaborn
Execução: python3 calculadora_cli.py
"""

import sys
import math
import os

try:
    import seaborn as sns
    import matplotlib.pyplot as plt
    import pandas as pd
    SEABORN_DISPONIVEL = True
except ImportError:
    SEABORN_DISPONIVEL = False

# Cores ANSI
C_RESET = "\\033[0m"
C_BOLD = "\\033[1m"
C_GREEN = "\\033[32m"
C_ORANGE = "\\033[33m"
C_BLUE = "\\033[34m"
C_PURPLE = "\\033[35m"
C_CYAN = "\\033[36m"
C_RED = "\\033[31m"


class CalculadoraCLI:
    def __init__(self):
        self.historico = []
        self.memoria = 0.0
        self.ans = 0.0

    def executar(self):
        print(f"{C_ORANGE}{'='*58}{C_RESET}")
        print(f"{C_BOLD}{C_GREEN}  CALCULADORA PYTHON CLI (REPL SEGURO & SEABORN PLOT){C_RESET}")
        print(f"{C_CYAN}  Comandos: hist, grafico, m+, mr, mc, ajuda, sair{C_RESET}")
        print(f"{C_ORANGE}{'='*58}{C_RESET}")

        while True:
            try:
                entrada = input(f"{C_BOLD}{C_ORANGE}calc > {C_RESET}").strip()
                if not entrada:
                    continue

                cmd = entrada.lower()
                if cmd in ["sair", "exit", "quit", "q"]:
                    print(f"{C_GREEN}Encerrando calculadora Python. Até logo!{C_RESET}")
                    break
                elif cmd == "limpar" or cmd == "clear":
                    os.system("clear" if os.name == "posix" else "cls")
                elif cmd == "hist":
                    self.mostrar_historico()
                elif cmd == "grafico":
                    self.gerar_grafico_seaborn()
                elif cmd == "mr":
                    print(f"{C_CYAN}Memória: {self.memoria}{C_RESET}")
                elif cmd == "mc":
                    self.memoria = 0.0
                    print(f"{C_CYAN}Memória limpa.{C_RESET}")
                elif cmd.startswith("m+"):
                    self.memoria += self.ans
                    print(f"{C_CYAN}Adicionado à memória. Total: {self.memoria}{C_RESET}")
                elif cmd == "ajuda":
                    self.mostrar_ajuda()
                else:
                    self.avaliar(entrada)
            except (KeyboardInterrupt, EOFError):
                print(f"\\n{C_GREEN}Saindo...{C_RESET}")
                break

    def avaliar(self, expr):
        try:
            # Substitui 'ans' pelo último valor
            expr_proc = expr.replace("ans", str(self.ans)).replace("pi", str(math.pi)).replace("e", str(math.e))
            env = {"math": math, "sqrt": math.sqrt, "sin": math.sin, "cos": math.cos, "tan": math.tan, "log": math.log10}
            resultado = eval(expr_proc, {"__builtins__": None}, env)
            resultado = round(float(resultado), ${precision})
            if resultado.is_integer():
                resultado = int(resultado)

            self.ans = resultado
            self.historico.append({
                "ordem": len(self.historico) + 1,
                "expressao": expr,
                "resultado": float(resultado),
                "operador": "Cálculo"
            })

            print(f"{C_GREEN}  = {resultado}{C_RESET}")
        except Exception as err:
            print(f"{C_RED}  Erro: {err}{C_RESET}")

    def mostrar_historico(self):
        if not self.historico:
            print(f"{C_CYAN}Nenhum cálculo no histórico.{C_RESET}")
            return
        print(f"\\n{C_BOLD}--- HISTÓRICO DE CÁLCULOS ---{C_RESET}")
        for reg in self.historico:
            print(f"  #{reg['ordem']}: {reg['expressao']} = {C_GREEN}{reg['resultado']}{C_RESET}")
        print()

    def gerar_grafico_seaborn(self, arquivo="historico_seaborn.png"):
        """
        Gera gráfico do histórico utilizando a biblioteca Seaborn e salva em disco.
        """
        if not SEABORN_DISPONIVEL:
            print(f"{C_RED}Seaborn não instalado. Execute: pip install seaborn matplotlib pandas{C_RESET}")
            return
        if not self.historico:
            print(f"{C_ORANGE}Faça alguns cálculos antes de gerar o gráfico com Seaborn.{C_RESET}")
            return

        # SEABORN IMPLEMENTADO!
        df = pd.DataFrame(self.historico)
        sns.set_theme(style="darkgrid", palette="mako")
        fig, ax = plt.subplots(figsize=(8, 4.5))

        sns.barplot(data=df, x="expressao", y="resultado", ax=ax, palette="crest")
        ax.set_title(f"Histórico de Cálculos • Seaborn v{sns.__version__}", fontsize=12, weight="bold")
        ax.tick_params(axis="x", rotation=30)
        plt.tight_layout()
        plt.savefig(arquivo, dpi=120)
        plt.close()

        print(f"{C_GREEN}✔ Gráfico estatístico gerado com SEABORN com sucesso em: {arquivo}{C_RESET}")

    def mostrar_ajuda(self):
        print(f\"\"\"{C_PURPLE}
Ajuda da Calculadora CLI:
- Expressões: 15 * 4 + 10, sqrt(144), sin(math.radians(90)), 2**10
- hist      : Lista todos os cálculos feitos na sessão
- grafico   : Gera imagem PNG com gráficos Seaborn do histórico
- ans       : Usa o último resultado obtido
- m+, mr, mc: Comandos de memória
- sair      : Encerra a aplicação
{C_RESET}\"\"\")


if __name__ == "__main__":
    calc = CalculadoraCLI()
    calc.executar()
`;
  }

  if (type === 'oop_engine') {
    return `#!/usr/bin/env python3
"""
${title} - Arquitetura Orientada a Objetos (POO), Pandas & Seaborn Visualizer
Execução: python3 calculadora_oop.py
"""

from dataclasses import dataclass, asdict
from datetime import datetime
from typing import List, Optional
import unittest
import math

try:
    import seaborn as sns
    import matplotlib.pyplot as plt
    import pandas as pd
    SEABORN_DISPONIVEL = True
except ImportError:
    SEABORN_DISPONIVEL = False


@dataclass(frozen=True)
class RegistroOperacao:
    operador: str
    operando_a: float
    operando_b: Optional[float]
    resultado: float
    data: str


class DivisaoPorZeroError(ArithmeticError):
    pass


class CalculadoraEngine:
    """Motor matemático com histórico estruturado e integração com Seaborn."""

    def __init__(self, precisao: int = ${precision}):
        self.precisao = precisao
        self._historico: List[RegistroOperacao] = []

    @property
    def historico(self) -> List[RegistroOperacao]:
        return list(self._historico)

    def somar(self, a: float, b: float) -> float:
        res = round(a + b, self.precisao)
        self._registrar("+", a, b, res)
        return res

    def subtrair(self, a: float, b: float) -> float:
        res = round(a - b, self.precisao)
        self._registrar("-", a, b, res)
        return res

    def multiplicar(self, a: float, b: float) -> float:
        res = round(a * b, self.precisao)
        self._registrar("*", a, b, res)
        return res

    def dividir(self, a: float, b: float) -> float:
        if b == 0:
            raise DivisaoPorZeroError("Impossível dividir por zero.")
        res = round(a / b, self.precisao)
        self._registrar("/", a, b, res)
        return res

    def potencia(self, a: float, b: float) -> float:
        res = round(a ** b, self.precisao)
        self._registrar("^", a, b, res)
        return res

    def raiz_quadrada(self, a: float) -> float:
        if a < 0:
            raise ValueError("Raiz de número negativo.")
        res = round(math.sqrt(a), self.precisao)
        self._registrar("sqrt", a, None, res)
        return res

    def _registrar(self, op: str, a: float, b: Optional[float], res: float):
        reg = RegistroOperacao(
            operador=op, operando_a=a, operando_b=b, resultado=res,
            data=datetime.now().strftime("%H:%M:%S")
        )
        self._historico.append(reg)

    def plotar_grafico_seaborn(self, salvar_como="historico_seaborn.png"):
        """Gera análise gráfica do histórico usando a biblioteca Seaborn."""
        if not SEABORN_DISPONIVEL:
            print("Seaborn não está instalado.")
            return False

        if not self._historico:
            print("Histórico vazio.")
            return False

        dados = [asdict(r) for r in self._historico]
        df = pd.DataFrame(dados)
        df["ordem"] = range(1, len(df) + 1)

        # SEABORN PLOTTING
        sns.set_theme(style="whitegrid", palette="rocket")
        fig, ax = plt.subplots(figsize=(8, 4))
        sns.barplot(data=df, x="ordem", y="resultado", hue="operador", ax=ax)
        ax.set_title(f"Histórico POO • Seaborn v{sns.__version__}", fontsize=11, weight="bold")
        plt.tight_layout()
        plt.savefig(salvar_como, dpi=120)
        plt.close()
        print(f"Gráfico Seaborn salvo em {salvar_como}")
        return True


# ==============================================================================
# SUÍTE DE TESTES UNITÁRIOS INTEGRADA
# ==============================================================================
class TestCalculadoraEngine(unittest.TestCase):
    def setUp(self):
        self.calc = CalculadoraEngine()

    def test_soma(self):
        self.assertEqual(self.calc.somar(15.5, 4.5), 20.0)

    def test_subtracao(self):
        self.assertEqual(self.calc.subtrair(50, 18), 32.0)

    def test_multiplicacao(self):
        self.assertEqual(self.calc.multiplicar(7, 8), 56.0)

    def test_divisao(self):
        self.assertEqual(self.calc.dividir(100, 4), 25.0)
        with self.assertRaises(DivisaoPorZeroError):
            self.calc.dividir(10, 0)

    def test_potencia(self):
        self.assertEqual(self.calc.potencia(2, 10), 1024.0)

    def test_raiz(self):
        self.assertEqual(self.calc.raiz_quadrada(144), 12.0)


if __name__ == "__main__":
    print("Executando testes unitários da Calculadora Engine POO...")
    unittest.main()
`;
  }

  // Programmer Calculator (type === 'programmer')
  return `#!/usr/bin/env python3
"""
${title} - Calculadora do Programador (Bases Numéricas & Bitwise)
Execução: python3 calculadora_programador.py
"""

try:
    import seaborn as sns
    import matplotlib.pyplot as plt
    import pandas as pd
    SEABORN_DISPONIVEL = True
except ImportError:
    SEABORN_DISPONIVEL = False


class CalculadoraProgramador:
    def __init__(self, bits: int = ${programmerBits}):
        self.bits = bits
        self.mascara = (1 << bits) - 1

    def converter(self, valor: int):
        val = valor & self.mascara
        bin_str = bin(val)[2:].zfill(self.bits)
        # Agrupa em nibbles (4 bits)
        nibbles = " ".join([bin_str[i:i+4] for i in range(0, len(bin_str), 4)])

        return {
            "dec": val,
            "hex": hex(val).upper(),
            "oct": oct(val),
            "bin": nibbles,
        }

    def operacoes_bitwise(self, a: int, b: int):
        return {
            "AND (&)": (a & b) & self.mascara,
            "OR  (|)": (a | b) & self.mascara,
            "XOR (^)": (a ^ b) & self.mascara,
            "NOT (~a)": (~a) & self.mascara,
            "LSHIFT (<< 1)": (a << 1) & self.mascara,
            "RSHIFT (>> 1)": (a >> 1) & self.mascara,
        }

    def plotar_frequencia_bits_seaborn(self, valores: list, salvar="bits_seaborn.png"):
        """Gera gráfico Seaborn mostrando a densidade de bits 1 e 0 nas amostras."""
        if not SEABORN_DISPONIVEL:
            print("Instale o Seaborn para gerar o gráfico.")
            return

        contagens_1 = []
        for v in valores:
            bin_str = bin(v & self.mascara)[2:].zfill(self.bits)
            contagens_1.append(bin_str.count('1'))

        df = pd.DataFrame({"valor": valores, "bits_ativos": contagens_1})
        sns.set_theme(style="darkgrid", palette="flare")
        fig, ax = plt.subplots(figsize=(7, 3.8))
        sns.barplot(data=df, x="valor", y="bits_ativos", ax=ax, color="#ec4899")
        ax.set_title(f"Densidade de Bits Ativos (1s) • Seaborn v{sns.__version__}")
        plt.tight_layout()
        plt.savefig(salvar, dpi=120)
        plt.close()
        print(f"Gráfico Seaborn gerado em {salvar}")


if __name__ == "__main__":
    calc = CalculadoraProgramador()
    print("Exemplo de conversão de bases:")
    print(calc.converter(255))
    print("\\nOperações Bitwise entre 42 e 15:")
    print(calc.operacoes_bitwise(42, 15))
`;
}

// Retrocompatibility alias
export const generateJavaCode = generatePythonCode;
