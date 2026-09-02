#!/usr/bin/env python3
"""
Calculadora Científica Python
Suporte a cálculos trigonométricos, logaritmos, potenciação, raiz e constantes.
Execução: python calculadora_cientifica.py
"""

import tkinter as tk
from tkinter import ttk
import math


class CalculadoraCientifica:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculadora Científica Python")
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
        self.display.insert(0, f"{val:.8g}")

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
            self.display.insert(0, f"{int(res) if res.is_integer() else res}")
        except ValueError:
            pass

    def inserir_operador(self, op):
        cur = self.display.get()
        self.lbl_expressao.config(text=f"{self.lbl_expressao['text']} {cur} {op}")
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
        self.display.insert(0, f"{int(v) if v.is_integer() else v}")

    def mem_add(self):
        try:
            self.memoria += float(self.display.get())
            self.lbl_mem.config(text=f"M: {self.memoria:.3g}")
        except ValueError:
            pass

    def calcular(self):
        formula = f"{self.lbl_expressao['text']} {self.display.get()}".strip()
        if not formula:
            return
        try:
            # Avaliação com escopo matemático seguro
            escopo = {
                "math": math,
                "pi": math.pi,
                "e": math.e,
                "sin": math.sin,
                "cos": math.cos,
                "tan": math.tan,
                "sqrt": math.sqrt
            }
            res = eval(formula, {"__builtins__": {}}, escopo)
            if isinstance(res, float):
                res = round(res, 8)
                if res.is_integer():
                    res = int(res)
            self.lbl_expressao.config(text=f"{formula} =")
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
