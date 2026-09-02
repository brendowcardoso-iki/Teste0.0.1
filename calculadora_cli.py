#!/usr/bin/env python3
"""
Calculadora Interativa de Terminal
Calculadora completa via Terminal (CLI) com cores ANSI, histórico e avaliação segura.
Execução: python calculadora_cli.py
"""

import sys
import math
import ast
import operator
from typing import Union, List

# Cores ANSI para visual no Terminal
AZUL = "\033[94m"
VERDE = "\033[92m"
AMARELO = "\033[93m"
VERMELHO = "\033[91m"
CIANO = "\033[96m"
NEGRITO = "\033[1m"
RESET = "\033[0m"


class SafeCalculator:
    """Avaliador de expressões matemáticas seguro usando AST (sem eval inseguro)."""

    OPERADORES = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
        ast.FloorDiv: operator.floordiv,
        ast.Mod: operator.mod,
        ast.Pow: operator.pow,
        ast.USub: operator.neg,
        ast.UAdd: operator.pos,
    }

    FUNCOES = {
        "sqrt": math.sqrt,
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "log": math.log10,
        "ln": math.log,
        "abs": abs,
        "round": round,
        "fact": math.factorial,
    }

    CONSTANTES = {
        "pi": math.pi,
        "e": math.e,
        "tau": math.tau,
    }

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
            raise ValueError(f"Identificador desconhecido: '{no.id}'")
        elif isinstance(no, ast.BinOp):
            tipo_op = type(no.op)
            if tipo_op in self.OPERADORES:
                esquerdo = self._visitar(no.left)
                direito = self._visitar(no.right)
                if tipo_op == ast.Div and direito == 0:
                    raise ZeroDivisionError("Divisão por zero não é permitida.")
                return self.OPERADORES[tipo_op](esquerdo, direito)
            raise ValueError(f"Operador binário não suportado: {tipo_op.__name__}")
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
            raise TypeError(f"Expressão não suportada: {type(no).__name__}")


def banner():
    print(f"{CIANO}{NEGRITO}=================================================={RESET}")
    print(f"{VERDE}{NEGRITO}           CALCULADORA PYTHON (CLI INTERATIVO)   {RESET}")
    print(f"{CIANO}{NEGRITO}=================================================={RESET}")
    print(f"Exemplos: 2 + 2, (10 * 5) / 2, sqrt(144), sin(pi / 2), 2 ** 8")
    print(f"Comandos especiais:")
    print(f"  {AMARELO}hist{RESET}  - Ver histórico de cálculos")
    print(f"  {AMARELO}m+{RESET}    - Adicionar valor atual à memória")
    print(f"  {AMARELO}mr{RESET}    - Recuperar valor da memória")
    print(f"  {AMARELO}mc{RESET}    - Limpar memória")
    print(f"  {AMARELO}ajuda{RESET} - Ajuda e funções disponíveis")
    print(f"  {VERMELHO}sair{RESET}  - Finalizar a calculadora")
    print(f"--------------------------------------------------\n")


def loop_calculadora():
    calc = SafeCalculator()
    banner()

    while True:
        try:
            entrada = input(f"{NEGRITO}calc > {RESET}").strip()
        except (KeyboardInterrupt, EOFError):
            print(f"\n{VERDE}Até logo!{RESET}")
            break

        if not entrada:
            continue

        cmd = entrada.lower()
        if cmd in ["sair", "exit", "quit", "q"]:
            print(f"{VERDE}Calculadora encerrada com sucesso.{RESET}")
            break
        elif cmd in ["hist", "historico"]:
            if not calc.historico:
                print(f"{AMARELO}Nenhum cálculo registrado ainda.{RESET}")
            else:
                print(f"{CIANO}--- Histórico de Cálculos ---{RESET}")
                for i, item in enumerate(calc.historico[-10:], 1):
                    print(f" {i}. {item}")
            continue
        elif cmd == "mc":
            calc.memoria = 0.0
            print(f"{AMARELO}Memória limpa: M = 0{RESET}")
            continue
        elif cmd == "mr":
            print(f"{VERDE}Memória (MR): {calc.memoria}{RESET}")
            continue
        elif cmd.startswith("m+"):
            try:
                val = float(cmd.split()[1]) if len(cmd.split()) > 1 else (float(calc.historico[-1].split("=")[-1].strip()) if calc.historico else 0.0)
                calc.memoria += val
                print(f"{VERDE}Memória atualizada: M = {calc.memoria}{RESET}")
            except Exception as e:
                print(f"{VERMELHO}Erro ao atualizar memória: {e}{RESET}")
            continue
        elif cmd in ["ajuda", "help", "?"]:
            print(f"{CIANO}Funções suportadas: sqrt(x), sin(x), cos(x), tan(x), log(x), ln(x), fact(x), abs(x)")
            print(f"Constantes: pi, e, tau | Operadores: +, -, *, /, //, %, **{RESET}")
            continue

        try:
            resultado = calc.avaliar(entrada)
            if isinstance(resultado, float):
                resultado = round(resultado, 8)
                if resultado.is_integer():
                    resultado = int(resultado)
            calc.historico.append(f"{entrada} = {resultado}")
            print(f"{VERDE}{NEGRITO}= {resultado}{RESET}")
        except ZeroDivisionError as err:
            print(f"{VERMELHO}Erro de Divisão: {err}{RESET}")
        except Exception as err:
            print(f"{VERMELHO}Erro: {err}{RESET}")


if __name__ == "__main__":
    loop_calculadora()
