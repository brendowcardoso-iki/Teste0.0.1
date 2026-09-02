#!/usr/bin/env python3
"""
Gerador de Calculadoras em Python (Python Calculator Generator)
Gera scripts de calculadoras personalizadas para Python:
- Interface Gráfica (Tkinter Desktop GUI)
- Científica com Funções Matemáticas Avançadas
- Linha de Comando (CLI / Terminal com cores ANSI e REPL)
- Orientada a Objetos (POO com Engine e Testes Unitários)
- Programador (Bases Numéricas Hex/Bin/Dec/Oct e Operadores Bitwise)
"""

import os
import sys
import argparse
import json
from typing import Dict, Any


def get_tkinter_standard_code(config: Dict[str, Any]) -> str:
    title = config.get("title", "Calculadora Python")
    theme = config.get("theme", "dark")
    bg = "#18181b" if theme == "dark" else "#f4f4f5"
    fg = "#ffffff" if theme == "dark" else "#09090b"
    btn_num_bg = "#27272a" if theme == "dark" else "#e4e4e7"
    btn_op_bg = "#f97316" if theme == "dark" else "#ea580c"
    btn_spec_bg = "#3f3f46" if theme == "dark" else "#d4d4d8"
    display_bg = "#09090b" if theme == "dark" else "#ffffff"

    return f'''#!/usr/bin/env python3
"""
{title}
Gerada automaticamente pelo Gerador de Calculadoras Python.
Execução: python calculadora.py
"""

import tkinter as tk
from tkinter import messagebox
import math


class CalculadoraPadrao:
    def __init__(self, root):
        self.root = root
        self.root.title("{title}")
        self.root.geometry("340x480")
        self.root.resizable(False, False)
        self.root.configure(bg="{bg}")

        self.expressao = ""
        self.historico = []

        # Display principal
        self.display_frame = tk.Frame(self.root, bg="{bg}")
        self.display_frame.pack(fill=tk.BOTH, padx=16, pady=(16, 8))

        self.label_preview = tk.Label(
            self.display_frame,
            text="",
            anchor="e",
            font=("Helvetica", 11),
            fg="#a1a1aa",
            bg="{display_bg}",
            padx=12,
            pady=4
        )
        self.label_preview.pack(fill=tk.X)

        self.display = tk.Entry(
            self.display_frame,
            font=("Helvetica", 26, "bold"),
            justify="right",
            bd=0,
            bg="{display_bg}",
            fg="{fg}",
            highlightthickness=1,
            highlightbackground="#3f3f46",
            insertbackground="{fg}"
        )
        self.display.pack(fill=tk.X, ipady=12)
        self.display.insert(0, "0")

        # Container de Botões
        self.botoes_frame = tk.Frame(self.root, bg="{bg}")
        self.botoes_frame.pack(fill=tk.BOTH, expand=True, padx=16, pady=(8, 16))

        for i in range(5):
            self.botoes_frame.rowconfigure(i, weight=1)
        for j in range(4):
            self.botoes_frame.columnconfigure(j, weight=1)

        botoes = [
            ("C", 0, 0, "{btn_spec_bg}", self.limpar),
            ("+/-", 0, 1, "{btn_spec_bg}", self.inverter_sinal),
            ("%", 0, 2, "{btn_spec_bg}", self.calcular_porcentagem),
            ("÷", 0, 3, "{btn_op_bg}", lambda: self.inserir_operador("/")),

            ("7", 1, 0, "{btn_num_bg}", lambda: self.inserir("7")),
            ("8", 1, 1, "{btn_num_bg}", lambda: self.inserir("8")),
            ("9", 1, 2, "{btn_num_bg}", lambda: self.inserir("9")),
            ("×", 1, 3, "{btn_op_bg}", lambda: self.inserir_operador("*")),

            ("4", 2, 0, "{btn_num_bg}", lambda: self.inserir("4")),
            ("5", 2, 1, "{btn_num_bg}", lambda: self.inserir("5")),
            ("6", 2, 2, "{btn_num_bg}", lambda: self.inserir("6")),
            ("-", 2, 3, "{btn_op_bg}", lambda: self.inserir_operador("-")),

            ("1", 3, 0, "{btn_num_bg}", lambda: self.inserir("1")),
            ("2", 3, 1, "{btn_num_bg}", lambda: self.inserir("2")),
            ("3", 3, 2, "{btn_num_bg}", lambda: self.inserir("3")),
            ("+", 3, 3, "{btn_op_bg}", lambda: self.inserir_operador("+")),

            ("0", 4, 0, "{btn_num_bg}", lambda: self.inserir("0"), 2),
            (".", 4, 2, "{btn_num_bg}", self.inserir_ponto),
            ("=", 4, 3, "{btn_op_bg}", self.calcular),
        ]

        for item in botoes:
            texto = item[0]
            linha = item[1]
            coluna = item[2]
            cor = item[3]
            comando = item[4]
            colspan = item[5] if len(item) > 5 else 1

            btn = tk.Button(
                self.botoes_frame,
                text=texto,
                font=("Helvetica", 14, "bold"),
                bg=cor,
                fg="{fg}" if cor != "{btn_op_bg}" else "#ffffff",
                activebackground=cor,
                activeforeground="{fg}",
                bd=0,
                cursor="hand2",
                command=comando
            )
            btn.grid(row=linha, column=coluna, columnspan=colspan, sticky="nsew", padx=3, pady=3)

        self.root.bind("<Key>", self.evento_teclado)

    def inserir(self, caractere):
        conteudo_atual = self.display.get()
        if conteudo_atual == "0" or conteudo_atual == "Erro":
            self.display.delete(0, tk.END)
            self.display.insert(tk.END, caractere)
        else:
            self.display.insert(tk.END, caractere)

    def inserir_ponto(self):
        conteudo = self.display.get()
        if "." not in conteudo:
            self.display.insert(tk.END, ".")

    def limpar(self):
        self.display.delete(0, tk.END)
        self.display.insert(0, "0")
        self.label_preview.config(text="")
        self.expressao = ""

    def inverter_sinal(self):
        try:
            valor = float(self.display.get())
            if valor.is_integer():
                valor = int(valor)
            novo_valor = -valor
            self.display.delete(0, tk.END)
            self.display.insert(0, str(novo_valor))
        except ValueError:
            pass

    def calcular_porcentagem(self):
        try:
            valor = float(self.display.get()) / 100.0
            if valor.is_integer():
                valor = int(valor)
            self.display.delete(0, tk.END)
            self.display.insert(0, str(valor))
        except ValueError:
            pass

    def inserir_operador(self, operador):
        valor = self.display.get()
        simbolo = " ÷ " if operador == "/" else " × " if operador == "*" else f" {{operador}} "
        self.expressao = f"{{valor}} {{operador}}"
        self.label_preview.config(text=f"{{valor}}{{simbolo}}")
        self.display.delete(0, tk.END)
        self.display.insert(0, "0")

    def calcular(self):
        if not self.expressao:
            return
        segundo_termo = self.display.get()
        termo_completo = f"{{self.expressao}} {{segundo_termo}}"

        try:
            # Validação segura da expressão matemática
            resultado = eval(termo_completo, {{"__builtins__": {{}}}}, {{}})
            if isinstance(resultado, float):
                resultado = round(resultado, 8)
                if resultado.is_integer():
                    resultado = int(resultado)
            self.label_preview.config(text=f"{{termo_completo}} =")
            self.display.delete(0, tk.END)
            self.display.insert(0, str(resultado))
            self.expressao = ""
        except ZeroDivisionError:
            self.display.delete(0, tk.END)
            self.display.insert(0, "Erro: Divisão por 0")
            self.expressao = ""
        except Exception:
            self.display.delete(0, tk.END)
            self.display.insert(0, "Erro")
            self.expressao = ""

    def evento_teclado(self, event):
        if event.char in "0123456789":
            self.inserir(event.char)
        elif event.char in ["+", "-", "*", "/"]:
            self.inserir_operador(event.char)
        elif event.char in [".", ","]:
            self.inserir_ponto()
        elif event.keysym in ["Return", "KP_Enter"]:
            self.calcular()
        elif event.keysym == "Escape":
            self.limpar()
        elif event.keysym == "BackSpace":
            conteudo = self.display.get()
            if len(conteudo) > 1:
                self.display.delete(len(conteudo) - 1, tk.END)
            else:
                self.display.delete(0, tk.END)
                self.display.insert(0, "0")


if __name__ == "__main__":
    janela = tk.Tk()
    app = CalculadoraPadrao(janela)
    janela.mainloop()
'''


def get_tkinter_scientific_code(config: Dict[str, Any]) -> str:
    title = config.get("title", "Calculadora Científica Python")
    return f'''#!/usr/bin/env python3
"""
{title}
Suporte a cálculos trigonométricos, logaritmos, potenciação, raiz e constantes.
Execução: python calculadora_cientifica.py
"""

import tkinter as tk
from tkinter import ttk
import math


class CalculadoraCientifica:
    def __init__(self, root):
        self.root = root
        self.root.title("{title}")
        self.root.geometry("460x580")
        self.root.resizable(False, False)
        self.root.configure(bg="#0f172a")

        self.graus = True  # Modo Graus ou Radianos
        self.memoria = 0.0
        self.historico = []

        self._construir_interface()

    def _construir_interface(self):
        # Top bar: Modo Ângulo & Memória
        topo = tk.Frame(self.root, bg="#0f172a")
        topo.pack(fill=tk.X, padx=16, pady=(12, 4))

        self.btn_modo_ang = tk.Button(
            topo,
            text="DEG",
            font=("Helvetica", 10, "bold"),
            bg="#1e293b",
            fg="#38bdf8",
            bd=0,
            padx=10,
            pady=2,
            cursor="hand2",
            command=self.alternar_angulo
        )
        self.btn_modo_ang.pack(side=tk.LEFT)

        self.lbl_mem = tk.Label(
            topo,
            text="M: 0",
            font=("Helvetica", 9),
            bg="#0f172a",
            fg="#94a3b8"
        )
        self.lbl_mem.pack(side=tk.RIGHT)

        # Display de Fórmula e Resultado
        display_box = tk.Frame(self.root, bg="#020617", bd=1, relief=tk.SOLID)
        display_box.pack(fill=tk.X, padx=16, pady=6)

        self.lbl_expressao = tk.Label(
            display_box,
            text="",
            font=("Helvetica", 11),
            fg="#64748b",
            bg="#020617",
            anchor="e",
            padx=12,
            pady=4
        )
        self.lbl_expressao.pack(fill=tk.X)

        self.display = tk.Entry(
            display_box,
            font=("Helvetica", 24, "bold"),
            justify="right",
            bd=0,
            bg="#020617",
            fg="#f8fafc",
            insertbackground="#f8fafc"
        )
        self.display.pack(fill=tk.X, padx=8, pady=(0, 10))
        self.display.insert(0, "0")

        # Grade de Botões Científicos
        grid_frame = tk.Frame(self.root, bg="#0f172a")
        grid_frame.pack(fill=tk.BOTH, expand=True, padx=16, pady=(6, 16))

        for r in range(7):
            grid_frame.rowconfigure(r, weight=1)
        for c in range(5):
            grid_frame.columnconfigure(c, weight=1)

        botoes = [
            # Linha 0: Memória & Constantes
            ("MC", 0, 0, "#1e293b", "#94a3b8", self.mem_clear),
            ("MR", 0, 1, "#1e293b", "#94a3b8", self.mem_recall),
            ("M+", 0, 2, "#1e293b", "#94a3b8", self.mem_add),
            ("π", 0, 3, "#1e293b", "#38bdf8", lambda: self.inserir_constante(math.pi)),
            ("e", 0, 4, "#1e293b", "#38bdf8", lambda: self.inserir_constante(math.e)),

            # Linha 1: Trigonometria & Raiz
            ("sin", 1, 0, "#1e293b", "#38bdf8", lambda: self.funcao_unaria("sin")),
            ("cos", 1, 1, "#1e293b", "#38bdf8", lambda: self.funcao_unaria("cos")),
            ("tan", 1, 2, "#1e293b", "#38bdf8", lambda: self.funcao_unaria("tan")),
            ("√", 1, 3, "#1e293b", "#38bdf8", lambda: self.funcao_unaria("sqrt")),
            ("x²", 1, 4, "#1e293b", "#38bdf8", lambda: self.funcao_unaria("sqr")),

            # Linha 2: Logaritmos & Potência
            ("ln", 2, 0, "#1e293b", "#38bdf8", lambda: self.funcao_unaria("ln")),
            ("log", 2, 1, "#1e293b", "#38bdf8", lambda: self.funcao_unaria("log10")),
            ("xʸ", 2, 2, "#1e293b", "#38bdf8", lambda: self.inserir_operador("**")),
            ("n!", 2, 3, "#1e293b", "#38bdf8", lambda: self.funcao_unaria("fact")),
            ("1/x", 2, 4, "#1e293b", "#38bdf8", lambda: self.funcao_unaria("inv")),

            # Linha 3: Controles & Divisão
            ("C", 3, 0, "#334155", "#f87171", self.limpar_tudo),
            ("CE", 3, 1, "#334155", "#cbd5e1", self.limpar_entrada),
            ("(", 3, 2, "#334155", "#cbd5e1", lambda: self.inserir("(")),
            (")", 3, 3, "#334155", "#cbd5e1", lambda: self.inserir(")")),
            ("÷", 3, 4, "#0284c7", "#ffffff", lambda: self.inserir_operador("/")),

            # Linha 4: 7, 8, 9 & Multiplicação
            ("7", 4, 0, "#1e293b", "#f8fafc", lambda: self.inserir("7")),
            ("8", 4, 1, "#1e293b", "#f8fafc", lambda: self.inserir("8")),
            ("9", 4, 2, "#1e293b", "#f8fafc", lambda: self.inserir("9")),
            ("%", 4, 3, "#334155", "#cbd5e1", lambda: self.funcao_unaria("pct")),
            ("×", 4, 4, "#0284c7", "#ffffff", lambda: self.inserir_operador("*")),

            # Linha 5: 4, 5, 6 & Subtração
            ("4", 5, 0, "#1e293b", "#f8fafc", lambda: self.inserir("4")),
            ("5", 5, 1, "#1e293b", "#f8fafc", lambda: self.inserir("5")),
            ("6", 5, 2, "#1e293b", "#f8fafc", lambda: self.inserir("6")),
            ("+/-", 5, 3, "#334155", "#cbd5e1", self.inverter_sinal),
            ("-", 5, 4, "#0284c7", "#ffffff", lambda: self.inserir_operador("-")),

            # Linha 6: 1, 2, 3, 0, ., = & Adição
            ("1", 6, 0, "#1e293b", "#f8fafc", lambda: self.inserir("1")),
            ("2", 6, 1, "#1e293b", "#f8fafc", lambda: self.inserir("2")),
            ("3", 6, 2, "#1e293b", "#f8fafc", lambda: self.inserir("3")),
            ("0", 7, 0, "#1e293b", "#f8fafc", lambda: self.inserir("0")),
            (".", 7, 1, "#1e293b", "#f8fafc", lambda: self.inserir(".")),
            ("=", 7, 2, "#059669", "#ffffff", self.calcular, 2),
            ("+", 6, 4, "#0284c7", "#ffffff", lambda: self.inserir_operador("+")),
        ]

        for item in botoes:
            txt, r, c, bg_c, fg_c, cmd = item[:6]
            cspan = item[6] if len(item) > 6 else 1
            btn = tk.Button(
                grid_frame,
                text=txt,
                font=("Helvetica", 11, "bold"),
                bg=bg_c,
                fg=fg_c,
                activebackground=bg_c,
                activeforeground=fg_c,
                bd=0,
                cursor="hand2",
                command=cmd
            )
            btn.grid(row=r, column=c, columnspan=cspan, sticky="nsew", padx=2, pady=2)

    def alternar_angulo(self):
        self.graus = not self.graus
        self.btn_modo_ang.config(text="DEG" if self.graus else "RAD")

    def inserir(self, char):
        cur = self.display.get()
        if cur == "0" and char not in ".":
            self.display.delete(0, tk.END)
            self.display.insert(tk.END, char)
        elif cur == "Erro":
            self.display.delete(0, tk.END)
            self.display.insert(tk.END, char)
        else:
            self.display.insert(tk.END, char)

    def inserir_constante(self, val):
        self.display.delete(0, tk.END)
        self.display.insert(0, f"{{val:.8g}}")

    def limpar_tudo(self):
        self.display.delete(0, tk.END)
        self.display.insert(0, "0")
        self.lbl_expressao.config(text="")

    def limpar_entrada(self):
        self.display.delete(0, tk.END)
        self.display.insert(0, "0")

    def inverter_sinal(self):
        try:
            v = float(self.display.get())
            res = -v
            self.display.delete(0, tk.END)
            self.display.insert(0, f"{{int(res) if res.is_integer() else res}}")
        except ValueError:
            pass

    def inserir_operador(self, op):
        cur = self.display.get()
        self.lbl_expressao.config(text=f"{{self.lbl_expressao['text']}} {{cur}} {{op}}")
        self.display.delete(0, tk.END)
        self.display.insert(0, "0")

    def funcao_unaria(self, nome):
        try:
            x = float(self.display.get())
            if nome == "sin":
                rad = math.radians(x) if self.graus else x
                res = math.sin(rad)
            elif nome == "cos":
                rad = math.radians(x) if self.graus else x
                res = math.cos(rad)
            elif nome == "tan":
                rad = math.radians(x) if self.graus else x
                res = math.tan(rad)
            elif nome == "sqrt":
                if x < 0:
                    raise ValueError("Raiz de número negativo")
                res = math.sqrt(x)
            elif nome == "sqr":
                res = x ** 2
            elif nome == "ln":
                res = math.log(x)
            elif nome == "log10":
                res = math.log10(x)
            elif nome == "fact":
                if x < 0 or not x.is_integer():
                    raise ValueError("Fatorial requer inteiro >= 0")
                res = math.factorial(int(x))
            elif nome == "inv":
                res = 1 / x
            elif nome == "pct":
                res = x / 100.0
            else:
                return

            if isinstance(res, float):
                res = round(res, 8)
                if res.is_integer():
                    res = int(res)

            self.display.delete(0, tk.END)
            self.display.insert(0, str(res))
        except Exception as err:
            self.display.delete(0, tk.END)
            self.display.insert(0, "Erro")

    def mem_clear(self):
        self.memoria = 0.0
        self.lbl_mem.config(text="M: 0")

    def mem_recall(self):
        self.display.delete(0, tk.END)
        v = self.memoria
        self.display.insert(0, f"{{int(v) if v.is_integer() else v}}")

    def mem_add(self):
        try:
            self.memoria += float(self.display.get())
            self.lbl_mem.config(text=f"M: {{self.memoria:.3g}}")
        except ValueError:
            pass

    def calcular(self):
        formula = f"{{self.lbl_expressao['text']}} {{self.display.get()}}".strip()
        if not formula:
            return
        try:
            # Avaliação com escopo matemático seguro
            escopo = {{
                "math": math,
                "pi": math.pi,
                "e": math.e,
                "sin": math.sin,
                "cos": math.cos,
                "tan": math.tan,
                "sqrt": math.sqrt
            }}
            res = eval(formula, {{"__builtins__": {{}}}}, escopo)
            if isinstance(res, float):
                res = round(res, 8)
                if res.is_integer():
                    res = int(res)
            self.lbl_expressao.config(text=f"{{formula}} =")
            self.display.delete(0, tk.END)
            self.display.insert(0, str(res))
        except ZeroDivisionError:
            self.display.delete(0, tk.END)
            self.display.insert(0, "Divisão por Zero")
        except Exception:
            self.display.delete(0, tk.END)
            self.display.insert(0, "Erro de Sintaxe")


if __name__ == "__main__":
    janela = tk.Tk()
    app = CalculadoraCientifica(janela)
    janela.mainloop()
'''


def get_cli_calculator_code(config: Dict[str, Any]) -> str:
    title = config.get("title", "Calculadora Interativa de Terminal")
    return f'''#!/usr/bin/env python3
"""
{title}
Calculadora completa via Terminal (CLI) com cores ANSI, histórico e avaliação segura.
Execução: python calculadora_cli.py
"""

import sys
import math
import ast
import operator
from typing import Union, List

# Cores ANSI para visual no Terminal
AZUL = "\\033[94m"
VERDE = "\\033[92m"
AMARELO = "\\033[93m"
VERMELHO = "\\033[91m"
CIANO = "\\033[96m"
NEGRITO = "\\033[1m"
RESET = "\\033[0m"


class SafeCalculator:
    """Avaliador de expressões matemáticas seguro usando AST (sem eval inseguro)."""

    OPERADORES = {{
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.FloorDiv: operator.floordiv,
        ast.Mod: operator.mod,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
        ast.UAdd: operator.pos,
    }}

    FUNCOES = {{
        "sqrt": math.sqrt,
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "log": math.log10,
        "ln": math.log,
        "abs": abs,
        "round": round,
        "fact": math.factorial,
    }}

    CONSTANTES = {{
        "pi": math.pi,
        "e": math.e,
        "tau": math.tau,
    }}

    def __init__(self):
        self.historico: List[str] = []
        self.memoria: float = 0.0

    def avaliar(self, expressao: str) -> Union[int, float]:
        """Avalia com segurança uma expressão matemática."""
        arvore = ast.parse(expressao.strip(), mode="eval")
        return self._visitar(arvore.body)

    def _visitar(self, no):
        if isinstance(no, ast.Constant):  # Python 3.8+ (números)
            return no.value
        elif isinstance(no, ast.Name):
            nome = no.id.lower()
            if nome in self.CONSTANTES:
                return self.CONSTANTES[nome]
            elif nome == "ans" and self.historico:
                # Último resultado
                return float(self.historico[-1].split("=")[-1].strip())
            raise ValueError(f"Identificador desconhecido: '{{no.id}}'")
        elif isinstance(no, ast.BinOp):
            tipo_op = type(no.op)
            if tipo_op in self.OPERADORES:
                esquerdo = self._visitar(no.left)
                direito = self._visitar(no.right)
                if tipo_op == ast.Div and direito == 0:
                    raise ZeroDivisionError("Divisão por zero não é permitida.")
                return self.OPERADORES[tipo_op](esquerdo, direito)
            raise ValueError(f"Operador binário não suportado: {{tipo_op.__name__}}")
        elif isinstance(no, ast.UnaryOp):
            tipo_op = type(no.op)
            if tipo_op in self.OPERADORES:
                return self.OPERADORES[tipo_op](self._visitar(no.operand))
            raise ValueError("Operador unário não suportado.")
        elif isinstance(no, ast.Call):
            if isinstance(no.func, ast.Name):
                nome_func = no.func.id.lower()
                if nome_func in self.FUNCOES:
                    args = [self._visitar(arg) for arg in no.args]
                    return self.FUNCOES[nome_func](*args)
            raise ValueError("Chamada de função inválida ou desabilitada.")
        else:
            raise TypeError(f"Expressão não suportada: {{type(no).__name__}}")


def banner():
    print(f"{{CIANO}}{{NEGRITO}}=================================================={{RESET}}")
    print(f"{{VERDE}}{{NEGRITO}}           CALCULADORA PYTHON (CLI INTERATIVO)   {{RESET}}")
    print(f"{{CIANO}}{{NEGRITO}}=================================================={{RESET}}")
    print(f"Exemplos: 2 + 2, (10 * 5) / 2, sqrt(144), sin(pi / 2), 2 ** 8")
    print(f"Comandos especiais:")
    print(f"  {{AMARELO}}hist{{RESET}}  - Ver histórico de cálculos")
    print(f"  {{AMARELO}}m+{{RESET}}    - Adicionar valor atual à memória")
    print(f"  {{AMARELO}}mr{{RESET}}    - Recuperar valor da memória")
    print(f"  {{AMARELO}}mc{{RESET}}    - Limpar memória")
    print(f"  {{AMARELO}}ajuda{{RESET}} - Ajuda e funções disponíveis")
    print(f"  {{VERMELHO}}sair{{RESET}}  - Finalizar a calculadora")
    print(f"--------------------------------------------------\\n")


def loop_calculadora():
    calc = SafeCalculator()
    banner()

    while True:
        try:
            entrada = input(f"{{NEGRITO}}calc > {{RESET}}").strip()
        except (KeyboardInterrupt, EOFError):
            print(f"\\n{{VERDE}}Até logo!{{RESET}}")
            break

        if not entrada:
            continue

        cmd = entrada.lower()
        if cmd in ["sair", "exit", "quit", "q"]:
            print(f"{{VERDE}}Calculadora encerrada com sucesso.{{RESET}}")
            break
        elif cmd in ["hist", "historico"]:
            if not calc.historico:
                print(f"{{AMARELO}}Nenhum cálculo registrado ainda.{{RESET}}")
            else:
                print(f"{{CIANO}}--- Histórico de Cálculos ---{{RESET}}")
                for i, item in enumerate(calc.historico[-10:], 1):
                    print(f" {{i}}. {{item}}")
            continue
        elif cmd == "mc":
            calc.memoria = 0.0
            print(f"{{AMARELO}}Memória limpa: M = 0{{RESET}}")
            continue
        elif cmd == "mr":
            print(f"{{VERDE}}Memória (MR): {{calc.memoria}}{{RESET}}")
            continue
        elif cmd.startswith("m+"):
            try:
                val = float(cmd.split()[1]) if len(cmd.split()) > 1 else (float(calc.historico[-1].split("=")[-1].strip()) if calc.historico else 0.0)
                calc.memoria += val
                print(f"{{VERDE}}Memória atualizada: M = {{calc.memoria}}{{RESET}}")
            except Exception as e:
                print(f"{{VERMELHO}}Erro ao atualizar memória: {{e}}{{RESET}}")
            continue
        elif cmd in ["ajuda", "help", "?"]:
            print(f"{{CIANO}}Funções suportadas: sqrt(x), sin(x), cos(x), tan(x), log(x), ln(x), fact(x), abs(x)")
            print(f"Constantes: pi, e, tau | Operadores: +, -, *, /, //, %, **{{RESET}}")
            continue

        try:
            resultado = calc.avaliar(entrada)
            if isinstance(resultado, float):
                resultado = round(resultado, 8)
                if resultado.is_integer():
                    resultado = int(resultado)
            calc.historico.append(f"{{entrada}} = {{resultado}}")
            print(f"{{VERDE}}{{NEGRITO}}= {{resultado}}{{RESET}}")
        except ZeroDivisionError as err:
            print(f"{{VERMELHO}}Erro de Divisão: {{err}}{{RESET}}")
        except Exception as err:
            print(f"{{VERMELHO}}Erro: {{err}}{{RESET}}")


if __name__ == "__main__":
    loop_calculadora()
'''


def get_oop_engine_code(config: Dict[str, Any]) -> str:
    title = config.get("title", "Engine de Calculadora Orientada a Objetos")
    return f'''#!/usr/bin/env python3
"""
{title}
Classe completa com encapsulamento, histórico estruturado,
métodos estáticos e suite de testes unitários integrada (unittest).
Execução direta roda os testes: python calculadora_oop.py
"""

from typing import List, Dict, Any, Union
import math
import time
import json
import unittest


class CalculadoraEngine:
    """Motor de cálculo com histórico, validação e persistência."""

    def __init__(self, precisao: int = 6):
        self.precisao = precisao
        self._historico: List[Dict[str, Any]] = []
        self._memoria: float = 0.0

    # Operações Aritméticas Fundamentais
    def somar(self, a: float, b: float) -> float:
        res = a + b
        self._registrar("+", a, b, res)
        return self._formatar(res)

    def subtrair(self, a: float, b: float) -> float:
        res = a - b
        self._registrar("-", a, b, res)
        return self._formatar(res)

    def multiplicar(self, a: float, b: float) -> float:
        res = a * b
        self._registrar("*", a, b, res)
        return self._formatar(res)

    def dividir(self, a: float, b: float) -> float:
        if b == 0:
            raise ZeroDivisionError("Divisão por zero não é permitida.")
        res = a / b
        self._registrar("/", a, b, res)
        return self._formatar(res)

    def potencia(self, base: float, expoente: float) -> float:
        res = math.pow(base, expoente)
        self._registrar("^", base, expoente, res)
        return self._formatar(res)

    def raiz_quadrada(self, x: float) -> float:
        if x < 0:
            raise ValueError("Não é possível calcular raiz quadrada real de número negativo.")
        res = math.sqrt(x)
        self._registrar("sqrt", x, None, res)
        return self._formatar(res)

    def porcentagem(self, total: float, pct: float) -> float:
        res = (total * pct) / 100.0
        self._registrar("%", total, pct, res)
        return self._formatar(res)

    # Gestão de Memória
    def mem_armazenar(self, valor: float) -> None:
        self._memoria = valor

    def mem_adicionar(self, valor: float) -> None:
        self._memoria += valor

    def mem_limpar(self) -> None:
        self._memoria = 0.0

    @property
    def memoria(self) -> float:
        return self._memoria

    # Histórico & Auditoria
    def _registrar(self, op: str, a: Any, b: Any, resultado: float) -> None:
        registro = {{
            "timestamp": time.time(),
            "operacao": op,
            "termo_a": a,
            "termo_b": b,
            "resultado": self._formatar(resultado)
        }}
        self._historico.append(registro)

    def obter_historico(self) -> List[Dict[str, Any]]:
        return list(self._historico)

    def limpar_historico(self) -> None:
        self._historico.clear()

    def exportar_json(self) -> str:
        return json.dumps(self._historico, indent=2)

    def _formatar(self, valor: float) -> Union[int, float]:
        arredondado = round(valor, self.precisao)
        if isinstance(arredondado, float) and arredondado.is_integer():
            return int(arredondado)
        return arredondado


# ==========================================
# TESTES UNITÁRIOS AUTOMATIZADOS
# ==========================================
class TestCalculadoraEngine(unittest.TestCase):
    def setUp(self):
        self.calc = CalculadoraEngine()

    def test_soma(self):
        self.assertEqual(self.calc.somar(10, 5), 15)
        self.assertEqual(self.calc.somar(-3, 8), 5)

    def test_subtracao(self):
        self.assertEqual(self.calc.subtrair(20, 7), 13)

    def test_multiplicacao(self):
        self.assertEqual(self.calc.multiplicar(4, 2.5), 10)

    def test_divisao(self):
        self.assertEqual(self.calc.dividir(10, 2), 5)
        with self.assertRaises(ZeroDivisionError):
            self.calc.dividir(5, 0)

    def test_potencia_e_raiz(self):
        self.assertEqual(self.calc.potencia(2, 8), 256)
        self.assertEqual(self.calc.raiz_quadrada(144), 12)
        with self.assertRaises(ValueError):
            self.calc.raiz_quadrada(-9)

    def test_historico(self):
        self.calc.somar(2, 3)
        self.calc.multiplicar(5, 2)
        hist = self.calc.obter_historico()
        self.assertEqual(len(hist), 2)
        self.assertEqual(hist[0]["resultado"], 5)


if __name__ == "__main__":
    print("=" * 60)
    print("Executando Suíte de Testes da Calculadora OOP...")
    print("=" * 60)
    unittest.main(verbosity=2)
'''


def get_programmer_calculator_code(config: Dict[str, Any]) -> str:
    title = config.get("title", "Calculadora do Programador (Bases & Bitwise)")
    return f'''#!/usr/bin/env python3
"""
{title}
Conversão simultânea entre Decimal, Hexadecimal, Binário e Octal,
mais operações lógicas bit a bit (AND, OR, XOR, NOT, Shift).
Execução: python calculadora_programador.py
"""

import sys


class CalculadoraProgramador:
    def __init__(self, bits: int = 32):
        self.bits = bits
        self.mascara = (1 << bits) - 1

    def converter(self, valor: int) -> dict:
        v_trunc = valor & self.mascara
        return {{
            "dec": str(valor),
            "hex": hex(v_trunc).upper().replace("X", "x"),
            "bin": bin(v_trunc)[2:].zfill(self.bits),
            "oct": oct(v_trunc),
        }}

    def operacao_bitwise(self, op: str, a: int, b: int = 0) -> int:
        if op == "AND":
            return (a & b) & self.mascara
        elif op == "OR":
            return (a | b) & self.mascara
        elif op == "XOR":
            return (a ^ b) & self.mascara
        elif op == "NOT":
            return (~a) & self.mascara
        elif op == "SHL":
            return (a << b) & self.mascara
        elif op == "SHR":
            return (a >> b) & self.mascara
        else:
            raise ValueError(f"Operador bitwise '{{op}}' desconhecido")


def main():
    calc = CalculadoraProgramador(bits=32)
    print("=" * 50)
    print("   CALCULADORA DO PROGRAMADOR (BASES & BITS)   ")
    print("=" * 50)
    print("Exemplos de entrada de valor:")
    print("  Decimal: 255  |  Hex: 0xFF  |  Bin: 0b11111111\\n")

    while True:
        try:
            entrada = input("Digite um número ou expressão (ou 'sair'): ").strip()
        except (KeyboardInterrupt, EOFError):
            break

        if not entrada or entrada.lower() in ["sair", "exit"]:
            break

        try:
            # Reconhece prefixos 0x, 0b, 0o ou int comum
            num = int(entrada, 0)
            res = calc.converter(num)
            print(f"\\n--- Representação em Múltiplas Bases ({{calc.bits}} bits) ---")
            print(f"  DEC: {{res['dec']}}")
            print(f"  HEX: {{res['hex']}}")
            print(f"  OCT: {{res['oct']}}")
            # Agrupa binário em nibbles de 4 bits para legibilidade
            bin_fmt = " ".join(res["bin"][i:i+4] for i in range(0, len(res["bin"]), 4))
            print(f"  BIN: {{bin_fmt}}\\n")
        except Exception as err:
            print(f"Erro: {{err}}\\n")


if __name__ == "__main__":
    main()
'''


TEMPLATES = {
    "gui_standard": {
        "nome": "Tkinter GUI (Padrão)",
        "descricao": "Interface gráfica desktop nativa com botões modernos, teclado e histórico",
        "arquivo": "calculadora_gui.py",
        "gerador": get_tkinter_standard_code,
    },
    "gui_scientific": {
        "nome": "Tkinter GUI (Científica)",
        "descricao": "Interface gráfica avançada com trigonometria, logaritmos, constantes e memória",
        "arquivo": "calculadora_cientifica_gui.py",
        "gerador": get_tkinter_scientific_code,
    },
    "cli_interactive": {
        "nome": "Terminal CLI Interativo (REPL)",
        "descricao": "Calculadora via linha de comando com cores ANSI, histórico e avaliação matemática segura",
        "arquivo": "calculadora_cli.py",
        "gerador": get_cli_calculator_code,
    },
    "oop_engine": {
        "nome": "Orientada a Objetos (POO + Testes)",
        "descricao": "Engine modular em classes com tratamento de exceções, auditoria e testes unitários",
        "arquivo": "calculadora_oop.py",
        "gerador": get_oop_engine_code,
    },
    "programmer": {
        "nome": "Programador (Bases e Bitwise)",
        "descricao": "Conversor e calculadora de bits para Hex, Bin, Dec, Oct com operadores lógicos",
        "arquivo": "calculadora_programador.py",
        "gerador": get_programmer_calculator_code,
    }
}


def gerar_calculadora(tipo: str, output_file: str = None, config: Dict[str, Any] = None) -> str:
    if config is None:
        config = {}
    if tipo not in TEMPLATES:
        raise ValueError(f"Tipo inválido: {{tipo}}. Tipos válidos: {{list(TEMPLATES.keys())}}")

    info = TEMPLATES[tipo]
    codigo = info["gerador"](config)
    nome_arquivo = output_file or info["arquivo"]

    with open(nome_arquivo, "w", encoding="utf-8") as f:
        f.write(codigo)

    return nome_arquivo


def menu_interativo():
    print("=" * 60)
    print("       GERADOR DE CALCULADORAS EM PYTHON")
    print("=" * 60)
    print("Escolha o tipo de calculadora que deseja gerar:\\n")

    chaves = list(TEMPLATES.keys())
    for idx, key in enumerate(chaves, 1):
        item = TEMPLATES[key]
        print(f" [{idx}] {item['nome']}")
        print(f"     {item['descricao']}")
        print(f"     Arquivo padrão: {item['arquivo']}\\n")

    print(" [0] Gerar TODOS os modelos de uma vez")
    print("------------------------------------------------------------")

    try:
        escolha = input("Selecione uma opção [0-5]: ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\nOperação cancelada.")
        return

    if escolha == "0":
        print("\nGerando todos os modelos...")
        for key in chaves:
            arquivo = gerar_calculadora(key)
            print(f"  -> Criado com sucesso: {arquivo}")
        print("\nConcluído! Todos os scripts estão prontos para execução.")
    elif escolha in ["1", "2", "3", "4", "5"]:
        tipo_selecionado = chaves[int(escolha) - 1]
        custom_name = input(f"Nome do arquivo de saída (Enter para padrão '{TEMPLATES[tipo_selecionado]['arquivo']}'): ").strip()
        arquivo_final = custom_name if custom_name else None
        
        titulo = input("Título da calculadora (Enter para padrão): ").strip()
        cfg = {"theme": "dark"}
        if titulo:
            cfg["title"] = titulo

        arquivo = gerar_calculadora(tipo_selecionado, arquivo_final, cfg)
        print(f"\n[SUCESSO] Calculadora gerada no arquivo: {arquivo}")
        print(f"Para executar agora, digite: python3 {arquivo}")
    else:
        print("Opção inválida.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gerador de Calculadoras em Python")
    parser.add_argument(
        "--tipo",
        choices=list(TEMPLATES.keys()) + ["all"],
        help="Tipo de calculadora a gerar (gui_standard, gui_scientific, cli_interactive, oop_engine, programmer, all)"
    )
    parser.add_argument("--saida", help="Caminho do arquivo .py de saída")
    parser.add_argument("--titulo", help="Título personalizado da calculadora")
    parser.add_argument("--tema", choices=["dark", "light"], default="dark", help="Tema de cores (dark ou light)")

    args = parser.parse_args()

    if args.tipo:
        config = {"theme": args.tema}
        if args.titulo:
            config["title"] = args.titulo

        if args.tipo == "all":
            for k in TEMPLATES.keys():
                arqv = gerar_calculadora(k, config=config)
                print(f"Gerado: {arqv}")
        else:
            arqv = gerar_calculadora(args.tipo, args.saida, config=config)
            print(f"Calculadora gerada com sucesso: {arqv}")
    else:
        menu_interativo()
