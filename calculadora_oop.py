#!/usr/bin/env python3
"""
Engine de Calculadora Orientada a Objetos
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
        registro = {
            "timestamp": time.time(),
            "operacao": op,
            "termo_a": a,
            "termo_b": b,
            "resultado": self._formatar(resultado)
        }
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
