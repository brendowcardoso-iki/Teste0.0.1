#!/usr/bin/env python3
"""
Calculadora Python
Gerada automaticamente pelo Gerador de Calculadoras Python.
Execução: python calculadora.py
"""

import tkinter as tk
from tkinter import messagebox
import math


class CalculadoraPadrao:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculadora Python")
        self.root.geometry("340x480")
        self.root.resizable(False, False)
        self.root.configure(bg="#18181b")

        self.expressao = ""
        self.historico = []

        # Display principal
        self.display_frame = tk.Frame(self.root, bg="#18181b")
        self.display_frame.pack(fill=tk.BOTH, padx=16, pady=(16, 8))

        self.label_preview = tk.Label(
            self.display_frame,
            text="",
            anchor="e",
            font=("Helvetica", 11),
            fg="#a1a1aa",
            bg="#09090b",
            padx=12,
            pady=4
        )
        self.label_preview.pack(fill=tk.X)

        self.display = tk.Entry(
            self.display_frame,
            font=("Helvetica", 26, "bold"),
            justify="right",
            bd=0,
            bg="#09090b",
            fg="#ffffff",
            highlightthickness=1,
            highlightbackground="#3f3f46",
            insertbackground="#ffffff"
        )
        self.display.pack(fill=tk.X, ipady=12)
        self.display.insert(0, "0")

        # Container de Botões
        self.botoes_frame = tk.Frame(self.root, bg="#18181b")
        self.botoes_frame.pack(fill=tk.BOTH, expand=True, padx=16, pady=(8, 16))

        for i in range(5):
            self.botoes_frame.rowconfigure(i, weight=1)
        for j in range(4):
            self.botoes_frame.columnconfigure(j, weight=1)

        botoes = [
            ("C", 0, 0, "#3f3f46", self.limpar),
            ("+/-", 0, 1, "#3f3f46", self.inverter_sinal),
            ("%", 0, 2, "#3f3f46", self.calcular_porcentagem),
            ("÷", 0, 3, "#f97316", lambda: self.inserir_operador("/")),

            ("7", 1, 0, "#27272a", lambda: self.inserir("7")),
            ("8", 1, 1, "#27272a", lambda: self.inserir("8")),
            ("9", 1, 2, "#27272a", lambda: self.inserir("9")),
            ("×", 1, 3, "#f97316", lambda: self.inserir_operador("*")),

            ("4", 2, 0, "#27272a", lambda: self.inserir("4")),
            ("5", 2, 1, "#27272a", lambda: self.inserir("5")),
            ("6", 2, 2, "#27272a", lambda: self.inserir("6")),
            ("-", 2, 3, "#f97316", lambda: self.inserir_operador("-")),

            ("1", 3, 0, "#27272a", lambda: self.inserir("1")),
            ("2", 3, 1, "#27272a", lambda: self.inserir("2")),
            ("3", 3, 2, "#27272a", lambda: self.inserir("3")),
            ("+", 3, 3, "#f97316", lambda: self.inserir_operador("+")),

            ("0", 4, 0, "#27272a", lambda: self.inserir("0"), 2),
            (".", 4, 2, "#27272a", self.inserir_ponto),
            ("=", 4, 3, "#f97316", self.calcular),
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
                fg="#ffffff" if cor != "#f97316" else "#ffffff",
                activebackground=cor,
                activeforeground="#ffffff",
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
        simbolo = " ÷ " if operador == "/" else " × " if operador == "*" else f" {operador} "
        self.expressao = f"{valor} {operador}"
        self.label_preview.config(text=f"{valor}{simbolo}")
        self.display.delete(0, tk.END)
        self.display.insert(0, "0")

    def calcular(self):
        if not self.expressao:
            return
        segundo_termo = self.display.get()
        termo_completo = f"{self.expressao} {segundo_termo}"

        try:
            # Validação segura da expressão matemática
            resultado = eval(termo_completo, {"__builtins__": {}}, {})
            if isinstance(resultado, float):
                resultado = round(resultado, 8)
                if resultado.is_integer():
                    resultado = int(resultado)
            self.label_preview.config(text=f"{termo_completo} =")
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
